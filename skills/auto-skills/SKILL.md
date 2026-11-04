---
name: auto-skills
description: Set up and manage auto-skills, which turns skills on per project at session start. Use when the user wants to set up auto-skills, point it at their skills folder, add or change a rule ("turn on my video skills in Remotion projects"), turn a skill or category on/off for the current project, check what a project gets, or turn auto mode on/off.
---

# auto-skills

The CLI lives at `../../bin/auto-skills` relative to this skill's base directory. Call it with
`python3 <that path> <command>`. Every command prints plain text; show the user the relevant lines.

## Set up (first time)

1. Ask where their skills live. Common answers: a git repo of skills, or `~/.claude/skills`.
   Suggest moving project-specific skills OUT of `~/.claude/skills` into a library folder, since
   everything in `~/.claude/skills` loads in every session anyway.
2. `init --library <dir>`. It copies starter rules to `<dir>/AUTO` if none exist.
3. Read `<dir>/AUTO` with them and rewrite targets to match their real skill or category folder
   names. Library layout can be flat (`<dir>/<skill>/SKILL.md`) or grouped
   (`<dir>/<category>/<skill>/SKILL.md`); a category name turns on every skill in it.
4. `check <a project dir>` to show what that project would get.
5. Tell them it's on: new sessions in a matching project load those skills automatically.

## Rules (`<library>/AUTO`)

One per line: `<dep|file> <value> <skills or categories...>`.
- `dep` matches package.json dependencies/devDependencies (globs ok: `@remotion/*`).
- `file` matches a file or glob in the project root (`*.xcodeproj`, `pyproject.toml`).

Add rules the user describes in plain words. Run `check` afterwards to prove the rule fires.

## Day to day

| User says | Run |
|---|---|
| turn on X for this project | `use X` (skill or category), from the project root |
| turn X off here | `use --off X` |
| what's on here | `use --list` |
| what would this project get | `check` |
| stop doing it automatically / start again | `off` / `on` |
| status | `status` |

Links go in `<project>/.claude/skills/` and are git-excluded, so they never get committed. Newly
linked skills load right away at session start; ones linked mid-session load on the next session or
`/clear`. Opt one project out with `touch .claude/.no-auto-skills`.
