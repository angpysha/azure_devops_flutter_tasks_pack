# Azure DevOps Flutter Tasks Pack Constitution

## Core Principles

### I. Reusable pipeline tasks over custom scripts
Every capability ships as an Azure DevOps task with clear inputs, docs, and Marketplace packaging.
Teams should configure tasks in YAML/classic pipelines instead of copying shell scripts per repo.

### II. TypeScript task-lib consistency
Tasks live under `tasks/<name>/` with `task.json`, `index.ts`, and compiled `index.js`.
Match existing naming, azure-pipelines-task-lib patterns, and per-task `package.json` layout.

### III. Secrets never in source
Credentials use secure files, service connections, or CI secrets — never committed to the repo.
Document required secrets in task docs and workflow comments only.

### IV. Marketplace-safe versioning
Bump `vss-extension.json` and task `task.json` versions intentionally (major for breaking task API changes).
Public extensions stay public; publish via authorized publisher PAT with Marketplace (Manage) scope.

### V. Documentation follows the task
Each packaged task has a matching file under `docs/tasks/`. Keep `overview.md` aligned with Marketplace copy.

## Technology constraints

- Node.js 20+, TypeScript, `tfx-cli` for VSIX packaging
- CI: GitHub Actions (primary) + legacy Azure Pipelines under `pipelines/`
- Domain: Flutter mobile CI/CD (Android, iOS, Firebase, TestFlight, Google Play)

## Development workflow

- Minimal, focused diffs — reuse existing task patterns before adding abstractions
- Build gate: `npm run install_packages && npm run compile_tasks`
- Release gate: VSIX packages in CI; Marketplace publish on tagged releases
- SDLC artifacts under `docs/sdlc/` when using the agentic pipeline

## Governance

This constitution guides Spec Kit phases and agentic SDLC work. Amend via PR with rationale.
`PROJECT.md` is the human brief; this file is the machine-checkable source of truth for agents.

**Version**: 1.0.0 | **Ratified**: 2026-07-03 | **Last Amended**: 2026-07-03
