import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Embedded,
} from "@mikro-orm/core";
import { User } from "entities/User";
import { ContentType } from "entities/ContentType";
import { generateId } from "lib/authentication";
import type { AccessType } from "types/enums";
import type { Data } from "types/data";
import { ContentRenderer } from "entities/ContentRenderer";
import { Indexes } from "entities/Indexes";

@Entity()
export class Content {
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

  @ManyToOne()
  owner!: User;

  @Property()
  hasReadAccess: AccessType = "inviteOnly";

  @Property()
  hasWriteAccess: AccessType = "inviteOnly";

  @ManyToOne()
  contentType!: ContentType;

  @Property({ type: "json" })
  indexKeys: string[] = [];

  @Embedded()
  indexes: Indexes = new Indexes();

  @Property({ type: "json" })
  data: Data = {};

  @ManyToOne({ nullable: true })
  contentRenderer?: ContentRenderer;
}
