# Run flutter doctor

**Task name:** `flutter-run-doctor`  
**Folder:** `tasks/flutter_run_doctor`

## When to use

Verify the agent environment early in a job: Flutter SDK, Xcode, Android licenses, etc.

## Prerequisites

- `flutter` on `PATH` (or your agent’s standard Flutter installation).

## Inputs

| Input | Required | Description |
|--------|----------|-------------|
| Verbose | Yes | More detailed `flutter doctor -v` style output. |

## Example (YAML)

```yaml
- task: flutter-run-doctor@0
  inputs:
    verbose: true
```
