# Build Flutter iOS app

**Task name:** `flutter-build-ios`  
**Folder:** `tasks/flutter_build_ios`

## When to use

Build an **iOS** artifact or **IPA** from a Flutter project (often before archive/sign steps).

## Prerequisites

- Flutter SDK (or FVM) and Xcode on the agent.
- Signing inputs depend on your pipeline; **Do not sign** can be used for unsigned simulator-style outputs where applicable.

## Inputs

| Input | Required | Description |
|--------|----------|-------------|
| Path to project folder | Yes | Folder with `pubspec.yaml`. |
| Build release | Yes | Release-style build. |
| Build flavor | No | iOS flavor / scheme-related configuration as used by your app. |
| Bundle type | Yes | `ios` or `ipa`. |
| Do not sign | Yes | Skip signing when building. |
| Obfuscate | No | Dart obfuscation. |
| Split debug info | When obfuscate is true | Folder for split debug info. |
| Use FVM | No | Use FVM. |
| FVM version | When Use FVM is true | Flutter version. |

## Example (YAML)

```yaml
- task: flutter-build-ios@0
  inputs:
    path: '$(Build.SourcesDirectory)'
    isRelease: true
    bundleType: 'ipa'
    nosign: false
```
