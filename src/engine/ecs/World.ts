import type {
  ComponentStore,
  ComponentStores,
  EntityId,
  QueryResult,
} from "./Entity";

export class World {
  private nextEntityId = 1;
  private readonly activeEntities = new Set<EntityId>();

  createEntity(): EntityId {
    const entity = this.nextEntityId;
    this.nextEntityId += 1;
    this.activeEntities.add(entity);
    return entity;
  }

  destroyEntity(entity: EntityId): void {
    this.activeEntities.delete(entity);
  }

  hasEntity(entity: EntityId): boolean {
    return this.activeEntities.has(entity);
  }

  query<TComponents extends Record<string, unknown>>(
    stores: ComponentStores<TComponents>,
  ): QueryResult<TComponents>[] {
    const entries = Object.entries(stores) as Array<
      [keyof TComponents, ComponentStore<TComponents[keyof TComponents]>]
    >;

    return [...this.activeEntities].flatMap((entity) => {
      const components = {} as TComponents;

      for (const [name, store] of entries) {
        const component = store.get(entity);

        if (component === undefined) {
          return [];
        }

        components[name] = component;
      }

      return [{ entity, components }];
    });
  }
}
