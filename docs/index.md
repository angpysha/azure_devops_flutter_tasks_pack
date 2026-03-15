# Azure DevOps Flutter Tasks Pack Documentation

## Overview

Azure DevOps Flutter Tasks Pack provides reusable pipeline tasks to build, sign, archive, and distribute Flutter apps without maintaining custom scripts in every repository.

## Installation

1. Install the extension from Azure DevOps Marketplace.
2. Open your Azure DevOps project.
3. Edit a pipeline and add tasks from this extension.
4. Configure task inputs according to your project and release workflow.

## Typical pipeline flow

1. Prepare Flutter environment.
2. Build Android (`APK` or `AAB`) and/or iOS (`IPA`) artifacts.
3. Sign or re-sign release artifacts when needed.
4. Upload builds to Firebase App Distribution, TestFlight, or Google Play.

## Available tasks

| Task | Description |
|------|-------------|
| Check path | Checks if a path exists. |
| Build Flutter Android app | Builds Android artifacts with custom parameters. |
| Build Flutter iOS app | Builds iOS artifacts with custom parameters. |
| Upload Flutter app to Firebase | Uploads artifacts to Firebase App Distribution and related Firebase operations. |
| Run Melos command | Runs Melos commands in mono-repositories. |
| Resign Flutter iOS app | Re-signs an IPA with a new provisioning profile. |
| Run flutter doctor | Validates Flutter environment and prints diagnostics. |
| Sign AAB | Signs Android AAB using `jarsigner`. |
| Upload to Google Play | Uploads AAB to Google Play using Fastlane. |
| Upload to TestFlight | Uploads IPA/PKG to TestFlight using Fastlane Pilot. |
| Flutter use correct env | Keeps selected env file and removes others. |
| Xcode Archive for Flutter iOS | Archives iOS app with Xcode and exports output. |
| Get Xcode Build Dir | Reads and exposes Xcode build directory. |
| Replace build number | Updates `pubspec.yaml` build number. |
| Set Environment Variable | Sets global environment variables in pipeline runtime. |

## Notes

- Use secure files for sensitive credentials (Apple keys, Google service account keys).
- Keep signing and distribution tasks in release stages only.
- Validate agent capabilities (Flutter, Xcode, Java, Fastlane) before release jobs.

## Support and contribution

- For extension details visible in Marketplace, see `overview.md`.
- For source and task implementations, see the repository task folders under `tasks/`.
