import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
  type Rel,
} from "@mikro-orm/core";
import { generateId } from "lib/auth";
import { User } from "entities/User";
import type { AccessType } from "types/enums";
import { ContentType } from "entities/ContentType";

@Entity()
@Unique({ properties: ["name", "owner"] })
export class ContentRenderer {
  @PrimaryKey()
  id: string = generateId();

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ columnType: "text COLLATE NOCASE" })
  name!: string;

  @Property()
  displayName: string = this.name;

  @ManyToOne()
  owner!: User;

  @Property()
  hasReadAccess: AccessType = "inviteOnly";

  @Property()
  hasWriteAccess: AccessType = "inviteOnly";

  @ManyToOne(() => ContentType, { index: true })
  contentType!: Rel<ContentType>;

  @Property()
  cssStyles: string = "";

  @Property()
  changelingMarkup: string = "";

  constructor(
    init: PartialSome<
      ContentRenderer,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "displayName"
      | "hasReadAccess"
      | "hasWriteAccess"
      | "changelingMarkup"
      | "cssStyles"
    >
  ) {
    Object.assign(this, init);
  }
}
