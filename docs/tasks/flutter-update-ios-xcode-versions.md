# Update iOS Xcode marketing and build version

**Task name:** `flutter-update-ios-xcode-versions`  
**Folder:** `tasks/flutter_update_ios_xcode_versions`

## When to use

Set **Xcode marketing version** and **build number** in `project.pbxproj` for Flutter (or native) iOS projects—equivalent to common PowerShell snippets that update `MARKETING_VERSION` and `CURRENT_PROJECT_VERSION`. All matching lines in the file are updated (useful when **iPhone** and **Watch** targets share the same `.xcodeproj`).

This task does **not** edit `pubspec.yaml`; use **Replace build number** for that.

## Prerequisites

- Checked-out sources on the agent (typically a **macOS** agent for iOS builds).
- Path to the folder that **contains** `{xcodeprojName}.xcodeproj` (often `$(Build.SourcesDirectory)/ios` for Flutter).

## Inputs

| Input | Required | Description |
|--------|----------|-------------|
| iOS project root | Yes | Directory containing the `.xcodeproj` bundle. |
| Xcode project name | No (default `Runner`) | Project name without `.xcodeproj` (usually `Runner`). |
| Marketing version | Yes | Replaces `MARKETING_VERSION = …;` (e.g. `1.2.3` or `${{ parameters.app_version }}`). |
| Build number | Yes | Replaces `CURRENT_PROJECT_VERSION = …;` (e.g. `$(Build.BuildNumber)`). |

Semicolons and newlines are not allowed inside marketing version or build number values (safety check).

## Behavior

1. Opens `{iosProjectRoot}/{xcodeprojName}.xcodeproj/project.pbxproj`.
2. Globally replaces `MARKETING_VERSION = [digits and dots];` with your marketing version.
3. Globally replaces `CURRENT_PROJECT_VERSION = [digits];` with your build number.

If a pattern matches **zero** lines, the task still succeeds but emits a **warning** for that pattern.

## Example (YAML)

Replaces an inline PowerShell step such as:

```yaml
- task: flutter-update-ios-xcode-versions@0
  displayName: 'Update iOS version and build number for Watch app'
  inputs:
    iosProjectRoot: '${{ parameters.ios_root_app_path }}'
    xcodeprojName: 'Runner'
    marketingVersion: '${{ parameters.app_version }}'
    buildNumber: '$(Build.BuildNumber)'
```

Use the **task major version** from the Marketplace (for example `@0`) in real pipelines.

If the Watch app uses a **different** `.xcodeproj`, add a second task step with the appropriate `iosProjectRoot` and `xcodeprojName`.
