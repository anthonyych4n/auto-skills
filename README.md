# auto-skills

**The right Claude Code skills for each project, turned on automatically.**


Everything in `~/.claude/skills` loads into every session, so your video skills sit in your app
repo and your design skills sit in your video repo. auto-skills keeps your skills in a library and,
when a session starts, turns on only the ones that project needs:

```
~/Projects/launch-video  (remotion in package.json)  →  motion skills + stageshow
~/Projects/my-app        (next, tailwindcss)          →  design skills
~/Projects/notes         (nothing matches)            →  nothing extra
```

The skills are linked into `<project>/.claude/skills/` and git-excluded, so they never get committed.

## Install

As a Claude Code plugin (recommended):

```
/plugin marketplace add anthonyych4n/auto-skills
/plugin install auto-skills@auto-skills
```

Then tell Claude **"set up auto-skills"**. It asks where your skills are, writes the config, and
helps you tune the rules.

Without the plugin system:

```bash
git clone https://github.com/anthonyych4n/auto-skills ~/Projects/auto-skills
ln -s ~/Projects/auto-skills/bin/auto-skills ~/.local/bin/auto-skills
auto-skills init --library ~/path/to/your/skills
auto-skills install-hook          # adds a SessionStart hook to ~/.claude/settings.json (backed up first)
```

Needs `python3` (preinstalled on macOS with the Xcode command line tools, and on most Linux distros).

## Your library

Any folder of skills works:

```
my-skills/                         my-skills/
  AUTO                               AUTO
  stageshow/SKILL.md                 design/stageshow/SKILL.md
  remotion-tips/SKILL.md             design/ui-polish/SKILL.md
                                     motion/remotion-tips/SKILL.md
     (flat)                            (categories: a rule can turn on a whole folder)
```

## Rules (`<library>/AUTO`)

```
# <check> <value>        <skills or categories...>
dep  remotion            motion stageshow     # package.json dependency (globs ok: @remotion/*)
dep  next                design
file components.json     design               # file or glob in the project root
file *.xcodeproj         ios
```

`init` copies [rules.example](rules.example) into your library to start from. Rules that name
skills you don't have are skipped.

## Commands

| Command | What it does |
|---|---|
| `auto-skills check [dir]` | preview what a project would get |
| `auto-skills use <skill/category>` | turn on for the current project by hand (`--off`, `--list`) |
| `auto-skills off` / `on` | pause / resume automatic mode |
| `auto-skills status` | mode, hook, library |
| `touch .claude/.no-auto-skills` | opt one project out |

## How it works

A `SessionStart` hook reads the project's `package.json` and root files, matches them against your
rules, links the matching skills, and returns `reloadSkills: true` so they're available in that same
session. It never touches `~/.claude/skills`, so two sessions in different projects can't interfere
with each other. It runs in about 0.1 s and exits quietly on anything unexpected.

## Develop

```bash
python3 -m unittest discover tests
cd demo && npm install && npm run studio   # the launch clip, made with Remotion
npm run render                              # → demo/out/launch-{16x9,9x16}.mp4
```

MIT licensed.
