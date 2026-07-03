# sync-to-host.ps1 — project .agents/ into agent-host folders (pwsh).
# Usage: pwsh -File sync-to-host.ps1 [TARGET_DIR] [cursor|claude|windsurf|all|auto|manual]
param(
    [string]$Target = (Get-Location).Path,
    [string]$AgentHost = 'auto'
)

. (Join-Path $PSScriptRoot 'lib/PipelineScripts.ps1')

$Target = (Resolve-Path $Target).Path
$Src = Join-Path $Target '.agents'

if (-not (Test-Path $Src)) {
    Write-Error "$Src not found — run 'agentic-tool install' first"
    exit 1
}

function Get-DetectedHosts {
    $hosts = [System.Collections.Generic.List[string]]::new()
    if (Test-Path (Join-Path $Target '.cursor')) { $hosts.Add('cursor') }
    if ((Test-Path (Join-Path $Target '.claude')) -or (Test-Path (Join-Path $Target 'CLAUDE.md'))) {
        $hosts.Add('claude')
    }
    if (Test-Path (Join-Path $Target '.windsurf')) { $hosts.Add('windsurf') }
    if ($hosts.Count -eq 0) { $hosts.Add('cursor') }
    return $hosts
}

function Sync-Cursor {
    if (Test-Path (Join-Path $Src 'agents')) {
        Write-Host 'sync -> .cursor/agents'
        Copy-Tree (Join-Path $Src 'agents') (Join-Path $Target '.cursor/agents')
    }
    if (Test-Path (Join-Path $Src 'skills')) {
        Write-Host 'sync -> .cursor/skills'
        Copy-Tree (Join-Path $Src 'skills') (Join-Path $Target '.cursor/skills')
    }
    if (Test-Path (Join-Path $Src 'rules')) {
        Write-Host 'sync -> .cursor/rules'
        Copy-Tree (Join-Path $Src 'rules') (Join-Path $Target '.cursor/rules')
    }
}

function Sync-Claude {
    if (Test-Path (Join-Path $Src 'agents')) {
        Write-Host 'sync -> .claude/agents'
        Copy-Tree (Join-Path $Src 'agents') (Join-Path $Target '.claude/agents')
    }
    if (Test-Path (Join-Path $Src 'skills')) {
        Write-Host 'sync -> .claude/skills'
        Copy-Tree (Join-Path $Src 'skills') (Join-Path $Target '.claude/skills')
    }
    if (Test-Path (Join-Path $Src 'rules')) {
        Write-Host 'sync -> .claude/rules'
        Copy-Tree (Join-Path $Src 'rules') (Join-Path $Target '.claude/rules')
    }
}

function Sync-Windsurf {
    if (Test-Path (Join-Path $Src 'agents')) {
        Write-Host 'sync -> .windsurf/agents'
        Copy-Tree (Join-Path $Src 'agents') (Join-Path $Target '.windsurf/agents')
    }
    if (Test-Path (Join-Path $Src 'skills')) {
        Write-Host 'sync -> .windsurf/skills'
        Copy-Tree (Join-Path $Src 'skills') (Join-Path $Target '.windsurf/skills')
    }
}

function Invoke-HostSync {
    param([string]$Name)
    switch ($Name) {
        'cursor' { Sync-Cursor }
        'claude' { Sync-Claude }
        'windsurf' { Sync-Windsurf }
        default { Write-Warning "unknown host: $Name" }
    }
}

switch ($AgentHost) {
    'auto' {
        foreach ($h in Get-DetectedHosts) { Invoke-HostSync $h }
    }
    'all' {
        Sync-Cursor
        Sync-Claude
        Sync-Windsurf
    }
    'manual' {
        Write-Host 'INFO manual host — no projection ( .agents/ only )'
    }
    { $_ -in @('cursor', 'claude', 'windsurf') } {
        Invoke-HostSync $AgentHost
    }
    default {
        Write-Error "unknown host: $AgentHost"
        exit 1
    }
}

Write-Host "OK sync complete ($AgentHost)"
