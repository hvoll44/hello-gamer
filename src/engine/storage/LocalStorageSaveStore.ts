export type SaveStore = {
  read(): string | undefined;
  write(serializedSaveData: string): void;
};

export function createLocalStorageSaveStore(
  storage: Storage,
  key: string,
): SaveStore {
  return {
    read: () => storage.getItem(key) ?? undefined,
    write: (serializedSaveData) => {
      storage.setItem(key, serializedSaveData);
    },
  };
}
