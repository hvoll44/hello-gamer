export type InventoryItemKind = "ancientCoin";

export type InventoryState = {
  readonly items: Readonly<Record<InventoryItemKind, number>>;
};

export function createEmptyInventory(): InventoryState {
  return {
    items: {
      ancientCoin: 0,
    },
  };
}

export function addInventoryItem(
  inventory: InventoryState,
  itemKind: InventoryItemKind,
  quantity = 1,
): InventoryState {
  return {
    items: {
      ...inventory.items,
      [itemKind]: inventory.items[itemKind] + quantity,
    },
  };
}

export function spendInventoryItem(
  inventory: InventoryState,
  itemKind: InventoryItemKind,
  quantity: number,
): InventoryState {
  return {
    items: {
      ...inventory.items,
      [itemKind]: Math.max(0, inventory.items[itemKind] - quantity),
    },
  };
}
