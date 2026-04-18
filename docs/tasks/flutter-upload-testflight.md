# Upload to TestFlight

**Task name:** `flutter-upload-testflight`  
**Folder:** `tasks/flutter_upload_ipa_testflight`

## When to use

Upload **IPA** and/or **PKG** builds to **TestFlight** using Fastlane **pilot**.

## Prerequisites

- macOS agent with **Ruby** and **fastlane** installed.
- App Store Connect **API key** (`.p8`) stored as a **secure file** and authorized for the pipeline.
- Apple identifiers: **Key ID**, **Issuer ID**; **Team ID** optional depending on your account.

## Inputs

| Input | Required | Description |
|--------|----------|-------------|
| IPA file | No* | Path to `.ipa`. |
| PKG file | No* | Path to `.pkg`. |
| p8 key file | Yes | Secure file: App Store Connect API private key. |
| Key ID | Yes | From [Keys](https://developer.apple.com/account/resources/authkeys/list). |
| issuerId | Yes | From the same Keys page. |
| Team ID | No | From [Membership](https://developer.apple.com/account/#/membership). |
| Duration | No | Token/session style duration (seconds); default 500. |
| Wait until App Store processing is finished | Yes | Maps to pilot wait behavior. |
| Verbose | No | Extra logging. |

\*At least one of **IPA** or **PKG** must be provided with a valid path.

## Behavior notes

- Pre-job downloads the `.p8`; post-job removes the temp copy.

## Example (YAML)

```yaml
- task: flutter-upload-testflight@0
  inputs:
    ipaFile: '$(Build.ArtifactStagingDirectory)/Runner.ipa'
    keyFile: 'AuthKey_XXXXX.p8'
    keyId: 'XXXXXXXXXX'
    issuerId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
    teamId: 'XXXXXXXXXX'
    waitProcessing: true
```
