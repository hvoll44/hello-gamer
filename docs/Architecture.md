# Architecture

## Architectural Goal

Separate reusable engine capabilities from game-specific rules so this repository can support the initial exploration RPG and future browser games.

The first implementation should be small, testable, and explicit. Avoid building a general-purpose engine before real gameplay pressure exists.

## Proposed Layers

- `src/engine`: reusable systems such as rendering adapters, ECS, input, audio, physics integration, camera, assets, timing, and utilities.
- `src/game`: exploration RPG features such as world generation, player behavior, terrain, interaction, inventory, puzzles, saving, and UI coordination.
- `src/shared`: cross-layer types and helpers that are stable enough to share without pulling game details into engine code.
- `tests`: unit and integration tests for deterministic logic, especially generation, state transitions, inventory, input mapping, and save serialization.
- `docs`: project vision, architecture, standards, roadmap, decisions, and ADRs.

## Key Boundaries

- Gameplay systems should not read browser input directly. They consume abstract input state or commands.
- Gameplay systems should not depend directly on Babylon.js scene objects. Rendering maps engine/game state to visuals.
- Save data should serialize game state, not transient renderer state.
- Procedural generation should be deterministic from explicit seeds where practical.
- UI should observe or command game state through stable interfaces, not mutate internals directly.

## Candidate Runtime Stack

- TypeScript for source code.
- Vite for development and production builds.
- Babylon.js for 3D rendering.
- Vitest for tests.
- Howler.js for audio.

## Open Decisions

- Whether to adopt an external ECS library or build a minimal ECS tailored to this project.
- Whether physics should start with Babylon collision primitives, a lightweight custom layer, or a dedicated physics library.
- How terrain generation should represent chunks, persistence, and world metadata.
- Which UI approach to use for menus and overlays.

Each decision should be recorded in `docs/DecisionLog.md` and promoted to an ADR when it meaningfully affects future contributors.
