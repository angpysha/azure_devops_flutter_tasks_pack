# Check path

**Task name:** `check-path`  
**Folder:** `tasks/check_path`

## When to use

Validate that a file or directory exists before later steps (for example, after checkout or a download).

## Inputs

| Input | Required | Description |
|--------|----------|-------------|
| Path to project folder | Yes | Path to check. |

## Outputs

The task sets a pipeline variable **`pathExists`** to the string `true` or `false`. Later steps in the same job can use `$(pathExists)` in scripts or conditions.

## Example (YAML)

```yaml
- task: check-path@0
  inputs:
    path: '$(Build.SourcesDirectory)/pubspec.yaml'

- script: echo "Exists=$(pathExists)"
```

Use the **task major version** from the Marketplace (for example `@0`) in real pipelines.
