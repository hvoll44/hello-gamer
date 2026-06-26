import { describe, expect, it } from "vitest";

import {
  generateLandmarks,
  updateLandmarkDiscovery,
} from "../../../src/game/landmarks/Landmarks";
import { generateTerrain } from "../../../src/game/terrain/Terrain";

describe("generateLandmarks", () => {
  it("creates deterministic landmarks for a seed and terrain", () => {
    const terrain = generateTerrain("landmark-seed");
    const firstLandmarks = generateLandmarks("landmark-seed", terrain);
    const secondLandmarks = generateLandmarks("landmark-seed", terrain);

    expect(secondLandmarks).toEqual(firstLandmarks);
  });

  it("places landmarks away from spawn", () => {
    const terrain = generateTerrain("landmark-spawn-seed");
    const landmarks = generateLandmarks("landmark-spawn-seed", terrain);

    expect(landmarks).toHaveLength(3);
    expect(
      landmarks.some(
        (landmark) =>
          landmark.position.x === terrain.spawn.x &&
          landmark.position.z === terrain.spawn.z,
      ),
    ).toBe(false);
  });
});

describe("updateLandmarkDiscovery", () => {
  it("marks landmarks discovered when the player enters range", () => {
    const terrain = generateTerrain("discovery-seed");
    const landmarks = generateLandmarks("discovery-seed", terrain);
    const landmark = landmarks[0];

    const nextLandmarks = updateLandmarkDiscovery(landmarks, landmark.position);

    expect(nextLandmarks[0]?.discovered).toBe(true);
  });

  it("keeps landmark state unchanged when nothing is discovered", () => {
    const terrain = generateTerrain("undiscovered-seed");
    const landmarks = generateLandmarks("undiscovered-seed", terrain);

    expect(updateLandmarkDiscovery(landmarks, terrain.spawn)).toBe(landmarks);
  });
});
