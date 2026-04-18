# Run Melos command

**Task name:** `flutter-melos`  
**Folder:** `tasks/flutter_melos`

## When to use

Run [Melos](https://melos.invertase.dev/) commands in a **mono-repo** (bootstrap, version, publish, etc.).

## Prerequisites

- Melos available on the agent (typically via `dart pub global activate melos` or project scripts).
- Checked-out sources at the path you configure.

## Inputs

| Input | Required | Description |
|--------|----------|-------------|
| Path to project folder | Yes | Root of the Melos workspace. |
| Melos command | Yes | One of: `version`, `bootstrap`, `run`, `exec`, `clean`, `list`, `publish`. |
| Melos command arguments | No | Extra arguments passed to Melos. |

## Example (YAML)

```yaml
- task: flutter-melos@0
  inputs:
    path: '$(Build.SourcesDirectory)'
    command: 'bootstrap'
    commandArgs: '--no-example'
```
