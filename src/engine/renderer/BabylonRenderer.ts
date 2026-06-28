import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Scene } from "@babylonjs/core/scene";

import type { GameState } from "../../game/state/GameState";
import {
  getTerrainHeightAt,
  type TerrainTileKind,
} from "../../game/terrain/Terrain";
import {
  createForestDecorations,
  type ForestDecoration,
} from "./ForestVisualModel";

export type BabylonRenderer = {
  readonly scene: Scene;
  render(gameState: GameState): void;
  resize(): void;
  dispose(): void;
};

const PLAYER_HALF_HEIGHT = 0.375;

export function createBabylonRenderer(
  canvas: HTMLCanvasElement,
  initialState: GameState,
): BabylonRenderer {
  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);

  configureScene(scene);

  const camera = createCamera(scene);
  const materials = createForestMaterials(scene);

  createTerrainVisuals(initialState, scene, materials);
  createBoundaryVisuals(initialState, scene, materials);
  createForestDecorationVisuals(initialState, scene, materials);
  const collectibleVisuals = createCollectibleVisuals(initialState, scene, materials);
  const landmarkVisuals = createLandmarkVisuals(initialState, scene, materials);
  const gateVisuals = createGateVisuals(initialState, scene, materials);
  const player = createPlayerVisual(initialState, scene, materials);

  let collectibleSpin = 0;

  return {
    scene,
    render: (gameState) => {
      player.position.set(
        gameState.player.position.x,
        gameState.player.position.y - PLAYER_HALF_HEIGHT,
        gameState.player.position.z,
      );
      player.rotation.y = gameState.player.facing;
      camera.setTarget(
        new Vector3(
          gameState.player.position.x,
          gameState.player.position.y + 0.55,
          gameState.player.position.z,
        ),
      );

      collectibleSpin += 0.035;
      updateCollectibleVisuals(gameState, collectibleVisuals, collectibleSpin);
      updateLandmarkVisuals(gameState, landmarkVisuals);
      updateGateVisuals(gameState, gateVisuals);

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

type ForestMaterials = {
  readonly terrain: Record<TerrainTileKind, StandardMaterial>;
  readonly pineTrunk: StandardMaterial;
  readonly pineNeedles: StandardMaterial;
  readonly pineNeedlesDark: StandardMaterial;
  readonly pineStraw: StandardMaterial;
  readonly shrub: StandardMaterial;
  readonly stone: StandardMaterial;
  readonly stoneMoss: StandardMaterial;
  readonly coin: StandardMaterial;
  readonly coinGlow: StandardMaterial;
  readonly playerBody: StandardMaterial;
  readonly playerHead: StandardMaterial;
  readonly playerHat: StandardMaterial;
  readonly playerPack: StandardMaterial;
  readonly gateWood: StandardMaterial;
  readonly gateMoss: StandardMaterial;
  readonly boundaryLog: StandardMaterial;
  readonly landmarkDiscovered: StandardMaterial;
  readonly landmarkUndiscovered: StandardMaterial;
  readonly landmarkMarker: StandardMaterial;
};

type CollectibleVisual = {
  readonly root: TransformNode;
  readonly coin: Mesh;
  readonly baseCoinY: number;
};

type LandmarkVisual = {
  readonly stones: readonly Mesh[];
  readonly marker: Mesh;
  readonly discoveredMaterial: StandardMaterial;
  readonly undiscoveredMaterial: StandardMaterial;
};

type GateVisual = {
  readonly lockedParts: readonly Mesh[];
  readonly unlockedParts: readonly Mesh[];
};

function configureScene(scene: Scene): void {
  scene.clearColor = new Color4(0.58, 0.67, 0.7, 1);
  scene.fogMode = Scene.FOGMODE_EXP2;
  scene.fogDensity = 0.018;
  scene.fogColor = new Color3(0.58, 0.67, 0.7);

  const ambientLight = new HemisphericLight(
    "forest-ambient-light",
    new Vector3(0, 1, 0),
    scene,
  );
  ambientLight.intensity = 0.82;
  ambientLight.diffuse = new Color3(0.98, 0.88, 0.72);
  ambientLight.groundColor = new Color3(0.18, 0.28, 0.2);

  const sunLight = new DirectionalLight(
    "forest-sun-light",
    new Vector3(-0.55, -1, -0.35),
    scene,
  );
  sunLight.intensity = 1.15;
  sunLight.diffuse = new Color3(1, 0.86, 0.62);
}

function createCamera(scene: Scene): ArcRotateCamera {
  const camera = new ArcRotateCamera(
    "main-camera",
    -Math.PI / 4,
    Math.PI / 3.15,
    10.5,
    Vector3.Zero(),
    scene,
  );

  camera.fov = 0.62;
  camera.lowerBetaLimit = Math.PI / 4.2;
  camera.upperBetaLimit = Math.PI / 2.7;
  camera.lowerRadiusLimit = 7.5;
  camera.upperRadiusLimit = 13;

  return camera;
}

function createTerrainVisuals(
  gameState: GameState,
  scene: Scene,
  materials: ForestMaterials,
): void {
  for (const tile of gameState.world.terrain.tiles) {
    const terrainTile = MeshBuilder.CreateBox(
      `terrain-${String(tile.x)}-${String(tile.z)}`,
      {
        width: gameState.world.terrain.tileSize * 0.98,
        height: 0.18,
        depth: gameState.world.terrain.tileSize * 0.98,
      },
      scene,
    );

    terrainTile.position.set(
      tile.x * gameState.world.terrain.tileSize,
      tile.height - 0.09,
      tile.z * gameState.world.terrain.tileSize,
    );
    terrainTile.material = materials.terrain[tile.kind];
  }
}

function createForestDecorationVisuals(
  gameState: GameState,
  scene: Scene,
  materials: ForestMaterials,
): void {
  for (const decoration of createForestDecorations(gameState.world.terrain)) {
    const groundY =
      getTerrainHeightAt(
        gameState.world.terrain,
        decoration.x,
        decoration.z,
      ) ?? 0;

    if (decoration.kind === "pine") {
      createPineVisual(decoration, groundY, scene, materials);
      continue;
    }

    if (decoration.kind === "shrub") {
      createShrubVisual(decoration, groundY, scene, materials);
      continue;
    }

    if (decoration.kind === "stone") {
      createStoneVisual(decoration, groundY, scene, materials);
      continue;
    }

    createPineStrawVisual(decoration, groundY, scene, materials);
  }
}

function createPineVisual(
  decoration: ForestDecoration,
  groundY: number,
  scene: Scene,
  materials: ForestMaterials,
): void {
  const root = new TransformNode(`forest-${decoration.id}`, scene);
  const trunkHeight = 0.72 * decoration.scale;
  const trunk = MeshBuilder.CreateCylinder(
    `${decoration.id}-trunk`,
    { height: trunkHeight, diameter: 0.12, tessellation: 6 },
    scene,
  );
  const lowerNeedles = MeshBuilder.CreateCylinder(
    `${decoration.id}-lower-needles`,
    {
      height: 0.72 * decoration.scale,
      diameterTop: 0.12,
      diameterBottom: 0.76 * decoration.scale,
      tessellation: 7,
    },
    scene,
  );
  const upperNeedles = MeshBuilder.CreateCylinder(
    `${decoration.id}-upper-needles`,
    {
      height: 0.62 * decoration.scale,
      diameterTop: 0.04,
      diameterBottom: 0.56 * decoration.scale,
      tessellation: 7,
    },
    scene,
  );

  root.position.set(decoration.x, groundY, decoration.z);
  root.rotation.y = decoration.rotation;
  trunk.position.set(0, trunkHeight / 2, 0);
  trunk.material = materials.pineTrunk;
  lowerNeedles.position.set(0, trunkHeight + 0.22 * decoration.scale, 0);
  lowerNeedles.material =
    decoration.variant === 0 ? materials.pineNeedlesDark : materials.pineNeedles;
  upperNeedles.position.set(0, trunkHeight + 0.58 * decoration.scale, 0);
  upperNeedles.material = materials.pineNeedles;

  for (const mesh of [trunk, lowerNeedles, upperNeedles]) {
    mesh.parent = root;
  }
}

function createShrubVisual(
  decoration: ForestDecoration,
  groundY: number,
  scene: Scene,
  materials: ForestMaterials,
): void {
  const shrub = MeshBuilder.CreateSphere(
    `forest-${decoration.id}`,
    { diameter: 0.42 * decoration.scale, segments: 7 },
    scene,
  );

  shrub.position.set(decoration.x, groundY + 0.16 * decoration.scale, decoration.z);
  shrub.scaling.set(1.15, 0.62, 0.92);
  shrub.rotation.y = decoration.rotation;
  shrub.material = materials.shrub;
}

function createStoneVisual(
  decoration: ForestDecoration,
  groundY: number,
  scene: Scene,
  materials: ForestMaterials,
): void {
  const stone = MeshBuilder.CreateSphere(
    `forest-${decoration.id}`,
    { diameter: 0.34 * decoration.scale, segments: 6 },
    scene,
  );

  stone.position.set(decoration.x, groundY + 0.1 * decoration.scale, decoration.z);
  stone.scaling.set(1.18, 0.5, 0.84);
  stone.rotation.y = decoration.rotation;
  stone.material =
    decoration.variant === 0 ? materials.stoneMoss : materials.stone;
}

function createPineStrawVisual(
  decoration: ForestDecoration,
  groundY: number,
  scene: Scene,
  materials: ForestMaterials,
): void {
  const straw = MeshBuilder.CreateCylinder(
    `forest-${decoration.id}`,
    { height: 0.018, diameter: 0.58 * decoration.scale, tessellation: 8 },
    scene,
  );

  straw.position.set(decoration.x, groundY + 0.012, decoration.z);
  straw.scaling.set(1.35, 1, 0.58);
  straw.rotation.y = decoration.rotation;
  straw.material = materials.pineStraw;
}

function createCollectibleVisuals(
  gameState: GameState,
  scene: Scene,
  materials: ForestMaterials,
): ReadonlyMap<string, CollectibleVisual> {
  const visuals = new Map<string, CollectibleVisual>();

  for (const collectible of gameState.world.collectibles) {
    const root = new TransformNode(`collectible-${collectible.id}`, scene);
    const coin = MeshBuilder.CreateCylinder(
      `collectible-${collectible.id}-coin`,
      { height: 0.08, diameter: 0.36, tessellation: 16 },
      scene,
    );
    const glow = MeshBuilder.CreateCylinder(
      `collectible-${collectible.id}-glow`,
      { height: 0.018, diameter: 0.58, tessellation: 16 },
      scene,
    );

    root.position.set(
      collectible.position.x,
      collectible.position.y - 0.18,
      collectible.position.z,
    );
    coin.position.set(0, 0.23, 0);
    coin.rotation.x = Math.PI / 2;
    coin.material = materials.coin;
    coin.parent = root;
    glow.position.set(0, 0.03, 0);
    glow.material = materials.coinGlow;
    glow.parent = root;
    root.setEnabled(!collectible.collected);
    visuals.set(collectible.id, {
      root,
      coin,
      baseCoinY: coin.position.y,
    });
  }

  return visuals;
}

function updateCollectibleVisuals(
  gameState: GameState,
  visuals: ReadonlyMap<string, CollectibleVisual>,
  spin: number,
): void {
  for (const collectible of gameState.world.collectibles) {
    const visual = visuals.get(collectible.id);

    if (visual === undefined) {
      continue;
    }

    visual.root.setEnabled(!collectible.collected);
    visual.coin.rotation.y = spin;
    visual.coin.position.y = visual.baseCoinY + Math.sin(spin * 2) * 0.04;
  }
}

function createLandmarkVisuals(
  gameState: GameState,
  scene: Scene,
  materials: ForestMaterials,
): ReadonlyMap<string, LandmarkVisual> {
  const visuals = new Map<string, LandmarkVisual>();

  for (const landmark of gameState.world.landmarks) {
    const root = new TransformNode(`landmark-${landmark.id}`, scene);
    const stones = [
      createLandmarkStone(`${landmark.id}-base`, 0, 0.16, 0, 0.52, scene),
      createLandmarkStone(`${landmark.id}-middle`, -0.06, 0.48, 0.02, 0.4, scene),
      createLandmarkStone(`${landmark.id}-cap`, 0.05, 0.76, -0.04, 0.3, scene),
    ];
    const marker = MeshBuilder.CreateSphere(
      `landmark-${landmark.id}-marker`,
      { diameter: 0.18, segments: 8 },
      scene,
    );
    const material = landmark.discovered
      ? materials.landmarkDiscovered
      : materials.landmarkUndiscovered;

    root.position.set(
      landmark.position.x,
      landmark.position.y - 0.6,
      landmark.position.z,
    );
    marker.position.set(0, 1.08, 0);
    marker.material = materials.landmarkMarker;
    marker.setEnabled(landmark.discovered);

    for (const stone of stones) {
      stone.parent = root;
      stone.material = material;
    }

    marker.parent = root;
    visuals.set(landmark.id, {
      stones,
      marker,
      discoveredMaterial: materials.landmarkDiscovered,
      undiscoveredMaterial: materials.landmarkUndiscovered,
    });
  }

  return visuals;
}

function createLandmarkStone(
  name: string,
  x: number,
  y: number,
  z: number,
  diameter: number,
  scene: Scene,
): Mesh {
  const stone = MeshBuilder.CreateSphere(
    `landmark-${name}`,
    { diameter, segments: 6 },
    scene,
  );

  stone.position.set(x, y, z);
  stone.scaling.set(1.15, 0.58, 0.9);
  stone.rotation.y = x * 4 + z * 3;

  return stone;
}

function updateLandmarkVisuals(
  gameState: GameState,
  visuals: ReadonlyMap<string, LandmarkVisual>,
): void {
  for (const landmark of gameState.world.landmarks) {
    const visual = visuals.get(landmark.id);

    if (visual === undefined) {
      continue;
    }

    const material = landmark.discovered
      ? visual.discoveredMaterial
      : visual.undiscoveredMaterial;

    for (const stone of visual.stones) {
      stone.material = material;
    }

    visual.marker.setEnabled(landmark.discovered);
  }
}

function createGateVisuals(
  gameState: GameState,
  scene: Scene,
  materials: ForestMaterials,
): ReadonlyMap<string, GateVisual> {
  const visuals = new Map<string, GateVisual>();

  for (const gate of gameState.world.gates) {
    const root = new TransformNode(`gate-${gate.id}`, scene);
    const leftPost = createGatePost(`${gate.id}-left-post`, -0.48, scene, materials);
    const rightPost = createGatePost(`${gate.id}-right-post`, 0.48, scene, materials);
    const lintel = MeshBuilder.CreateBox(
      `gate-${gate.id}-lintel`,
      { width: 1.25, height: 0.18, depth: 0.24 },
      scene,
    );
    const lockedDoor = MeshBuilder.CreateBox(
      `gate-${gate.id}-locked-door`,
      { width: 0.72, height: 0.92, depth: 0.16 },
      scene,
    );
    const openDoor = MeshBuilder.CreateBox(
      `gate-${gate.id}-open-door`,
      { width: 0.72, height: 0.92, depth: 0.16 },
      scene,
    );
    const moss = MeshBuilder.CreateBox(
      `gate-${gate.id}-moss`,
      { width: 0.46, height: 0.08, depth: 0.26 },
      scene,
    );

    root.position.set(gate.position.x, gate.position.y - 0.75, gate.position.z);
    lintel.position.set(0, 1.34, 0);
    lintel.material = materials.gateWood;
    lockedDoor.position.set(0, 0.58, 0);
    lockedDoor.material = materials.gateWood;
    openDoor.position.set(0.47, 0.58, 0.32);
    openDoor.rotation.y = -Math.PI / 2.8;
    openDoor.material = materials.gateWood;
    moss.position.set(-0.18, 1.49, 0);
    moss.material = materials.gateMoss;

    for (const mesh of [leftPost, rightPost, lintel, lockedDoor, openDoor, moss]) {
      mesh.parent = root;
    }

    openDoor.setEnabled(gate.unlocked);
    lockedDoor.setEnabled(!gate.unlocked);
    visuals.set(gate.id, {
      lockedParts: [lockedDoor],
      unlockedParts: [openDoor],
    });
  }

  return visuals;
}

function createGatePost(
  name: string,
  x: number,
  scene: Scene,
  materials: ForestMaterials,
): Mesh {
  const post = MeshBuilder.CreateCylinder(
    name,
    { height: 1.35, diameter: 0.18, tessellation: 6 },
    scene,
  );

  post.position.set(x, 0.68, 0);
  post.material = materials.gateWood;

  return post;
}

function updateGateVisuals(
  gameState: GameState,
  visuals: ReadonlyMap<string, GateVisual>,
): void {
  for (const gate of gameState.world.gates) {
    const visual = visuals.get(gate.id);

    if (visual === undefined) {
      continue;
    }

    for (const mesh of visual.lockedParts) {
      mesh.setEnabled(!gate.unlocked);
    }

    for (const mesh of visual.unlockedParts) {
      mesh.setEnabled(gate.unlocked);
    }
  }
}

function createBoundaryVisuals(
  gameState: GameState,
  scene: Scene,
  materials: ForestMaterials,
): void {
  const { movementBounds, tileSize } = gameState.world.terrain;
  const minX = movementBounds.minX - tileSize / 2;
  const maxX = movementBounds.maxX + tileSize / 2;
  const minZ = movementBounds.minZ - tileSize / 2;
  const maxZ = movementBounds.maxZ + tileSize / 2;
  const width = maxX - minX;
  const depth = maxZ - minZ;
  const thickness = 0.12;
  const height = 0.16;
  const north = MeshBuilder.CreateBox(
    "boundary-north",
    { width, height, depth: thickness },
    scene,
  );
  const south = MeshBuilder.CreateBox(
    "boundary-south",
    { width, height, depth: thickness },
    scene,
  );
  const east = MeshBuilder.CreateBox(
    "boundary-east",
    { width: thickness, height, depth },
    scene,
  );
  const west = MeshBuilder.CreateBox(
    "boundary-west",
    { width: thickness, height, depth },
    scene,
  );

  north.position.set(0, height, maxZ);
  south.position.set(0, height, minZ);
  east.position.set(maxX, height, 0);
  west.position.set(minX, height, 0);

  for (const mesh of [north, south, east, west]) {
    mesh.material = materials.boundaryLog;
  }
}

function createPlayerVisual(
  gameState: GameState,
  scene: Scene,
  materials: ForestMaterials,
): TransformNode {
  const root = new TransformNode("player-adventurer", scene);
  const body = MeshBuilder.CreateBox(
    "player-body",
    { width: 0.38, height: 0.48, depth: 0.28 },
    scene,
  );
  const head = MeshBuilder.CreateSphere(
    "player-head",
    { diameter: 0.26, segments: 8 },
    scene,
  );
  const hat = MeshBuilder.CreateCylinder(
    "player-hat",
    { height: 0.22, diameterTop: 0.08, diameterBottom: 0.34, tessellation: 6 },
    scene,
  );
  const pack = MeshBuilder.CreateBox(
    "player-pack",
    { width: 0.24, height: 0.32, depth: 0.1 },
    scene,
  );

  root.position.set(
    gameState.player.position.x,
    gameState.player.position.y - PLAYER_HALF_HEIGHT,
    gameState.player.position.z,
  );
  root.rotation.y = gameState.player.facing;
  body.position.set(0, 0.32, 0);
  body.material = materials.playerBody;
  head.position.set(0, 0.67, 0.02);
  head.material = materials.playerHead;
  hat.position.set(0, 0.86, 0.02);
  hat.material = materials.playerHat;
  pack.position.set(0, 0.34, -0.2);
  pack.material = materials.playerPack;

  for (const mesh of [body, head, hat, pack]) {
    mesh.parent = root;
  }

  return root;
}

function createForestMaterials(scene: Scene): ForestMaterials {
  const terrain = createTerrainMaterials(scene);
  const pineTrunk = createMaterial(
    scene,
    "pine-trunk-material",
    new Color3(0.34, 0.2, 0.12),
  );
  const pineNeedles = createMaterial(
    scene,
    "pine-needles-material",
    new Color3(0.13, 0.34, 0.22),
  );
  const pineNeedlesDark = createMaterial(
    scene,
    "pine-needles-dark-material",
    new Color3(0.08, 0.26, 0.18),
  );
  const pineStraw = createMaterial(
    scene,
    "pine-straw-material",
    new Color3(0.66, 0.42, 0.18),
  );
  const shrub = createMaterial(
    scene,
    "forest-shrub-material",
    new Color3(0.21, 0.43, 0.24),
  );
  const stone = createMaterial(
    scene,
    "forest-stone-material",
    new Color3(0.42, 0.43, 0.4),
  );
  const stoneMoss = createMaterial(
    scene,
    "forest-mossy-stone-material",
    new Color3(0.34, 0.43, 0.31),
  );
  const coin = createMaterial(
    scene,
    "collectible-coin-material",
    new Color3(0.98, 0.78, 0.22),
  );
  const coinGlow = createMaterial(
    scene,
    "collectible-glow-material",
    new Color3(0.95, 0.62, 0.14),
  );
  const playerBody = createMaterial(
    scene,
    "player-body-material",
    new Color3(0.22, 0.54, 0.42),
  );
  const playerHead = createMaterial(
    scene,
    "player-head-material",
    new Color3(0.86, 0.62, 0.42),
  );
  const playerHat = createMaterial(
    scene,
    "player-hat-material",
    new Color3(0.84, 0.66, 0.28),
  );
  const playerPack = createMaterial(
    scene,
    "player-pack-material",
    new Color3(0.38, 0.23, 0.15),
  );
  const gateWood = createMaterial(
    scene,
    "gate-wood-material",
    new Color3(0.42, 0.25, 0.14),
  );
  const gateMoss = createMaterial(
    scene,
    "gate-moss-material",
    new Color3(0.28, 0.48, 0.24),
  );
  const boundaryLog = createMaterial(
    scene,
    "boundary-log-material",
    new Color3(0.31, 0.18, 0.1),
  );
  const landmarkDiscovered = createMaterial(
    scene,
    "landmark-discovered-material",
    new Color3(0.56, 0.66, 0.62),
  );
  const landmarkUndiscovered = createMaterial(
    scene,
    "landmark-undiscovered-material",
    new Color3(0.27, 0.28, 0.26),
  );
  const landmarkMarker = createMaterial(
    scene,
    "landmark-marker-material",
    new Color3(0.5, 0.78, 0.86),
  );

  coin.emissiveColor = new Color3(0.25, 0.16, 0.03);
  coinGlow.alpha = 0.38;
  coinGlow.emissiveColor = new Color3(0.65, 0.38, 0.08);
  landmarkMarker.emissiveColor = new Color3(0.16, 0.36, 0.42);

  return {
    terrain,
    pineTrunk,
    pineNeedles,
    pineNeedlesDark,
    pineStraw,
    shrub,
    stone,
    stoneMoss,
    coin,
    coinGlow,
    playerBody,
    playerHead,
    playerHat,
    playerPack,
    gateWood,
    gateMoss,
    boundaryLog,
    landmarkDiscovered,
    landmarkUndiscovered,
    landmarkMarker,
  };
}

function createTerrainMaterials(
  scene: Scene,
): Record<TerrainTileKind, StandardMaterial> {
  const grass = createMaterial(
    scene,
    "terrain-grass-material",
    new Color3(0.24, 0.48, 0.28),
  );
  const clearing = createMaterial(
    scene,
    "terrain-clearing-material",
    new Color3(0.62, 0.45, 0.25),
  );
  const stone = createMaterial(
    scene,
    "terrain-stone-material",
    new Color3(0.45, 0.47, 0.42),
  );

  return {
    grass,
    clearing,
    stone,
  };
}

function createMaterial(
  scene: Scene,
  name: string,
  diffuseColor: Color3,
): StandardMaterial {
  const material = new StandardMaterial(name, scene);

  material.diffuseColor = diffuseColor;
  material.specularColor = new Color3(0.06, 0.05, 0.04);

  return material;
}
