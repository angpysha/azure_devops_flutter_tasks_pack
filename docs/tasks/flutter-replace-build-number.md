# Replace build number

**Task name:** `flutter-replace-build-number`  
**Folder:** `tasks/replace-build-number`

## When to use

Rewrite **version** and **build number** segments in `pubspec.yaml` before build (often from `Build.BuildId` or release variables).

## Inputs

| Input | Required | Description |
|--------|----------|-------------|
| Build number | Yes | Integer build segment after `+` in `version: x.y.z+build`. |
| Version string | Yes | Semantic part before `+` (for example `1.2.3`). |
| Path to pubspec.yaml | Yes | `pubspec.yaml` to edit. |
| Incriment build number | No | Optional increment applied to the build number (see task spelling in UI). |

## Example (YAML)

```yaml
- task: flutter-replace-build-number@0
  inputs:
    buildNumber: '$(Build.BuildId)'
    versionString: '1.0.0'
    pubspecPath: '$(Build.SourcesDirectory)/pubspec.yaml'
```
