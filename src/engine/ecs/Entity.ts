export type EntityId = number;

export type ComponentStore<TComponent> = Map<EntityId, TComponent>;

export type ComponentStores<TComponents extends Record<string, unknown>> = {
  readonly [K in keyof TComponents]: ComponentStore<TComponents[K]>;
};

export type QueryResult<TComponents extends Record<string, unknown>> = {
  readonly entity: EntityId;
  readonly components: Readonly<TComponents>;
};
