# ADR 0003: Physics and Collision Strategy

- Status: Accepted
- Date: 2026-06-25

## Context

The MVP needs third-person movement, terrain boundaries, collectible triggers, and simple world interactions. It does not require dynamic rigid bodies, joints, destructible objects, vehicle simulation, ragdolls, or combat reactions.

Gameplay should not depend directly on Babylon.js meshes or physics objects. Rendering should map gameplay state to visuals, and physics/collision should expose stable gameplay-facing contracts.

## Options Considered

- Lightweight kinematic collision layer: enough for player movement, static world colliders, terrain height/bounds, and triggers. This keeps the first playable deterministic and testable, but does not provide full rigid-body simulation.
- Babylon.js built-in collision primitives: convenient for simple scenes, but can encourage gameplay logic to depend on Babylon scene objects too early.
- Babylon Physics V2 with Havok: modern and powerful, but adds a WebAssembly dependency and asynchronous initialization before the MVP proves it needs dynamic simulation.
- Custom full physics engine: unnecessary for the project scope and a high maintenance burden.

## Decision

Start with a lightweight kinematic collision layer in `src/engine/physics`.

The initial layer should support:

- Static colliders for terrain, props, walls, and bounds.
- Kinematic player movement with collision resolution.
- Trigger volumes for collectibles and simple interactions.
- Terrain height or walkability queries.
- Deterministic, rendering-free unit tests.

Babylon collision data and Havok should be hidden behind future adapter interfaces. Gameplay code should consume collision results and trigger events, not Babylon meshes, `PhysicsBody` objects, or Havok-specific types.

## Upgrade Triggers

Adopt Babylon Physics V2 with `@babylonjs/havok` when the game needs:

- Dynamic rigid bodies or physically simulated props.
- Stable collisions among many moving bodies.
- Joints, constraints, impulses, or continuous collision detection.
- Collision behavior that is more expensive to maintain in the kinematic layer than to delegate to Havok.

## Consequences

- Phase 2 and Phase 3 can implement movement and interaction without a major physics dependency.
- Collision logic remains testable outside the renderer.
- The project avoids coupling gameplay to Babylon physics APIs.
- A future Havok integration will need an adapter and migration path for collider definitions.
