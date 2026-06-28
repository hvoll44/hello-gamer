# Architecture

## Architectural Goal

Separate reusable engine capabilities from game-specific rules so this repository can support the initial exploration RPG and future browser games.

The first implementation should be small, testable, and explicit. Avoid building a general-purpose engine before real gameplay pressure exists.

## Proposed Layers

- `src/engine`: reusable systems such as rendering adapters, ECS, input, audio, physics integration, camera, assets, timing, and utilities.
- `src/game`: exploration RPG features such as world generation, player behavior, terrain, interaction, inventory, puzzles, saving, and UI coordination.
- `src/runtime`: browser application composition that maps game intent to engine adapters, static assets, and concrete runtime manifests.
- `src/shared`: cross-layer types and helpers that are stable enough to share without pulling game details into engine code.
- `tests`: unit and integration tests for deterministic logic, especially generation, state transitions, inventory, input mapping, and save serialization.
- `docs`: project vision, architecture, standards, roadmap, decisions, and ADRs.

## Key Boundaries

- Gameplay systems should not read browser input directly. They consume abstract input state or commands.
- Gameplay systems should not depend directly on Babylon.js scene objects. Rendering maps engine/game state to visuals.
- Gameplay systems should emit stable audio cue intent; runtime manifests and engine audio adapters own concrete asset paths and browser playback.
- Save data should serialize game state, not transient renderer state.
- Procedural generation should be deterministic from explicit seeds where practical.
- UI should observe or command game state through stable interfaces, not mutate internals directly.

## Runtime Stack

- TypeScript for source code.
- Vite for development and production builds.
- Babylon.js for 3D rendering.
- Vitest for tests.
- Howler.js for audio.

See `docs/adr/0001-browser-3d-rpg-stack.md`.

## Accepted Phase 1 Decisions

- ECS starts as a minimal in-repo TypeScript ECS with numeric entity IDs, data-only components, explicit component stores, and pure systems. See `docs/adr/0002-ecs-approach.md`.
- Physics and collision start as a lightweight kinematic collision layer for static colliders, terrain queries, player movement, and triggers. Babylon Physics V2 with Havok remains a future adapter option. See `docs/adr/0003-physics-collision-strategy.md`.
- UI starts as DOM/CSS overlays driven by UI view state and typed commands. Babylon GUI and UI frameworks remain future options behind the same boundary. See `docs/adr/0004-ui-strategy.md`.
- Save data starts as JSON-serializable gameplay state with a top-level schema version, migration path, and storage adapter. The first backend is `localStorage`, with IndexedDB reserved for larger or more complex saves. See `docs/adr/0005-save-data-versioning.md`.

## Remaining Open Decisions

- How terrain generation should represent chunks and richer world persistence beyond the current generator metadata and restore registry.

Each decision should be recorded in `docs/DecisionLog.md` and promoted to an ADR when it meaningfully affects future contributors.
