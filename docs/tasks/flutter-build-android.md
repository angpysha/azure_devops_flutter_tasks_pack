# Build Flutter Android app

**Task name:** `flutter-build-android`  
**Folder:** `tasks/flutter_build_android`

## When to use

Produce an **APK** or **AAB** from a Flutter project on the agent (release or debug-style build via **Build release**).

## Prerequisites

- Flutter SDK (or **FVM** if **Use FVM** is enabled) on the agent.
- Android toolchain as required by your project.

## Inputs

| Input | Required | Description |
|--------|----------|-------------|
| Path to project folder | Yes | Repository root or app folder containing `pubspec.yaml`. |
| Build release | Yes | Release vs non-release style build. |
| Build flavor | No | Android flavor name, if you use flavors. |
| Obfuscate | No | Enable Dart obfuscation. |
| Split debug info | When obfuscate is true | Output folder for split debug info. |
| Bundle type | Yes | `apk` or `aab`. |
| Use FVM | No | Run via FVM. |
| FVM version | When Use FVM is true | Flutter version for FVM. |

## Example (YAML)

```yaml
- task: flutter-build-android@0
  inputs:
    path: '$(Build.SourcesDirectory)'
    isRelease: true
    bundleType: 'aab'
    buildFlavor: 'prod'
```
