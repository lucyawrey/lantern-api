import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { generateId } from "lib/authentication";
import { User } from "entities/User";
import { AccessType, ContentMode, ContentCategory } from "types/enums";
import { Ruleset } from "entities/Ruleset";
import { Schema } from "types/schema";

@Entity()
export class ContentType {
  @PrimaryKey()
  id: string = generateId();

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  name!: string;

  @Property()
  displayName!: string;

  @ManyToOne()
  owner!: User;

  @Property()
  hasReadAccess: AccessType = "inviteOnly";

  @Property()
  hasWriteAccess: AccessType = "inviteOnly";

  @ManyToOne()
  ruleset!: Ruleset;

  @Property()
  contentMode: ContentMode = "static";

  @Property()
  contentCategory: ContentCategory = "other";

  @Property()
  hasDynamicSchema: boolean = true;

  @Property({ type: "json" })
  indexKeys?: [string];

  @Property({ type: "json" })
  schema?: Schema;

  //@ManyToOne()
  //defaultContentRenderer?: ContentRenderer;
}
