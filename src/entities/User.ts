import { Entity, Property } from "@mikro-orm/core";
import { Static, t } from "elysia";
import { AccessType, Role } from "types/enums";
import { Base, BaseInit } from "./Base";

@Entity()
export class User extends Base {
  @Property({ unique: true, columnType: "text COLLATE NOCASE" })
  name!: string;

  @Property()
  displayName: string = this.name;

  @Property({ type: "json" })
  roles: Role[] = ["user"];

  @Property()
  hasReadAccess: AccessType = "inviteOnly";

  @Property()
  passwordHash!: string;

  @Property({ nullable: true, index: true })
  recoveryTokenHash?: string;

  @Property({ nullable: true })
  iconUrl?: string;

  constructor(
    init: {
      name: string;
      displayName?: string;
      roles?: Role[];
      hasReadAccess?: AccessType;
      passwordHash: string;
      recoveryTokenHash?: string;
      iconUrl?: string;
    } & BaseInit
  ) {
    super(init);
  }
}

export const CreateUser = t.Object({
  name: t.String(),
  displayName: t.Optional(t.String()),
  hasReadAccess: t.Optional(AccessType),
  iconUrl: t.Optional(t.String()),
  password: t.String(),
  generateRecoveryToken: t.Optional(t.Boolean({ default: false })),
});
export type CreateUser = Static<typeof CreateUser>;

export const UpdateUser = t.Partial(CreateUser);
export type UpdateUser = Static<typeof UpdateUser>;

export const GetUser = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  name: t.String(),
  displayName: t.String(),
  roles: t.Array(Role),
  hasReadAccess: AccessType,
  iconUrl: t.Optional(t.String()),
});
export type GetUser = Static<typeof GetUser>;
