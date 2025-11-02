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
import { AccessType } from "types/enums";
import { Data, DataValue } from "types/data";
import { ContentRenderer } from "entities/ContentRenderer";

@Entity()
export class Content {
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

  @ManyToOne(() => ContentType)
  contentType!: ContentType;

  @Property({ type: "json" })
  indexKeys: string[] = [];

  @Embedded()
  indexes: Indexes = new Indexes();

  @Property({ type: "json" })
  data: Data = {};

  @ManyToOne()
  contentRenderer?: ContentRenderer;
}

@Entity()
export class Indexes {
  @Property()
  index0?: DataValue;
  @Property()
  index1?: DataValue;
  @Property()
  index2?: DataValue;
  @Property()
  index3?: DataValue;
  @Property()
  index4?: DataValue;
  @Property()
  index5?: DataValue;
  @Property()
  index6?: DataValue;
  @Property()
  index7?: DataValue;
  @Property()
  index8?: DataValue;
  @Property()
  index9?: DataValue;
}
