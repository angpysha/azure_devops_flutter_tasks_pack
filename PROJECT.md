# Azure DevOps Flutter Tasks Pack

> Living project brief for the agentic SDLC pipeline.
> Edit anytime — re-run `Run .agents adapt --update` to refresh pack/agent recommendations.

## Vision

Provide reusable Azure DevOps pipeline tasks so Flutter teams can build, sign, archive, and
distribute mobile apps (Android/iOS) without maintaining custom shell scripts in every repo.
Success means reliable Marketplace-published tasks, clear per-task documentation, and CI that
packages and publishes the VSIX extension safely.

## Stack

- **Language:** TypeScript (Node 20, Azure Pipelines task-lib)
- **Runtime:** Node.js — one package per task under `tasks/`
- **Build:** `npm run install_packages` + `npm run compile_tasks`; VSIX via `tfx-cli`
- **Domain:** Flutter mobile CI/CD (Android AAB, iOS IPA, Firebase, TestFlight, Google Play)
- **Extension:** `vss-extension.json` → Visual Studio Marketplace (`AndriiPetrovskyi`)
- **CI/CD:** GitHub Actions (`.github/workflows/`) + legacy Azure Pipelines (`pipelines/`)
- **Docs:** Markdown under `docs/` and `overview.md` for Marketplace

## Delivery

- **Tracker:** GitHub issues (repo on GitHub; no beads workspace)
- **PR:** GitHub (`main` target branch)
- **Default lane:** full
- **Hosting:** GitHub; extension distributed via Azure DevOps Marketplace

## Open questions

- Retire Azure Pipelines build/release in favor of GitHub Actions only, or keep both?
- Add automated tests for task TypeScript logic beyond compile + VSIX packaging?
