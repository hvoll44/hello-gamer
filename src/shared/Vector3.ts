export type Vector3 = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};

export const ZERO_VECTOR3: Vector3 = Object.freeze({ x: 0, y: 0, z: 0 });
