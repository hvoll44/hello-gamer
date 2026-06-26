import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Scene } from "@babylonjs/core/scene";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

import type { GameState } from "../../game/state/GameState";
import type { TerrainTileKind } from "../../game/terrain/Terrain";

export type BabylonRenderer = {
  readonly scene: Scene;
  render(gameState: GameState): void;
  resize(): void;
  dispose(): void;
};

export function createBabylonRenderer(
  canvas: HTMLCanvasElement,
  initialState: GameState,
): BabylonRenderer {
  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);

  scene.clearColor.set(0.07, 0.1, 0.16, 1);

  const camera = new ArcRotateCamera(
    "main-camera",
    Math.PI / 4,
    Math.PI / 3,
    8,
    Vector3.Zero(),
    scene,
  );
  camera.lowerBetaLimit = Math.PI / 4;
  camera.upperBetaLimit = Math.PI / 2.4;

  new HemisphericLight("sunlight", new Vector3(0, 1, 0), scene);

  const terrainMaterials = createTerrainMaterials(scene);

  for (const tile of initialState.world.terrain.tiles) {
    const terrainTile = MeshBuilder.CreateGround(
      `terrain-${String(tile.x)}-${String(tile.z)}`,
      {
        width: initialState.world.terrain.tileSize,
        height: initialState.world.terrain.tileSize,
      },
      scene,
    );
    terrainTile.position.set(
      tile.x * initialState.world.terrain.tileSize,
      tile.height,
      tile.z * initialState.world.terrain.tileSize,
    );
    terrainTile.material = terrainMaterials[tile.kind];
  }

  createBoundaryVisuals(initialState, scene);

  const player = MeshBuilder.CreateBox("debug-player", { size: 0.75 }, scene);
  player.position.set(
    initialState.player.position.x,
    initialState.player.position.y,
    initialState.player.position.z,
  );
  const playerMaterial = new StandardMaterial("debug-player-material", scene);
  playerMaterial.diffuseColor = new Color3(0.9, 0.74, 0.34);
  player.material = playerMaterial;

  return {
    scene,
    render: (gameState) => {
      player.position.set(
        gameState.player.position.x,
        gameState.player.position.y,
        gameState.player.position.z,
      );
      player.rotation.y = gameState.player.facing;
      camera.setTarget(player.position);
      scene.render();
    },
    resize: () => {
      engine.resize();
    },
    dispose: () => {
      engine.dispose();
    },
  };
}

function createBoundaryVisuals(gameState: GameState, scene: Scene): void {
  const { movementBounds, tileSize } = gameState.world.terrain;
  const minX = movementBounds.minX - tileSize / 2;
  const maxX = movementBounds.maxX + tileSize / 2;
  const minZ = movementBounds.minZ - tileSize / 2;
  const maxZ = movementBounds.maxZ + tileSize / 2;
  const width = maxX - minX;
  const depth = maxZ - minZ;
  const thickness = 0.08;
  const height = 0.12;
  const boundaryMaterial = new StandardMaterial("boundary-material", scene);

  boundaryMaterial.diffuseColor = new Color3(0.38, 0.62, 0.9);

  const north = MeshBuilder.CreateBox(
    "boundary-north",
    { width, height, depth: thickness },
    scene,
  );
  north.position.set(0, height, maxZ);
  north.material = boundaryMaterial;

  const south = MeshBuilder.CreateBox(
    "boundary-south",
    { width, height, depth: thickness },
    scene,
  );
  south.position.set(0, height, minZ);
  south.material = boundaryMaterial;

  const east = MeshBuilder.CreateBox(
    "boundary-east",
    { width: thickness, height, depth },
    scene,
  );
  east.position.set(maxX, height, 0);
  east.material = boundaryMaterial;

  const west = MeshBuilder.CreateBox(
    "boundary-west",
    { width: thickness, height, depth },
    scene,
  );
  west.position.set(minX, height, 0);
  west.material = boundaryMaterial;
}

function createTerrainMaterials(
  scene: Scene,
): Record<TerrainTileKind, StandardMaterial> {
  const grass = new StandardMaterial("terrain-grass-material", scene);
  grass.diffuseColor = new Color3(0.18, 0.42, 0.28);

  const clearing = new StandardMaterial("terrain-clearing-material", scene);
  clearing.diffuseColor = new Color3(0.32, 0.56, 0.24);

  const stone = new StandardMaterial("terrain-stone-material", scene);
  stone.diffuseColor = new Color3(0.36, 0.39, 0.42);

  return {
    grass,
    clearing,
    stone,
  };
}
