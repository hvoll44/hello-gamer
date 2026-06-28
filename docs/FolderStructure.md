# Folder Structure

Create folders only when they contain code, assets, or documentation with a clear purpose.

## Current Structure

```text
docs/
  adr/
public/
  audio/
.cursor/
  rules/
src/
  engine/
    assets/
    audio/
    ecs/
    input/
    renderer/
    storage/
    timing/
  game/
    collectibles/
    interaction/
    inventory/
    landmarks/
    player/
    puzzles/
    save/
    state/
    terrain/
    ui/
    world/
  runtime/
    assets/
    audio/
  shared/
tests/
  engine/
    assets/
    audio/
    ecs/
    input/
  game/
    audio/
    collectibles/
    interaction/
    landmarks/
    player/
    puzzles/
    save/
    terrain/
    world/
  runtime/
    audio/
```

## Current Code Purpose

- `src/engine/assets`: Manifest-backed asset catalog conventions shared by renderers, audio, and future loaders.
- `src/engine/audio`: Cue-based audio manager abstractions and Howler.js runtime adapter.
- `src/engine/ecs`: Minimal in-repo ECS foundation from `docs/adr/0002-ecs-approach.md`.
- `src/engine/input`: Browser input adapters and abstract input command mapping.
- `src/engine/renderer`: Babylon.js rendering adapter. Gameplay should not depend on these objects.
- `src/engine/storage`: Browser storage adapters for serialized gameplay data.
- `src/engine/timing`: Browser render/update loop helpers.
- `src/game/audio`: Rendering-free gameplay audio cue intent derived from state transitions.
- `src/game/collectibles`: Deterministic collectible placement and collectible state shapes.
- `src/game/interaction`: Rendering-free interaction systems that consume abstract commands.
- `src/game/inventory`: Gameplay-owned inventory state and item count updates.
- `src/game/landmarks`: Deterministic landmark placement and rendering-free discovery state updates.
- `src/game/player`: Rendering-free player movement and state transition logic.
- `src/game/puzzles`: Rendering-free puzzle and environmental gate state transitions.
- `src/game/save`: Versioned gameplay save data serialization, validation, and restore logic.
- `src/game/state`: Exploration RPG state shapes and initial state factories.
- `src/game/terrain`: Deterministic generated terrain state and terrain queries.
- `src/game/ui`: DOM overlay UI projections driven by game/UI state.
- `src/game/world`: Deterministic world assembly and generator metadata.
- `src/runtime/assets`: Browser runtime asset manifests that map stable IDs to public asset paths.
- `src/runtime/audio`: Browser runtime audio cue manifests that map gameplay cue intent to engine audio assets.
- `src/shared`: Stable cross-layer types and helpers.
- `public/audio`: Tiny placeholder browser-served sounds for runtime audio wiring.
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
  runtime/
    assets/
    audio/
  shared/
tests/
.github/
```

## Placement Rules

- Put reusable, game-agnostic runtime code in `src/engine`.
- Put exploration RPG rules and content-specific systems in `src/game`.
- Put browser-edge composition and concrete runtime manifests in `src/runtime`.
- Put stable shared types and utilities in `src/shared`.
- Put deterministic logic tests in `tests`, close to the behavior they verify when practical.
- Put static browser files in `public`.
- Put source assets or asset manifests in `assets`.
- Reference assets through stable catalog IDs instead of hardcoded paths in gameplay or renderer code.
- Do not add empty directories just to match the intended structure.
