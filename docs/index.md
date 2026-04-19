# Azure DevOps Flutter Tasks Pack Documentation

## Overview

Azure DevOps Flutter Tasks Pack provides reusable pipeline tasks to build, sign, archive, and distribute Flutter apps without maintaining custom scripts in every repository.

**Per-task guides** live in [`docs/tasks/`](tasks/README.md) (one `.md` file per task, plus the Firebase GCP service connection doc).

## Installation

1. Install the extension from the Azure DevOps Marketplace.
2. Open your Azure DevOps project.
3. Edit a pipeline and add tasks from this extension.
4. Open the matching file under [`docs/tasks/`](tasks/README.md) for inputs, prerequisites, and YAML examples.

## Typical pipeline flow

1. Prepare Flutter environment (optionally **Run flutter doctor**).
2. Build Android (`APK` or `AAB`) and/or iOS (`IPA`) artifacts (update **pubspec.yaml** or **`project.pbxproj`** versions earlier in the job if needed).
3. Sign or re-sign release artifacts when needed.
4. Upload builds to Firebase App Distribution, TestFlight, or Google Play.

## Available tasks (links)

| Task | Description | Documentation |
|------|-------------|----------------|
| Check path | Checks if a path exists. | [check-path.md](tasks/check-path.md) |
| Build Flutter Android app | Builds Android artifacts with custom parameters. | [flutter-build-android.md](tasks/flutter-build-android.md) |
| Build Flutter iOS app | Builds iOS artifacts with custom parameters. | [flutter-build-ios.md](tasks/flutter-build-ios.md) |
| Run Melos command | Runs Melos commands in mono-repositories. | [flutter-melos.md](tasks/flutter-melos.md) |
| Run flutter doctor | Validates Flutter environment and prints diagnostics. | [flutter-run-doctor.md](tasks/flutter-run-doctor.md) |
| Sign AAB | Signs Android AAB using `jarsigner`. | [flutter-sign-aab.md](tasks/flutter-sign-aab.md) |
| Replace build number | Updates `pubspec.yaml` build number. | [flutter-replace-build-number.md](tasks/flutter-replace-build-number.md) |
| Update iOS Xcode marketing and build version | Updates `MARKETING_VERSION` / `CURRENT_PROJECT_VERSION` in `project.pbxproj`. | [flutter-update-ios-xcode-versions.md](tasks/flutter-update-ios-xcode-versions.md) |
| Xcode Archive for Flutter iOS | Archives iOS app with Xcode and exports output. | [flutter-xcode-archive-ios.md](tasks/flutter-xcode-archive-ios.md) |
| Resign Flutter iOS app | Re-signs an IPA with a new provisioning profile. | [flutter-resign-ipa.md](tasks/flutter-resign-ipa.md) |
| Upload Flutter app to Firebase | Firebase CLI: App Distribution, symbols, Crashlytics, custom (GCP key via **secure file**). | [flutter-firebase.md](tasks/flutter-firebase.md) |
| Upload Flutter app to Firebase V2 | Same as Firebase task; **Distribute/Custom** use a **GCP service connection**. | [flutter-firebase-v2.md](tasks/flutter-firebase-v2.md) |
| Flutter Firebase GCP service connection | Service endpoint (not a task); stores SA JSON for Firebase V2. | [flutter-firebase-gcp-sa.md](tasks/flutter-firebase-gcp-sa.md) |
| Upload to TestFlight | Uploads IPA/PKG to TestFlight using Fastlane Pilot. | [flutter-upload-testflight.md](tasks/flutter-upload-testflight.md) |
| Upload to Google Play | Uploads AAB to Google Play using Fastlane. | [flutter-upload-aab-googleplay.md](tasks/flutter-upload-aab-googleplay.md) |
| Set Environment Variable | Sets pipeline variables for later steps. | [set-env-variable.md](tasks/set-env-variable.md) |
| Get Xcode Build Dir | Reads and exposes Xcode build directory. | [get-xcode-build-dir.md](tasks/get-xcode-build-dir.md) |
| Flutter use correct env | Keeps selected env file and removes others. | [flutter-use-correct-env.md](tasks/flutter-use-correct-env.md) |

## Notes

- Use **secure files** for sensitive files (keystore, `.p8`, Play JSON, Firebase `googleServicesJson`, and the **V1** Firebase service account JSON).
- Use the **Flutter Firebase GCP service account** [service connection](tasks/flutter-firebase-gcp-sa.md) for **Firebase V2** instead of a secure file for the GCP key when possible.
- Keep signing and distribution tasks in protected environments when your policy requires it.
- Validate agent capabilities (Flutter, Xcode, Java, Fastlane) before release jobs.

## Support and contribution

- For extension Marketplace text, see [`overview.md`](../overview.md) in the repo root.
- For task source code, see [`tasks/`](../tasks/) in the repository.
