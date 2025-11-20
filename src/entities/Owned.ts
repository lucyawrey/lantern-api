import { Entity, ManyToOne, Property, Unique } from "@mikro-orm/core";
import { User } from "entities/User";
import { AccessType } from "types/enums";
import { Base, GetBase, type BaseInit } from "entities/Base";
import { Static, t } from "elysia";

@Entity({ abstract: true })
@Unique({ properties: ["name", "ownerUser"] })
export abstract class Owned extends Base {
  @Property({ columnType: "text COLLATE NOCASE" })
  name!: string;

  @Property()
  displayName: string = this.name;

  @ManyToOne()
  ownerUser!: User;

  @Property()
  hasReadAccess: AccessType = "inviteOnly";

  @Property()
  hasWriteAccess: AccessType = "inviteOnly";

  constructor(init: OwnedInit) {
    super(init);
  }
}

export interface OwnedInit extends BaseInit {
  name: string;
  displayName?: string;
  ownerUser: User;
  hasReadAccess?: AccessType;
  hasWriteAccess?: AccessType;
}

export const PushOwned = t.Object({
  id: t.Optional(t.String()),
  name: t.Optional(t.String()),
  displayName: t.Optional(t.String()),
  ownerUserRef: t.Optional(t.String()),
  hasReadAccess: t.Optional(AccessType),
  hasWriteAccess: t.Optional(AccessType),
});
export type PushOwned = Static<typeof PushOwned>;

export const GetOwned = t.Composite([
  GetBase,
  t.Object({
    name: t.String(),
    displayName: t.String(),
    ownerUserId: t.String(),
    hasReadAccess: AccessType,
    hasWriteAccess: AccessType,
  }),
]);
export type GetOwned = Static<typeof GetOwned>;
