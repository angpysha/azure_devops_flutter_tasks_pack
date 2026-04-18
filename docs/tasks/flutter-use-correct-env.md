# Flutter use correct env

**Task name:** `flutter-use-correct-env`  
**Folder:** `tasks/flutter_use_correct_env`

## When to use

In a repo with multiple `.env.*` files under an assets folder, **keep only the selected environments** and remove others so the Flutter build only bundles the intended env files (typical for flavor-specific builds).

## Prerequisites

- `.env` files present under the folder you specify (naming like `.env.staging`).
- `pubspec.yaml` lists env assets the task will rewrite.

## Inputs

| Input | Required | Description |
|--------|----------|-------------|
| Path to env folder with .env files | Yes | Directory containing env files. |
| Env names | Yes | Comma-separated **names** matching suffixes (for example `staging,prod` for `.env.staging`). |
| Path to pubspec.yaml file | Yes | `pubspec.yaml` to update `flutter.assets` entries. |

## Example (YAML)

```yaml
- task: flutter-use-correct-env@0
  inputs:
    envFolderPath: '$(Build.SourcesDirectory)/assets/env'
    envNames: 'staging'
    pubspecPath: '$(Build.SourcesDirectory)/pubspec.yaml'
```

Run this **before** `flutter pub get` / build steps that read assets.
