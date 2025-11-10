import { EntityName } from "@mikro-orm/core";
import { Owned } from "entities/Owned";
import { User } from "entities/User";
import { Em } from "lib/db";

export async function findOwnedByRef<Entity extends Owned>(
  em: Em,
  entityName: EntityName<Entity>,
  ownerUser: PartialExcept<User, "id">,
  ref: string
): Promise<Entity> {
  const entity = await em.findOne(entityName as EntityName<Owned>, {
    $or: [{ id: ref }, { $and: [{ name: ref, ownerUser: ownerUser }] }],
  });
  if (!entity) {
    throw `${entityName} not found.`;
  }
  return entity as Entity;
}
