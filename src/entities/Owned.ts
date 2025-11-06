import { Entity, ManyToOne, Property, Unique } from "@mikro-orm/core";
import { User } from "entities/User";
import { AccessType } from "types/enums";
import { Base, GetBase, type BaseInit } from "entities/Base";
import { t } from "elysia";
import { Ref } from "types/ref";

@Entity({ abstract: true })
@Unique({ properties: ["name", "owner"] })
export abstract class Owned extends Base {
  @Property({ columnType: "text COLLATE NOCASE" })
  name!: string;

  @Property()
  displayName: string = this.name;

  @ManyToOne()
  owner!: User;

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
  owner: User;
  hasReadAccess?: AccessType;
  hasWriteAccess?: AccessType;
}

export const NewOwned = t.Object({
  name: t.String(),
  displayName: t.Optional(t.String()),
  ownerRef: t.String(),
  hasReadAccess: t.Optional(AccessType),
  hasWriteAccess: t.Optional(AccessType),
});

export const PushOwned = t.Union([
  NewOwned,
  t.Intersect([Ref, t.Partial(NewOwned)]),
]);

export const GetOwned = t.Intersect([
  GetBase,
  t.Object({
    name: t.String(),
    displayName: t.String(),
    ownerId: t.String(),
    hasReadAccess: AccessType,
    hasWriteAccess: AccessType,
  }),
]);
