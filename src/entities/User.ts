import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { generateId } from "lib/auth";
import type { AccessType, Role } from "types/enums";

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
  displayName!: string;

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
      "id" | "createdAt" | "updatedAt" | "roles" | "hasReadAccess"
    >
  ) {
    Object.assign(this, init);
  }
}
