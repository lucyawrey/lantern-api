import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Static, t } from "elysia";
import { generateId } from "lib/auth";
import { AccessType, Role } from "types/enums";

@Entity()
export class User {
  @PrimaryKey()
  id: string = generateId();

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

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
    init: PartialSome<
      User,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "displayName"
      | "roles"
      | "hasReadAccess"
    >
  ) {
    Object.assign(this, init);
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
