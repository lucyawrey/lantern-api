import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  type Rel,
} from "@mikro-orm/core";
import { generateId } from "lib/authentication";
import { User } from "entities/User";
import type { AccessType } from "types/enums";
import { ContentType } from "entities/ContentType";

@Entity()
export class ContentRenderer {
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

  // @ManyToOne({ entity: () => "ContentType" })
  // contentType!: Rel<ContentType>;

  @Property()
  cssStyles: string = "";

  @Property()
  changelingMarkup: string = "";
}
