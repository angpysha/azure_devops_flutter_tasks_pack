# Upload to Google Play

**Task name:** `flutter-upload-aab-googleplay`  
**Folder:** `tasks/flutter_upload_aab_googleplay`

## When to use

Upload an **AAB** to **Google Play** using Fastlane **supply**.

## Prerequisites

- Agent with **Ruby** and **fastlane**.
- Play Console **service account JSON** (API access) as a **secure file**, authorized for the pipeline.
- Application **package name** matching Play Console.

## Inputs

| Input | Required | Description |
|--------|----------|-------------|
| AAB file | Yes | Path to the bundle to upload. |
| JSON key file | Yes | Secure file: Google Play API JSON key. |
| Package ID | Yes | Android application id (for example `com.example.app`). |
| Track | Yes | `internal`, `alpha`, `beta`, or `production`. |
| Verbose | No | Extra logging. |

## Behavior notes

- Pre-job downloads the JSON key; post-job deletes the temp file.

## Example (YAML)

```yaml
- task: flutter-upload-aab-googleplay@0
  inputs:
    aabFile: '$(Build.ArtifactStagingDirectory)/app-release.aab'
    keyFile: 'play-api-key.json'
    packageId: 'com.example.myapp'
    track: 'internal'
```

See [Google Play API access](https://play.google.com/console/u/0/developers/api-access) to create the key.
