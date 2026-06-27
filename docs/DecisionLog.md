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

## 2026-06-26: Phase 4 Coin Gate Progression

- Status: Accepted
- Context: Phase 4 needs a first exploration-depth slice that builds on collectibles, inventory, interaction commands, renderer projection, and gameplay-only save data.
- Decision: Add deterministic environmental gates as rendering-free puzzle state in `src/game/puzzles`, unlock them through abstract interaction commands and inventory requirements, and persist unlocked gate IDs in save schema version 2 with a v1 migration.
- Consequences: The first puzzle validates interaction and persistence without introducing a generic puzzle engine; future work can add movement-blocking gate collision after the gameplay contract is proven.
- Related ADR: `docs/adr/0005-save-data-versioning.md`

## 2026-06-26: Manifest-Backed Asset Catalog

- Status: Accepted
- Context: Phase 4 needs asset management conventions before renderers, audio, or gameplay start hardcoding file paths.
- Decision: Add a small engine-owned asset catalog that validates manifest entries, resolves relative asset URLs from stable IDs, and stays independent from Babylon.js, Howler.js, and gameplay state.
- Consequences: Future loaders can share one path convention without committing to asset formats or loading strategy yet; actual source assets and preload policies can be added when content exists.
- Related ADR: None

## 2026-06-26: Cue-Based Audio Manager

- Status: Accepted
- Context: Phase 4 needs an audio foundation for music, ambience, UI sounds, and effects without coupling gameplay to Howler.js instances or concrete asset paths.
- Decision: Add an engine-owned audio manager that resolves cue asset IDs through the asset catalog, delegates playback to a narrow backend interface, and provides a Howler.js backend adapter at the runtime edge.
- Consequences: Audio cues can be tested without browser audio and future game systems can request stable cue IDs; real content manifests and runtime wiring remain follow-up work.
- Related ADR: `docs/adr/0001-browser-3d-rpg-stack.md`

## 2026-06-26: Phase 2 Technical Foundation

- Status: Accepted
- Context: Phase 1 architecture decisions are accepted, so the project needs a minimal browser app scaffold before gameplay features begin.
- Decision: Initialize TypeScript, Vite, Babylon.js, Vitest, ESLint, a Babylon renderer adapter, a small game loop, initial game state, DOM HUD projection, and a rendering-free ECS test.
- Consequences: Phase 3 can build first-playable systems on a tested foundation while keeping gameplay independent from Babylon.js and browser APIs.
- Related ADR: `docs/adr/0001-browser-3d-rpg-stack.md`, `docs/adr/0002-ecs-approach.md`, `docs/adr/0004-ui-strategy.md`

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
