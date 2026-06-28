import { describe, expect, it } from "vitest";

import {
  createForestDecorations,
  type ForestDecorationKind,
} from "../../../src/engine/renderer/ForestVisualModel";
import { generateTerrain } from "../../../src/game/terrain/Terrain";

describe("createForestDecorations", () => {
  it("creates deterministic renderer-only forest dressing for a terrain seed", () => {
    const firstTerrain = generateTerrain("forest-visual-seed");
    const secondTerrain = generateTerrain("forest-visual-seed");

    expect(createForestDecorations(secondTerrain)).toEqual(
      createForestDecorations(firstTerrain),
    );
  });

  it("changes decoration placement when terrain seed changes", () => {
    const firstTerrain = generateTerrain("forest-visual-a");
    const secondTerrain = generateTerrain("forest-visual-b");

    expect(createForestDecorations(secondTerrain)).not.toEqual(
      createForestDecorations(firstTerrain),
    );
  });

  it("leaves the spawn clearing uncluttered", () => {
    const terrain = generateTerrain("forest-spawn-clearing");

    expect(
      createForestDecorations(terrain).every(
        (decoration) => Math.hypot(decoration.x, decoration.z) >= 1.5,
      ),
    ).toBe(true);
  });

  it("returns valid low-poly forest decoration transforms", () => {
    const terrain = generateTerrain("forest-transform-seed");
    const validKinds = new Set<ForestDecorationKind>([
      "pine",
      "pineStraw",
      "shrub",
      "stone",
    ]);

    for (const decoration of createForestDecorations(terrain)) {
      expect(validKinds.has(decoration.kind)).toBe(true);
      expect(decoration.scale).toBeGreaterThan(0);
      expect(decoration.rotation).toBeGreaterThanOrEqual(0);
      expect(decoration.rotation).toBeLessThanOrEqual(Math.PI * 2);
    }
  });
});
