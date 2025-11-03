import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core";
import { generateId } from "lib/auth";
import { User } from "entities/User";
import type { AccessType } from "types/enums";

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
      "id" | "createdAt" | "updatedAt" | "hasReadAccess" | "hasWriteAccess"
    >
  ) {
    Object.assign(this, init);
  }
}
