import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { generateId } from "lib/authentication";
import type { Role } from "types/enums";

@Entity()
export class User {
  @PrimaryKey()
  id: string = generateId();

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ unique: true })
  name!: string;

  @Property()
  displayName!: string;

  @Property()
  roles: [Role] = ["user"];

  @Property()
  passwordHash!: string;

  @Property()
  recoveryCode?: string;

  @Property()
  iconUrl?: string;

  constructor(
    init: PartialSome<User, "id" | "createdAt" | "updatedAt" | "roles">
  ) {
    Object.assign(this, init);
  }
}
