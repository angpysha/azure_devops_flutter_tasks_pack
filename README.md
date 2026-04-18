# Azure DevOps Flutter Tasks Pack

[![Flutter](https://img.shields.io/badge/Flutter-blue?logo=flutter)](https://github.com/flutter/flutter)

Collection of Azure DevOps pipeline tasks for **Flutter** CI/CD: Android/iOS builds, signing, Xcode archive, Firebase App Distribution, TestFlight, Google Play, and small utilities (env files, build numbers, path checks).

## Quick start

1. **Install** the extension from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/) (publisher: **AndriiPetrovskyi**, extension id: `flutter-build-help-tools`).
2. In your **Azure DevOps** project, open **Pipelines** → edit a YAML or classic pipeline.
3. **Add a task** → search for **Flutter** or the task friendly name (for example **Build Flutter Android app**).
4. Fill in **inputs** (paths are usually under `$(Build.SourcesDirectory)`).
5. For tasks that need secrets, use **Library → Secure files** and/or **Service connections** as described in the task doc.

**YAML tip:** Use the task `name` from the docs (for example `flutter-build-android@<major>`). The **major version** (`@0`, `@1`, …) must match the version offered in the task picker after installation.

## Documentation layout

| Location | Content |
|----------|---------|
| [docs/index.md](docs/index.md) | Overview, typical pipeline flow, and links to every task |
| [docs/tasks/](docs/tasks/) | **One markdown file per task** — how to use, prerequisites, inputs, examples |
| [docs/tasks/README.md](docs/tasks/README.md) | Index table of all task docs |
| [overview.md](overview.md) | Short copy used on the Marketplace extension **Details** tab |

Start from **[docs/index.md](docs/index.md)** or open the file for the task you need under **[docs/tasks/](docs/tasks/)**.

## Repository layout

- `tasks/<task_folder>/` — TypeScript source, `task.json`, and compiled `index.js` (from `yarn compile_tasks` in CI).
- `vss-extension.json` — Extension manifest, version, packaged folders, and contributions (including the **Flutter Firebase GCP service** connection type for Firebase V2).

## Build the VSIX locally

```bash
yarn install_packages
yarn compile_tasks
npx tfx-cli extension create --manifest-globs ./vss-extension.json
```

Requires Node.js, `typescript` / `tsc` (see `pipelines/build_pipeline.yaml` for the reference CI steps), and [TFX CLI](https://www.npmjs.com/package/tfx-cli) for packaging.
