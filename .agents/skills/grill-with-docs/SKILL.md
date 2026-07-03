---
name: grill-with-docs
description: A relentless interview to sharpen a plan or design, which also creates docs (ADR's and glossary) as we go.
disable-model-invocation: true
---

Run a **`grilling`** session using the **`domain-modeling`** skill.

Before asking the human, answer code-backed questions via **`code-search`** (MCP
[mcp-codebase-search](https://github.com/teknologika/mcp-codebase-search/) first, then graphify,
then default tools).

## Phase rules

| Phase | Glossary (`CONTEXT.md`) | ADRs | Spec Kit |
|-------|-------------------------|------|----------|
| **2 — BA business grilling** | Yes | No | feed answers into **`/speckit.clarify`** (updates `spec.md`) |
| **5 — Architect design** | Yes | Yes (session `artifacts/sdlc/adr/` when `{session}` set) | inform **`/speckit.plan`**; ADRs supplement `plan.md` |
| **Spike** | Yes | Sparingly | **`/speckit.specify`** for the question only |

Grilling **resolves ambiguity that Spec Kit captures**: in Phase 2 the outcomes drive
`/speckit.clarify` so `spec.md` stays canonical; glossary/ADRs supplement it (see
`skills/spec-kit/SKILL.md`).

Read `skills/grilling/SKILL.md` + `skills/domain-modeling/SKILL.md` before starting.
