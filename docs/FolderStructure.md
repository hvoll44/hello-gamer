# Folder Structure

Create folders only when they contain code, assets, or documentation with a clear purpose.

## Current Structure

```text
docs/
  adr/
.cursor/
  rules/
src/
  engine/
    ecs/
    renderer/
    timing/
  game/
    state/
    ui/
  shared/
tests/
  engine/
    ecs/
```

## Current Code Purpose

- `src/engine/ecs`: Minimal in-repo ECS foundation from `docs/adr/0002-ecs-approach.md`.
- `src/engine/renderer`: Babylon.js rendering adapter. Gameplay should not depend on these objects.
- `src/engine/timing`: Browser render/update loop helpers.
- `src/game/state`: Exploration RPG state shapes and initial state factories.
- `src/game/ui`: DOM overlay UI projections driven by game/UI state.
- `src/shared`: Stable cross-layer types and helpers.
- `tests`: Rendering-free Vitest coverage for deterministic logic.

## Intended Application Structure

```text
assets/
public/
src/
  engine/
    renderer/
    ecs/
    input/
    physics/
    audio/
    camera/
    utilities/
  game/
    world/
    terrain/
    player/
    interaction/
    inventory/
    puzzles/
    save/
    ui/
  shared/
tests/
.github/
```

## Placement Rules

- Put reusable, game-agnostic runtime code in `src/engine`.
- Put exploration RPG rules and content-specific systems in `src/game`.
- Put stable shared types and utilities in `src/shared`.
- Put deterministic logic tests in `tests`, close to the behavior they verify when practical.
- Put static browser files in `public`.
- Put source assets or asset manifests in `assets`.
- Do not add empty directories just to match the intended structure.
