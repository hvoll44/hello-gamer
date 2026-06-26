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

## 2026-06-25: Browser 3D RPG Stack

- Status: Accepted
- Context: The architecture approval phase needs a confirmed runtime stack before application scaffolding begins.
- Decision: Use TypeScript, Vite, Babylon.js, Vitest, and Howler.js as the baseline stack.
- Consequences: Phase 2 can scaffold the browser app on the accepted stack while keeping ECS, physics, UI, and save strategy documented separately.
- Related ADR: `docs/adr/0001-browser-3d-rpg-stack.md`

## 2026-06-25: Minimal In-Repo ECS

- Status: Accepted
- Context: The game needs ECS composition without adopting a major dependency before entity counts and query needs are proven.
- Decision: Start with a minimal in-repo TypeScript ECS using numeric entity IDs, data-only components, explicit component stores, and pure systems.
- Consequences: ECS remains testable and dependency-light, with a future path to `bitECS` if profiling or complexity justifies it.
- Related ADR: `docs/adr/0002-ecs-approach.md`

## 2026-06-25: Lightweight Kinematic Collision First

- Status: Accepted
- Context: The MVP needs player movement, static bounds, terrain queries, triggers, and collectibles, but not full rigid-body simulation.
- Decision: Start with a lightweight kinematic collision layer and keep Babylon Physics V2 with Havok behind a future adapter boundary.
- Consequences: Collision remains rendering-free and testable, while dynamic simulation can be adopted later when gameplay requires it.
- Related ADR: `docs/adr/0003-physics-collision-strategy.md`

## 2026-06-25: DOM Overlay UI First

- Status: Accepted
- Context: MVP UI needs menus, overlays, inventory, prompts, and save/load screens without coupling gameplay to Babylon.js.
- Decision: Use DOM/CSS overlays driven by UI view state and typed commands.
- Consequences: UI stays browser-native and dependency-light, with Babylon GUI or a UI framework reserved for future needs.
- Related ADR: `docs/adr/0004-ui-strategy.md`

## 2026-06-25: Versioned Gameplay Save Data

- Status: Accepted
- Context: Save/load is an MVP feature and needs a gameplay-only format before implementation begins.
- Decision: Use JSON-serializable save data with a top-level schema version, migration path, validation, and storage adapter.
- Consequences: The first backend can be `localStorage` for small saves, with IndexedDB available later for larger or more complex persistence.
- Related ADR: `docs/adr/0005-save-data-versioning.md`

## 2026-06-25: Planning-First Development Harness

- Status: Accepted
- Context: The README asks for analysis, architecture, tradeoff discussion, and roadmap creation before game implementation.
- Decision: Establish docs and Cursor rules before creating application code.
- Consequences: Feature work should start with a plan and receive approval before code changes. The initial app scaffold waits until the architecture is approved.
- Related ADR: `docs/adr/0001-browser-3d-rpg-stack.md`

## 2026-06-25: Risk-Based Agent Autonomy

- Status: Accepted
- Context: The project owner wants AI agents to have broad autonomy, including the ability to make commits, while preserving long-term architectural quality.
- Decision: Use `docs/AgentOperatingModel.md` to define default autonomy, approval boundaries, planning expectations, and commit expectations.
- Consequences: Agents may proceed independently on scoped, low-risk work and commit coherent completed units. High-risk architectural, scope, dependency, release, remote, or destructive actions still require explicit approval.
- Related ADR: None

## 2026-06-25: Project Handoff Skill

- Status: Accepted
- Context: Long-running autonomous work needs a repeatable way to transfer context to a fresh Cursor agent without duplicating project artifacts.
- Decision: Add `.cursor/skills/handoff/SKILL.md` as a project skill for writing handoff documents outside the workspace.
- Consequences: Agents can preserve session state, references, open tasks, risks, and suggested skills in a consistent format for future sessions.
- Related ADR: None
