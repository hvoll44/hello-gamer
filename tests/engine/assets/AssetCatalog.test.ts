import { describe, expect, it } from "vitest";

import { createAssetCatalog } from "../../../src/engine/assets/AssetCatalog";

describe("createAssetCatalog", () => {
  it("looks up entries and resolves URLs from a manifest base path", () => {
    const catalog = createAssetCatalog({
      basePath: "assets",
      entries: [
        {
          id: "player.model",
          kind: "model",
          path: "models/player.glb",
        },
      ],
    });

    expect(catalog.require("player.model")).toEqual({
      id: "player.model",
      kind: "model",
      path: "models/player.glb",
    });
    expect(catalog.requireUrl("player.model")).toBe("assets/models/player.glb");
  });

  it("filters entries by kind", () => {
    const catalog = createAssetCatalog({
      entries: [
        {
          id: "player.model",
          kind: "model",
          path: "models/player.glb",
        },
        {
          id: "forest.ambience",
          kind: "audio",
          path: "audio/forest.ogg",
        },
      ],
    });

    expect(catalog.list("audio")).toEqual([
      {
        id: "forest.ambience",
        kind: "audio",
        path: "audio/forest.ogg",
      },
    ]);
  });

  it("rejects duplicate asset ids", () => {
    expect(() =>
      createAssetCatalog({
        entries: [
          {
            id: "duplicate",
            kind: "texture",
            path: "textures/a.png",
          },
          {
            id: "duplicate",
            kind: "texture",
            path: "textures/b.png",
          },
        ],
      }),
    ).toThrow("Duplicate asset id: duplicate");
  });

  it("rejects absolute and parent-traversing paths", () => {
    expect(() =>
      createAssetCatalog({
        entries: [
          {
            id: "bad.absolute",
            kind: "data",
            path: "/assets/data.json",
          },
        ],
      }),
    ).toThrow("Asset path must be a relative URL path");

    expect(() =>
      createAssetCatalog({
        entries: [
          {
            id: "bad.parent",
            kind: "data",
            path: "../secrets.json",
          },
        ],
      }),
    ).toThrow("Asset path must be a relative URL path");
  });

  it("returns undefined for optional lookups of unknown assets", () => {
    const catalog = createAssetCatalog({ entries: [] });

    expect(catalog.get("missing")).toBeUndefined();
    expect(catalog.resolveUrl("missing")).toBeUndefined();
    expect(() => catalog.require("missing")).toThrow("Unknown asset id: missing");
  });
});
