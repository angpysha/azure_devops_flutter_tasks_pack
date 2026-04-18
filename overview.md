# Flutter Build Help Tools

Flutter Build Help Tools is an Azure DevOps extension with ready-to-use pipeline tasks for Flutter mobile CI/CD.

## What this extension provides

- Build Flutter Android and iOS artifacts.
- Run Flutter environment checks and workspace tooling commands.
- Archive, re-sign, and upload iOS IPA files to TestFlight.
- Upload Android AAB files to Google Play.
- Manage build metadata and pipeline environment variables.

## Typical use cases

- Standardize Flutter build and release pipelines across teams.
- Replace custom shell scripts with reusable Azure DevOps tasks.
- Simplify mobile delivery workflows in CI/CD.

## Included tasks

- Flutter Android Build
- Flutter iOS Build
- Flutter Xcode Archive
- Flutter Re-sign IPA
- Flutter Upload IPA to TestFlight
- Flutter Upload AAB to Google Play
- Flutter Firebase (secure file for GCP key)
- Flutter Firebase V2 (GCP key via service connection)
- Flutter Doctor
- Flutter Melos
- Replace Build Number
- Check Path
- Set Environment Variable
- Get Xcode Build Directory
- Flutter Use Correct Env

## Support

For setup guidance and examples, see the repository: `docs/index.md` (overview and links) and **`docs/tasks/`** (one how-to guide per task, including Firebase V2 and the GCP service connection).
