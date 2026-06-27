export type AssetKind = "audio" | "data" | "model" | "texture";

export type AssetManifestEntry = {
  readonly id: string;
  readonly kind: AssetKind;
  readonly path: string;
  readonly preload?: boolean;
};

export type AssetManifest = {
  readonly basePath?: string;
  readonly entries: readonly AssetManifestEntry[];
};

export type AssetCatalog = {
  get(id: string): AssetManifestEntry | undefined;
  require(id: string): AssetManifestEntry;
  list(kind?: AssetKind): readonly AssetManifestEntry[];
  resolveUrl(id: string): string | undefined;
  requireUrl(id: string): string;
};

export function createAssetCatalog(manifest: AssetManifest): AssetCatalog {
  const entriesById = new Map<string, AssetManifestEntry>();
  const basePath = normalizeBasePath(manifest.basePath ?? "");

  for (const entry of manifest.entries) {
    validateEntry(entry);

    if (entriesById.has(entry.id)) {
      throw new Error(`Duplicate asset id: ${entry.id}`);
    }

    entriesById.set(entry.id, entry);
  }

  return {
    get: (id) => entriesById.get(id),
    require: (id) => {
      const entry = entriesById.get(id);

      if (entry === undefined) {
        throw new Error(`Unknown asset id: ${id}`);
      }

      return entry;
    },
    list: (kind) => {
      const entries = [...entriesById.values()];
      return kind === undefined
        ? entries
        : entries.filter((entry) => entry.kind === kind);
    },
    resolveUrl: (id) => {
      const entry = entriesById.get(id);

      return entry === undefined ? undefined : joinAssetUrl(basePath, entry.path);
    },
    requireUrl: (id) => {
      const entry = entriesById.get(id);

      if (entry === undefined) {
        throw new Error(`Unknown asset id: ${id}`);
      }

      return joinAssetUrl(basePath, entry.path);
    },
  };
}

function validateEntry(entry: AssetManifestEntry): void {
  if (entry.id.trim().length === 0) {
    throw new Error("Asset id must not be empty.");
  }

  if (entry.path.trim().length === 0) {
    throw new Error(`Asset path must not be empty for asset id: ${entry.id}`);
  }

  validateRelativePath(entry.path, entry.id);
}

function validateRelativePath(path: string, id: string): void {
  if (
    path.startsWith("/") ||
    path.includes("\\") ||
    /^[a-z][a-z\d+.-]*:/i.test(path) ||
    path.split("/").includes("..")
  ) {
    throw new Error(`Asset path must be a relative URL path for asset id: ${id}`);
  }
}

function normalizeBasePath(basePath: string): string {
  const trimmedBasePath = basePath.trim();

  if (trimmedBasePath.length === 0) {
    return "";
  }

  validateRelativePath(trimmedBasePath, "manifest-base");

  return trimmedBasePath.replace(/\/+$/u, "");
}

function joinAssetUrl(basePath: string, path: string): string {
  return basePath.length === 0 ? path : `${basePath}/${path}`;
}
