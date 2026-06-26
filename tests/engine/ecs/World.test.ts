import { describe, expect, it } from "vitest";

import { World } from "../../../src/engine/ecs/World";

type Position = {
  readonly x: number;
  readonly y: number;
};

type Velocity = {
  readonly x: number;
  readonly y: number;
};

describe("World", () => {
  it("queries active entities that have all requested components", () => {
    const world = new World();
    const movingEntity = world.createEntity();
    const staticEntity = world.createEntity();
    const position = new Map([
      [movingEntity, { x: 1, y: 2 }],
      [staticEntity, { x: 3, y: 4 }],
    ]);
    const velocity = new Map([[movingEntity, { x: 0.5, y: 0 }]]);

    const results = world.query<{ position: Position; velocity: Velocity }>({
      position,
      velocity,
    });

    expect(results).toEqual([
      {
        entity: movingEntity,
        components: {
          position: { x: 1, y: 2 },
          velocity: { x: 0.5, y: 0 },
        },
      },
    ]);
  });

  it("excludes destroyed entities from queries", () => {
    const world = new World();
    const entity = world.createEntity();
    const position = new Map([[entity, { x: 1, y: 2 }]]);

    world.destroyEntity(entity);

    expect(world.query<{ position: Position }>({ position })).toEqual([]);
  });
});
