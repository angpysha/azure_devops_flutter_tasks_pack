# Upload Flutter app to Firebase

**Task name:** `flutter-firebase`  
**Folder:** `tasks/flutter_firebase`

## When to use

Run **Firebase CLI** workflows from a pipeline: **App Distribution**, **custom** `firebase` commands, **iOS symbol upload** helper, or **Crashlytics** Flutter debug info upload.

## Prerequisites

- `firebase` on the agent `PATH`, logged in not required when using a **service account**.
- For modes that need GCP auth (**Distribute**, **Custom**): Google **service account JSON** as a **secure file** (`credentials`).

## Task type (`Type`)

| Type | What it does | Auth / extras |
|------|----------------|---------------|
| **Distribute** | `firebase appdistribution:distribute` | Secure file: Google service account JSON; app id, groups, binary path, optional release notes file. |
| **Custom** | Runs `firebase` with your arguments | Same service account secure file. |
| **Upload iOS symbols** | Invokes native uploader with `-gsp` | Secure file: Google Services / plist used as `-gsp`; paths to uploader and symbol folders. |
| **Upload Flutter debug info** | `firebase crashlytics:symbols:upload` | Firebase app id + debug info folder; no service account download in this path in the current implementation. |

Set **No interactive** as needed for CI (`--no-interactive`).

## Service account (V1)

Upload the JSON key under **Pipelines → Library → Secure files**, authorize the pipeline, then select it in **Google service account credentials**.

## Example (YAML) — App Distribution

```yaml
- task: flutter-firebase@0
  inputs:
    type: 'distribute'
    path: '$(Build.ArtifactStagingDirectory)/app.apk'
    appId: '1:1234567890:android:abcdef'
    groups: 'internal-testers'
    credentials: 'firebase-ci-sa.json'
    nointeractive: true
```

Use the **secure file name** exactly as registered in Library.

## See also

- [Upload Flutter app to Firebase V2](flutter-firebase-v2.md) (service connection instead of secure file for GCP key)  
- [Flutter Firebase GCP service connection](flutter-firebase-gcp-sa.md)
