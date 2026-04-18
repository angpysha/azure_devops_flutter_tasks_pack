# Set Environment Variable

**Task name:** `set-env-variable`  
**Folder:** `tasks/set_env_variable`

## When to use

Define or overwrite a **pipeline variable** for subsequent steps in the same job (`tl.setVariable` with the name and value you provide).

## Inputs

| Input | Required | Description |
|--------|----------|-------------|
| Name | Yes | Variable name. |
| Value | Yes | Variable value (can reference other macros). |

## Example (YAML)

```yaml
- task: set-env-variable@0
  inputs:
    name: 'MY_APP_ENV'
    value: 'staging'
```

Downstream steps read the value as `$(MY_APP_ENV)` (same job).
