# Resign Flutter iOS app

**Task name:** `flutter-resign-ipa`  
**Folder:** `tasks/flutter_resign_ipa`

## When to use

Re-sign an existing **IPA** with a different **code signing identity** and **provisioning profile** (for example after swapping distribution profiles).

## Prerequisites

- macOS agent with signing tools available to the resign script.
- **Provisioning profile** as a **secure file**, authorized for the pipeline.

## Inputs

| Input | Required | Description |
|--------|----------|-------------|
| Path to ipa file | Yes | IPA to re-sign. |
| Sign identity | Yes | Full identity string, for example `iPhone Distribution: Company (TEAMID)`. |
| Provisioning profile | Yes | Secure file: `.mobileprovision` to embed. |

## Behavior notes

- Pre-job downloads the profile; post-job deletes the temporary file.

## Example (YAML)

```yaml
- task: flutter-resign-ipa@0
  inputs:
    path: '$(Build.ArtifactStagingDirectory)/app.ipa'
    signIdentity: 'iPhone Distribution: Example Inc (XXXXXXXXXX)'
    provisioningProfile: 'AppStore.mobileprovision'
```
