# Service connection: Flutter Firebase GCP service account

**Connection type name:** `flutter-firebase-gcp-sa`  
**Defined in:** `vss-extension.json` (contribution `flutter-firebase-gcp-sa-endpoint`)

This is **not** a pipeline task. It is a **service endpoint** used by the task **Upload Flutter app to Firebase V2** (`flutter-firebase-v2`) for **Distribute** and **Custom** modes.

## When to use

Store your **Google Cloud service account JSON key** once at **Project** or **Organization** settings instead of attaching a secure file on every pipeline run.

## How to create it

1. In Azure DevOps: **Project settings** → **Service connections** → **New service connection**.
2. Choose **Flutter Firebase GCP service account** (name shown in the UI comes from the extension).
3. Paste the **entire JSON** of the service account key into **Service account JSON** (stored as a confidential field).
4. Save the connection, then grant your pipeline **access** to the connection (pipeline permissions / environment approvals as your org requires).

## How the V2 task uses it

The task writes the JSON to a short-lived file under `Agent.TempDirectory`, sets `GOOGLE_APPLICATION_CREDENTIALS`, runs the Firebase CLI, then deletes the file in a `finally` block.

## Related documentation

- [Upload Flutter app to Firebase V2](flutter-firebase-v2.md)
