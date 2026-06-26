# Roadmap

## Phase 0: Development Harness

- Establish project vision, architecture notes, coding standards, decision tracking, and Cursor rules.
- Establish the AI agent operating model for autonomy, approvals, and commits.
- Keep implementation blocked until the initial architecture is reviewed and approved.
- Identify architectural risks and library choices before scaffolding the app.

## Phase 1: Architecture Approval

- Status: Complete.
- Accepted the baseline TypeScript, Vite, Babylon.js, Vitest, and Howler.js stack.
- Decided ECS approach.
- Decided initial physics and collision approach.
- Decided UI strategy.
- Decided save data shape and versioning strategy.
- Created ADRs for decisions that affect long-term structure.

## Phase 2: Technical Foundation

- Status: Complete.
- Initialized TypeScript, Vite, Babylon.js, Vitest, and linting.
- Created the engine/game/shared module structure with documented purpose.
- Added a minimal application shell and render loop.
- Added test setup for deterministic non-rendering logic.

## Phase 3: First Playable Core

- Add generated terrain. Initial deterministic terrain slice added.
- Add controllable player movement. Initial abstract input and movement slice added.
- Add third-person camera. Initial debug camera follow added.
- Add collision boundaries. Initial terrain-edge movement bounds added.
- Add simple collectible objects. Initial deterministic collectible slice added.
- Add inventory state. Initial collectible inventory count added.
- Add interaction commands. Initial abstract collect interaction added.
- Add save/load support. Initial versioned local save slot added.

## Phase 4: Exploration Depth

- Add pluggable world generators.
- Add landmarks and discovery hooks. Initial deterministic landmark discovery slice added.
- Add simple puzzles or environmental gates.
- Add asset management and loading conventions.
- Add basic audio manager for ambience, music, UI sounds, and effects.

## Phase 5: Release Readiness

- Add GitHub Pages deployment.
- Add contribution documentation.
- Add smoke tests and regression checks.
- Profile frame time and asset loading.
- Document extension points for future games.
