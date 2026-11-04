"""Run: python3 -m unittest discover tests"""
import json
import os
import subprocess
import tempfile
import unittest
from pathlib import Path

CLI = Path(__file__).resolve().parent.parent / "bin" / "auto-skills"


class AutoSkillsTest(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp()).resolve()
        self.home = self.tmp / "home"
        self.claude = self.home / ".claude"
        self.lib = self.tmp / "library"
        for cat, skill in [("motion", "remotion-tips"), ("design", "ui-polish"), ("design", "brand"), ("core", "notes")]:
            d = self.lib / cat / skill
            d.mkdir(parents=True)
            (d / "SKILL.md").write_text(f"---\nname: {skill}\ndescription: test\n---\n")
        (self.lib / "motion" / "external-only").mkdir()  # README-only skill: not linkable
        (self.lib / "AUTO").write_text("dep remotion  motion\ndep react  design\nfile *.mp4  notes\n")
        self.env = {**os.environ, "HOME": str(self.home), "CLAUDE_CONFIG_DIR": str(self.claude),
                    "AUTO_SKILLS_CONFIG": str(self.home / "cfg.json")}
        self.run_cli("init", "--library", str(self.lib))

    def run_cli(self, *args, stdin=None, cwd=None):
        out = subprocess.run([str(CLI), *args], input=stdin, cwd=cwd or self.tmp, env=self.env,
                             capture_output=True, text=True, timeout=30)
        return out

    def project(self, name, deps=None, files=()):
        p = self.tmp / name
        p.mkdir()
        subprocess.run(["git", "init", "-q", str(p)], check=True)
        if deps is not None:
            (p / "package.json").write_text(json.dumps({"dependencies": deps}))
        for f in files:
            (p / f).write_text("")
        return p

    def hook(self, project):
        out = self.run_cli("hook", stdin=json.dumps({"cwd": str(project), "source": "startup"}))
        self.assertEqual(out.returncode, 0, out.stderr)
        return json.loads(out.stdout)["hookSpecificOutput"] if out.stdout.strip() else None

    def linked(self, project):
        d = project / ".claude" / "skills"
        return sorted(p.name for p in d.iterdir()) if d.exists() else []

    def test_check_matches_rules(self):
        p = self.project("vid", {"remotion": "4", "react": "19"})
        out = self.run_cli("check", str(p)).stdout
        self.assertIn("remotion-tips", out)
        self.assertIn("ui-polish", out)
        self.assertIn("external-only", out)  # reported as not linkable

    def test_hook_does_nothing_when_off(self):
        p = self.project("vid", {"remotion": "4"})
        self.assertIsNone(self.hook(p))
        self.assertEqual(self.linked(p), [])

    def test_hook_links_and_reloads_when_on(self):
        self.run_cli("on")
        p = self.project("vid", {"remotion": "4"}, files=["clip.mp4"])
        out = self.hook(p)
        self.assertTrue(out["reloadSkills"])
        self.assertEqual(self.linked(p), ["notes", "remotion-tips"])
        self.assertFalse(self.hook(p)["reloadSkills"])  # second session: nothing new
        status = subprocess.run(["git", "-C", str(p), "status", "--porcelain"], capture_output=True, text=True).stdout
        self.assertNotIn(".claude", status)  # links are git-excluded

    def test_hook_skips_opt_out_home_and_library(self):
        self.run_cli("on")
        p = self.project("app", {"react": "19"})
        (p / ".claude").mkdir()
        (p / ".claude" / ".no-auto-skills").write_text("")
        self.assertIsNone(self.hook(p))
        self.home.mkdir(exist_ok=True)
        self.assertIsNone(self.hook(self.home))
        self.assertIsNone(self.hook(self.lib))

    def test_hook_survives_bad_input(self):
        self.run_cli("on")
        out = self.run_cli("hook", stdin="not json")
        self.assertEqual(out.returncode, 0)

    def test_use_on_off_list(self):
        p = self.project("manual")
        self.assertIn("on        brand", self.run_cli("use", "design", cwd=p).stdout)
        self.assertEqual(self.linked(p), ["brand", "ui-polish"])
        self.run_cli("use", "--off", "brand", cwd=p)
        self.assertEqual(self.linked(p), ["ui-polish"])
        self.assertIn("ui-polish", self.run_cli("use", "--list", cwd=p).stdout)

    def test_use_leaves_foreign_skills_alone(self):
        p = self.project("mixed")
        mine = p / ".claude" / "skills" / "brand"
        mine.mkdir(parents=True)  # a real project skill with the same name
        self.run_cli("use", "design", cwd=p)
        self.assertFalse(mine.is_symlink())
        self.run_cli("use", "--off", "design", cwd=p)
        self.assertTrue(mine.is_dir())

    def test_install_hook_is_idempotent_and_keeps_other_hooks(self):
        self.claude.mkdir(parents=True)
        other = {"type": "command", "command": "echo other"}
        (self.claude / "settings.json").write_text(json.dumps(
            {"permissions": {"allow": ["x"]}, "hooks": {"SessionStart": [{"hooks": [other]}]}}))
        self.assertIn("installed", self.run_cli("install-hook").stdout)
        self.assertIn("updated", self.run_cli("install-hook").stdout)
        s = json.loads((self.claude / "settings.json").read_text())
        cmds = [h["command"] for g in s["hooks"]["SessionStart"] for h in g["hooks"]]
        self.assertEqual(cmds.count("echo other"), 1)
        self.assertEqual(sum("auto-skills" in c for c in cmds), 1)
        self.assertEqual(s["permissions"], {"allow": ["x"]})
        self.assertTrue(list(self.claude.glob("settings.json.bak-*")))
        self.assertIn("removed", self.run_cli("uninstall-hook").stdout)
        s = json.loads((self.claude / "settings.json").read_text())
        self.assertEqual([h["command"] for g in s["hooks"]["SessionStart"] for h in g["hooks"]], ["echo other"])


if __name__ == "__main__":
    unittest.main()
