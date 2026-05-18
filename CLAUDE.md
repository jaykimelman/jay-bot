# Project Structure

This is a [thepopebot](https://github.com/stephengpope/thepopebot) project.

## Directories

- **`agent-job/`** — Agent job configuration: system prompt (`SYSTEM.md`), heartbeat prompt, and cron schedules (`CRONS.json`).
- **`coding-workspace/`** — Optional system prompt (`SYSTEM.md`) for code mode workspaces. Empty by default.
- **`agents/`** — Custom agent definitions. Each subdirectory defines an agent (see Managing Agents below).
- **`event-handler/`** — Event handler configuration: chat system prompts, trigger definitions (`TRIGGERS.json`), cluster templates, and LiteLLM proxy config.
- **`skills-library/`** — Canonical skill source. All `SKILL.md` files and scripts live here.
- **`skills/`** — Activation surface. Each entry is a symlink to `../skills-library/<name>` — present means active, absent means deactivated. Coding agents only see skills symlinked here.
- **`data/`** — Runtime data (SQLite database, cluster state). Not checked into git.
- **`logs/`** — Agent job logs, organized by job ID. Not checked into git.

## Files

- **`docker-compose.yml`** — Container definitions for the event handler and LiteLLM proxy. Managed — do not edit.
- **`docker-compose.custom.yml`** — Your Docker Compose overrides for SSL/HTTPS setup. Merged with the main compose file. User-owned — not overwritten on upgrade.
- **`docker-compose.override.yml`** — Your Docker Compose overrides for HTTP (ngrok) setup. Auto-merged by Docker Compose, user-owned — not overwritten on upgrade.
- **`.env`** — Environment variables (API keys, secrets). Never committed to git.

## Survey Server

- **`survey-server/`** — Lightweight Node.js/Express service for survey entry point
  - `server.js` — Simple redirect server that serves a minimal landing page at `/survey?id=...`
  - Shows brief context about Automation Edgers, then redirects to `https://domain/chat/{surveyId}`
  - Auto-redirects after 5 seconds or on user click
  - Configured in `docker-compose.override.yml` (HTTP/ngrok) and `docker-compose.custom.yml` (HTTPS/SSL)
  - Routed via Traefik: requests to `/survey` → survey-server, everything else → thepopebot's native chat

## Survey Flow

1. User receives email: `https://domain/survey?id=abc12345`
2. Clicks link → lands on survey-server's minimal landing page
3. After 5 seconds or on click → redirects to `https://domain/chat/abc12345`
4. Opens thepopebot's native chat with surveyId as the threadId
5. Chat loads → **accounting-survey skill detects surveyId pattern and triggers automatically**
6. Skill begins 12-stage discovery interview
7. Survey responses saved to Airtable on completion

## Managed Files

Some files are auto-synced by `npx thepopebot init` and will be overwritten on every init/upgrade. Do not edit these:

- `.github/workflows/` — CI/CD workflows
- `docker-compose.yml`
- `.dockerignore`
- `.gitignore`

The `CLAUDE.md` files scattered through the project tree (e.g. `agent-job/CLAUDE.md`, `agents/CLAUDE.md`, `event-handler/CLAUDE.md`, `skills/CLAUDE.md`, `skills-library/CLAUDE.md`) are scaffolded by `init` from `*.template` sources but are **not** in the managed-paths list — they will not be overwritten if you have edited them. Run `npx thepopebot reset <path>` to restore one to its template default, or `npx thepopebot diff <path>` to see your local changes.

## Agent Scoping

Agents can be scoped to subdirectories within the repository. When a chat is launched with a scope (e.g., `agents/gary-vee`), the coding agent runs with that directory as its working directory.

### Directory Structure

```
agents/
  gary-vee/
    CLAUDE.md         ← agent-specific context (optional)
    SYSTEM.md         ← agent-specific system prompt (optional)
    skills/           ← agent-specific skills (optional, overrides root skills/ for this scope)
      agent-job-secrets → ../../../skills-library/agent-job-secrets  (symlink)
      custom-skill/
```

### How Scoping Works

- **Working directory** — The agent's cwd is set to the scoped directory. It still has access to the full repo.
- **Skills** — If the scoped directory has a `skills/` folder, those skills are used. If not, the root `skills/` folder is used as a fallback. Sub-agent skills can symlink back to entries in the canonical `skills-library/` (e.g. `agents/<name>/skills/agent-job-secrets → ../../../skills-library/agent-job-secrets`).
- **CLAUDE.md** — The coding agent automatically picks up `.claude/` and `CLAUDE.md` files relative to its working directory.
- **Default scope** — When no scope is selected, the agent runs from the repository root with root-level skills.

## Agents

(No agents configured yet.)
