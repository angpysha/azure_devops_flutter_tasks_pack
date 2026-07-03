# Adapt install report

**Project:** Azure DevOps Flutter Tasks Pack  
**Adapt run:** filesystem exploration (graphify skipped — no LLM API key; MCP codebase-search not configured)  
**Confidence:** high

## Detection

| Signal | Match |
|--------|--------|
| TypeScript / Node Azure Pipelines tasks | `tasks/*/index.ts`, `task.json`, root `package.json` |
| VSIX extension packaging | `vss-extension.json`, `tfx-cli`, GitHub publish workflow |
| Flutter CI domain | Task names/docs (Android, iOS, Firebase, TestFlight, Play) |
| GitHub CI/CD | `.github/workflows/ci.yml`, `publish-marketplace.yml` |
| Azure Pipelines (legacy) | `pipelines/build_pipeline.yaml`, `release_pipeline.yaml` |
| Secrets / secure files | Firebase V1/V2, signing, TestFlight, Google Play tasks |

## Recommended packs

| Pack | Score | Rationale |
|------|-------|-----------|
| **node-typescript** | 0.94 | Primary runtime — TypeScript Node tasks, compile via `tsc` |

## Recommended agents

| Agent | Enabled | Rationale |
|-------|---------|-----------|
| coordinator | yes | SDLC hub |
| ba-analyst | yes | Task docs and requirements |
| architect | yes | Extension/task design |
| team-lead | yes | Reviews and planning |
| developer | yes | TypeScript task implementation |
| tester | yes | CI validation |
| devops | yes | GitHub Actions + Marketplace publish |
| security-reviewer | yes | PAT, secure files, credentials handling |
| tech-writer | yes | `docs/` and Marketplace copy |

## Tracker & PR

- **Tracker:** GitHub issues
- **PR:** GitHub → `main`

## Next steps (human)

1. Approve recommendation (or edit `pipeline.manifest.json` overrides).
2. `agentic-tool apply --target .`
3. `specify init . --integration cursor` (if Spec Kit not yet initialized)
4. `/speckit.constitution` seeded from `PROJECT.md`
5. `agentic-tool sync --target . --host auto` + `agentic-tool verify --target .`
