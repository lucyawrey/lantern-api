import { Entity, Property } from "@mikro-orm/core";
import { Static, t } from "elysia";
import { AccessType, Role } from "types/enums";
import { Base, BaseInit, GetBase } from "entities/Base";
import { Push } from "types/push";

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

export const SignupUser = t.Object({
  name: t.String(),
  displayName: t.Optional(t.String()),
  hasReadAccess: t.Optional(AccessType),
  iconUrl: t.Optional(t.String()),
  password: t.String(),
  generateRecoveryToken: t.Optional(t.Boolean({ default: false })),
});
export type SignupUser = Static<typeof SignupUser>;

export const NewUser = t.Intersect([
  SignupUser,
  t.Object({
    roles: t.Optional(t.Array(Role)),
  }),
]);
export type NewUser = Static<typeof NewUser>;

export const PushUser = Push(NewUser);
export type PushUser = Static<typeof PushUser>;

export const GetUser = t.Intersect([
  GetBase,
  t.Object({
    name: t.String(),
    displayName: t.String(),
    roles: t.Array(Role),
    hasReadAccess: AccessType,
    iconUrl: t.Optional(t.String()),
  }),
]);
export type GetUser = Static<typeof GetUser>;
