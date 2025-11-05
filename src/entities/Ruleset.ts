import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core";
import { generateId } from "lib/auth";
import { User } from "entities/User";
import { AccessType } from "types/enums";
import { Static, t } from "elysia";

@Entity()
@Unique({ properties: ["name", "owner"] })
export class Ruleset {
  @PrimaryKey()
  id: string = generateId();

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ columnType: "text COLLATE NOCASE" })
  name!: string;

  @Property()
  displayName!: string;

  @ManyToOne()
  owner!: User;

  @Property()
  hasReadAccess: AccessType = "inviteOnly";

  @Property()
  hasWriteAccess: AccessType = "inviteOnly";

  constructor(
    init: PartialSome<
      Ruleset,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "displayName"
      | "hasReadAccess"
      | "hasWriteAccess"
    >
  ) {
    Object.assign(this, init);
  }
}

export const CreateRuleset = t.Object({
  name: t.String(),
  displayName: t.Optional(t.String()),
  ownerRef: t.String(),
  hasReadAccess: t.Optional(AccessType),
  hasWriteAccess: t.Optional(AccessType),
});
export type CreateRuleset = Static<typeof CreateRuleset>;

export const UpdateRuleset = t.Partial(CreateRuleset);
export type UpdateRuleset = Static<typeof UpdateRuleset>;

export const GetRuleset = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  name: t.String(),
  displayName: t.Optional(t.String()),
  ownerId: t.String(),
  hasReadAccess: AccessType,
  hasWriteAccess: AccessType,
});
export type GetRuleset = Static<typeof GetRuleset>;
