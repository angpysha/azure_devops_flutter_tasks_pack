# Get Xcode Build Dir

**Task name:** `get-xcode-build-dir`  
**Folder:** `tasks/get_xcode_build_dir`

## When to use

After an iOS/Xcode build, expose standard **DerivedData-related paths** as output variables for later steps (copy symbols, upload artifacts, etc.).

## Inputs

| Input | Required | Description |
|--------|----------|-------------|
| Project Name | No (default `Runner`) | iOS project name inside the workspace (often `Runner` for Flutter). |

## Outputs

| Output | Description |
|--------|-------------|
| `buildDir` | Latest matching Xcode **DerivedData** folder for the project name (output variable). |
| `swiftPackagesPath` | `SourcePackages` under that DerivedData folder (output variable). |

Give the step a **`name:`** and reference outputs as `$(<name>.buildDir)` and `$(<name>.swiftPackagesPath)` in following steps.

## Example (YAML)

```yaml
- task: get-xcode-build-dir@0
  name: xcodeDirs
  inputs:
    projectName: 'Runner'

- script: echo "$(xcodeDirs.buildDir)"
```
