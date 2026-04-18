# Sign AAB

**Task name:** `flutter-sign-aab`  
**Folder:** `tasks/flutter_sign_aab`

## When to use

Sign an **Android App Bundle** (`.aab`) with `jarsigner` using a Java keystore.

## Prerequisites

- **Keystore** uploaded as a **Library → Secure file** and granted to the pipeline.
- `jarsigner` available on the agent (JDK).

## Inputs

| Input | Required | Description |
|--------|----------|-------------|
| AAB file | Yes | Path to the `.aab` to sign. |
| Keystore file | Yes | Secure file: signing keystore. |
| Keystore password | Yes | Keystore password (use a secret variable). |
| Key alias | Yes | Signing key alias inside the keystore. |
| Verbose | No | Verbose `jarsigner` output. |

## Behavior notes

- A **pre-job** downloads the keystore to the agent; a **post-job** deletes the temporary copy.

## Example (YAML)

```yaml
- task: flutter-sign-aab@0
  inputs:
    aabFile: '$(Build.ArtifactStagingDirectory)/app-release.aab'
    keystoreFile: 'my-release.keystore'
    keystorePassword: '$(KEYSTORE_PASSWORD)'
    keyAlias: 'upload'
```

Secure file `my-release.keystore` must be authorized for the pipeline.
