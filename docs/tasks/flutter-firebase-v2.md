# Upload Flutter app to Firebase V2

**Task name:** `flutter-firebase-v2`  
**Folder:** `tasks/flutter_firebase_v2`

Same capabilities as [Upload Flutter app to Firebase](flutter-firebase.md) (**V1**), except **Distribute** and **Custom** use a **service connection** for the GCP service account JSON instead of a secure file.

## One-time setup

Create a **[Flutter Firebase GCP service connection](flutter-firebase-gcp-sa.md)** and grant your pipeline access to it.

## Task type (`Type`)

| Type | GCP credentials |
|------|------------------|
| **Distribute** | **GCP service account (service connection)** — required. |
| **Custom** | Same service connection — required. |
| **Upload iOS symbols** | Still uses **Google services json** as a **secure file** (unchanged from V1). |
| **Upload Flutter debug info** | Same as V1 (Firebase app id + debug info path). |

## How authentication works (Distribute / Custom)

1. The task reads the JSON from the selected service connection (certificate field).
2. It writes a temp file under `Agent.TempDirectory` and sets `GOOGLE_APPLICATION_CREDENTIALS`.
3. It runs the Firebase CLI, then **always** deletes the temp file in `finally` and clears the variable.

## Example (YAML) — App Distribution

```yaml
- task: flutter-firebase-v2@0
  inputs:
    type: 'distribute'
    path: '$(Build.ArtifactStagingDirectory)/app.apk'
    appId: '1:1234567890:android:abcdef'
    groups: 'internal-testers'
    firebaseServiceConnection: 'MyFirebaseGcpConnection'
    nointeractive: true
```

`firebaseServiceConnection` must be the **name** of the service connection as referenced in YAML (same as other `AzureSubscription@` style inputs).

## When to prefer V2

- Centralize and reuse the same GCP key via **Service connections**.
- Avoid per-pipeline secure file wiring for the service account (iOS `googleServicesJson` may still use a secure file).
