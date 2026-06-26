# Roadmap

## Phase 0: Development Harness

- Establish project vision, architecture notes, coding standards, decision tracking, and Cursor rules.
- Keep implementation blocked until the initial architecture is reviewed and approved.
- Identify architectural risks and library choices before scaffolding the app.

## Phase 1: Architecture Approval

- Decide ECS approach.
- Decide initial physics and collision approach.
- Decide UI strategy.
- Decide save data shape and versioning strategy.
- Create ADRs for decisions that affect long-term structure.

## Phase 2: Technical Foundation

- Initialize TypeScript, Vite, Babylon.js, Vitest, and linting.
- Create the engine/game/shared module structure with documented purpose.
- Add a minimal application shell and render loop.
- Add test setup for deterministic non-rendering logic.

## Phase 3: First Playable Core

- Add generated terrain.
- Add controllable player movement.
- Add third-person camera.
- Add collision boundaries.
- Add simple collectible objects.
- Add inventory state.
- Add interaction commands.
- Add save/load support.

## Phase 4: Exploration Depth

- Add pluggable world generators.
- Add landmarks and discovery hooks.
- Add simple puzzles or environmental gates.
- Add asset management and loading conventions.
- Add basic audio manager for ambience, music, UI sounds, and effects.

## Phase 5: Release Readiness

- Add GitHub Pages deployment.
- Add contribution documentation.
- Add smoke tests and regression checks.
- Profile frame time and asset loading.
- Document extension points for future games.
