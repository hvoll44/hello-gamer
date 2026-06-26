# Folder Structure

Create folders only when they contain code, assets, or documentation with a clear purpose.

## Current Harness

```text
docs/
  adr/
.cursor/
  rules/
```

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
