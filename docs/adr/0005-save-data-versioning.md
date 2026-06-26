# ADR 0005: Save Data and Versioning

- Status: Accepted
- Date: 2026-06-25

## Context

Save/load is part of the MVP and should be designed before gameplay code exists. Saves must serialize gameplay state only, not Babylon meshes, renderer state, audio handles, input devices, or transient runtime objects.

The first playable version is expected to persist a generated world seed, player progress, collectibles, inventory, interaction state, and enough metadata to reload deterministically. The format should be explicit and migratable before any public saves exist.

## Options Considered

- JSON save envelope with explicit schema version: simple, inspectable, testable, and easy to migrate.
- Browser `localStorage`: simple first backend for small MVP saves, but synchronous and not suitable for large worlds or many slots.
- IndexedDB: better for larger structured data and async writes, but more ceremony before the project needs it.
- Third-party persistence/schema library: useful later if migrations become complex, but premature before the save shape is proven.

## Decision

Define save data as JSON-serializable gameplay state with a top-level envelope:

```typescript
type SaveData = {
  schemaVersion: number;
  gameVersion: string;
  createdAt: string;
  updatedAt: string;
  world: {
    seed: string;
    generatorId: string;
    generatorVersion: number;
    discoveredLocationIds: string[];
  };
  player: {
    position: { x: number; y: number; z: number };
    facing: number;
  };
  inventory: {
    itemIds: string[];
  };
  progression: {
    collectedEntityIds: string[];
    interactionFlags: Record<string, boolean>;
  };
};
```

The exact fields may evolve during implementation, but this envelope establishes the required categories and migration boundary.

The save system should use:

- A storage adapter interface so tests can use memory storage and the browser can start with `localStorage`.
- A `CURRENT_SCHEMA_VERSION` constant.
- Single-step migrations from each version to the next.
- Runtime validation before loading imported or stored saves.
- Deterministic serialization tests that do not require rendering.

Use `localStorage` for the first MVP save slot while saves are small. Move to IndexedDB when the game needs multiple slots, larger chunk metadata, richer world persistence, async writes, or export/import with larger payloads.

## Consequences

- Save/load can be tested before rendering and gameplay presentation are complete.
- The project has a versioning story before public save data exists.
- Rendering and engine implementation details stay out of persisted data.
- The first backend is intentionally simple, with a clear upgrade path to IndexedDB.
