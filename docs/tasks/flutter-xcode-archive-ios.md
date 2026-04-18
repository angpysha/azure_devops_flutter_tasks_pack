# Xcode Archive for Flutter iOS

**Task name:** `flutter-xcode-archive-ios`  
**Folder:** `tasks/flutter_xcode_archive`

## When to use

Run **Xcode archive** and optionally **export** an IPA using `xcodebuild`, driven from your Flutter iOS workspace.

## Prerequisites

- macOS agent with Xcode.
- For **Export**: **Export options plist** as a **secure file** (downloaded in a pre-job and removed in post-job).

## Task type

| Mode | Purpose |
|------|---------|
| **Archive** | Create `.xcarchive` under your **Archive path**. |
| **Export** | Export IPA using **Export options plist** and **Export path**. |

## Inputs (high level)

**Archive:** project path, archive path, configuration, scheme, workspace, optional signing (sign identity, provisioning profile UUID when signing on archive).  
**Export:** export options plist (secure file), export path.  
**Common:** verbose logging.

## Example (YAML) — archive

```yaml
- task: flutter-xcode-archive-ios@0
  inputs:
    path: '$(Build.SourcesDirectory)/ios'
    archivePath: '$(Build.ArtifactStagingDirectory)/out.xcarchive'
    taskType: 'archive'
    signOnArchive: true
    manualSign: false
    configuration: 'Release'
    scheme: 'Runner'
    workspace: '$(Build.SourcesDirectory)/ios/Runner.xcworkspace'
    verbose: false
```

## Example (YAML) — export

```yaml
- task: flutter-xcode-archive-ios@0
  inputs:
    path: '$(Build.SourcesDirectory)/ios'
    archivePath: '$(Build.ArtifactStagingDirectory)/Runner.xcarchive'
    taskType: 'export'
    exportOptionsPlist: 'ExportOptions.plist'   # secure file name
    exportPath: '$(Build.ArtifactStagingDirectory)/ipa'
    verbose: false
```
