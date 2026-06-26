# Decision Log

Use this file for lightweight decision tracking. Create an ADR in `docs/adr` when a decision becomes architectural, hard to reverse, or important for contributors.

## Template

```markdown
## YYYY-MM-DD: Decision Title

- Status: Proposed | Accepted | Superseded
- Context: What problem are we solving?
- Decision: What did we choose?
- Consequences: What tradeoffs or follow-up work does this create?
- Related ADR: Optional link
```

## 2026-06-25: Planning-First Development Harness

- Status: Accepted
- Context: The README asks for analysis, architecture, tradeoff discussion, and roadmap creation before game implementation.
- Decision: Establish docs and Cursor rules before creating application code.
- Consequences: Feature work should start with a plan and receive approval before code changes. The initial app scaffold waits until the architecture is approved.
- Related ADR: `docs/adr/0001-browser-3d-rpg-stack.md`
