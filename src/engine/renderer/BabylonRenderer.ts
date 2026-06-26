import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Scene } from "@babylonjs/core/scene";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

import type { GameState } from "../../game/state/GameState";

export type BabylonRenderer = {
  readonly scene: Scene;
  render(): void;
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
  camera.attachControl(canvas, true);

  new HemisphericLight("sunlight", new Vector3(0, 1, 0), scene);

  const ground = MeshBuilder.CreateGround(
    "debug-ground",
    { width: 10, height: 10 },
    scene,
  );
  const groundMaterial = new StandardMaterial("debug-ground-material", scene);
  groundMaterial.diffuseColor = new Color3(0.18, 0.42, 0.28);
  ground.material = groundMaterial;

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
    render: () => {
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
