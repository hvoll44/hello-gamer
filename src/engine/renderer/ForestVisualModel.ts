import type { TerrainState, TerrainTileKind } from "../../game/terrain/Terrain";

export type ForestDecorationKind = "pine" | "pineStraw" | "shrub" | "stone";

export type ForestDecoration = {
  readonly id: string;
  readonly kind: ForestDecorationKind;
  readonly x: number;
  readonly z: number;
  readonly rotation: number;
  readonly scale: number;
  readonly variant: number;
};

export function createForestDecorations(
  terrain: TerrainState,
): readonly ForestDecoration[] {
  const radius = Math.floor(terrain.size / 2);
  const decorations: ForestDecoration[] = [];

  for (const tile of terrain.tiles) {
    const distanceFromCenter = Math.hypot(tile.x, tile.z);

    if (distanceFromCenter < 1.5) {
      continue;
    }

    const primaryScore = hashString(
      `${terrain.seed}:forest:${String(tile.x)}:${String(tile.z)}:primary`,
    );
    const secondaryScore = hashString(
      `${terrain.seed}:forest:${String(tile.x)}:${String(tile.z)}:secondary`,
    );
    const baseDecoration = createBaseDecoration(
      terrain.seed,
      terrain.tileSize,
      tile.x,
      tile.z,
      primaryScore,
    );
    const edgeBoost = distanceFromCenter / radius;
    const kind = pickPrimaryDecorationKind(
      tile.kind,
      normalizeHash(primaryScore),
      edgeBoost,
    );

    if (kind !== undefined) {
      decorations.push({
        ...baseDecoration,
        id: `${kind}-${String(tile.x)}-${String(tile.z)}`,
        kind,
      });
    }

    if (shouldAddPineStraw(tile.kind, normalizeHash(secondaryScore))) {
      decorations.push({
        ...createBaseDecoration(
          terrain.seed,
          terrain.tileSize,
          tile.x,
          tile.z,
          secondaryScore,
        ),
        id: `pine-straw-${String(tile.x)}-${String(tile.z)}`,
        kind: "pineStraw",
        scale: 0.65 + normalizeHash(secondaryScore) * 0.25,
      });
    }
  }

  return decorations;
}

function pickPrimaryDecorationKind(
  tileKind: TerrainTileKind,
  score: number,
  edgeBoost: number,
): ForestDecorationKind | undefined {
  if (tileKind === "stone") {
    return score < 0.72 ? "stone" : undefined;
  }

  if (tileKind === "clearing") {
    return score < 0.22 ? "shrub" : undefined;
  }

  if (score < 0.28 + edgeBoost * 0.18) {
    return "pine";
  }

  if (score < 0.52) {
    return "shrub";
  }

  return undefined;
}

function shouldAddPineStraw(tileKind: TerrainTileKind, score: number): boolean {
  return tileKind !== "stone" && score < 0.42;
}

function createBaseDecoration(
  seed: string,
  tileSize: number,
  tileX: number,
  tileZ: number,
  score: number,
): Omit<ForestDecoration, "id" | "kind"> {
  const normalizedScore = normalizeHash(score);
  const offsetX = (normalizeHash(hashString(`${seed}:offset-x:${String(score)}`)) - 0.5) * 0.42;
  const offsetZ = (normalizeHash(hashString(`${seed}:offset-z:${String(score)}`)) - 0.5) * 0.42;

  return {
    x: (tileX + offsetX) * tileSize,
    z: (tileZ + offsetZ) * tileSize,
    rotation: normalizedScore * Math.PI * 2,
    scale: 0.85 + normalizedScore * 0.35,
    variant: score % 3,
  };
}

function normalizeHash(hash: number): number {
  return hash / 0xffffffff;
}

function hashString(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}
