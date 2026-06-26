# ADR 0002: ECS Approach

- Status: Accepted
- Date: 2026-06-25

## Context

The project favors composition, data-oriented components, and testable gameplay systems. The MVP needs a controllable player, collectibles, interactions, inventory state, procedural world state, and save/load, but it does not yet have evidence that it needs a high-throughput general-purpose ECS dependency.

Gameplay systems must remain independent from Babylon.js scene objects and browser input APIs. The ECS boundary should make those constraints easy to follow without overbuilding a reusable engine before the first playable version creates real pressure.

## Options Considered

- Minimal in-repo ECS tailored to the project: smallest dependency surface, easiest to test, and easiest to shape around engine/game boundaries. The risk is that it may need replacement if entity counts, query complexity, or serialization needs grow quickly.
- `bitECS`: high-performance and data-oriented, with a small footprint and strong upgrade potential. The cost is additional dependency surface and lower early ergonomics for a project that does not yet know its component/query needs.
- `miniplex`: ergonomic TypeScript object-based ECS with good developer experience. The cost is object-heap entity modeling and a stronger bias toward React-style integration than the current architecture needs.
- `ecsy`: established ECS conceptually, but less compelling than newer TypeScript options for a fresh browser game foundation.

## Decision

Start with a minimal in-repo TypeScript ECS in `src/engine/ecs` during Phase 2.

The initial ECS should use:

- Numeric entity IDs.
- Data-only components.
- Explicit component stores.
- Systems as functions or small objects that operate on queried component data.
- No Babylon.js, DOM, storage, or audio dependencies inside ECS components or gameplay systems.

The public surface should stay intentionally narrow so the internal storage model can be replaced later without rewriting game features.

## Upgrade Triggers

Revisit `bitECS` or another external ECS only when at least one of these is true:

- Profiling shows ECS iteration or component storage is a frame-time bottleneck.
- The game needs thousands of active simulated entities or frequent component churn.
- Serialization, worker transfer, or deterministic replay requirements exceed the local ECS design.
- Maintaining query/component behavior in-house becomes more complex than adopting a focused library.

## Consequences

- Phase 2 can scaffold ECS contracts without adding a major dependency.
- Gameplay remains testable without Babylon.js or browser APIs.
- Contributors get a clear ECS shape before feature work begins.
- The project accepts some future migration risk in exchange for avoiding premature engine generalization.
