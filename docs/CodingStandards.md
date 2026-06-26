# Coding Standards

## General

- Prefer small composable modules over inheritance-heavy designs.
- Keep engine code reusable and free of game-specific assumptions.
- Keep game logic testable without rendering or browser APIs.
- Use explicit data shapes for state, persistence, events, and commands.
- Avoid global mutable state unless it is isolated behind a clear runtime boundary.

## TypeScript

- Prefer strict types and narrow interfaces.
- Model domain concepts with named types instead of loose object bags.
- Use dependency injection through constructors or factory functions for systems that need collaborators.
- Keep side effects at the edges: rendering, input devices, audio output, persistence, and networking.
- Use deterministic pure functions for procedural generation where practical.

## Game Architecture

- Gameplay systems consume abstract input, not keyboard events.
- Rendering systems read state and update Babylon.js objects; gameplay systems should not own Babylon.js meshes.
- Save systems serialize gameplay state only.
- Procedural generation accepts explicit seeds and configuration.
- ECS components should be data-oriented. Systems own behavior.

## Testing

- Use Vitest.
- Test business logic, procedural generation, save/load, inventory, interaction, and state transitions without rendering.
- Add regression tests when fixing bugs.
- Keep rendering smoke tests minimal until the runtime scaffold exists.

## Documentation

- Update docs with each architectural or workflow change.
- Record major decisions in `docs/DecisionLog.md`.
- Use ADRs for decisions that are important, expensive to reverse, or useful for contributors.
