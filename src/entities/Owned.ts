import { Entity, ManyToOne, Property, Unique } from "@mikro-orm/core";
import { User } from "entities/User";
import { AccessType } from "types/enums";
import { Base, type BaseInit } from "entities/Base";

@Entity({ abstract: true })
@Unique({ properties: ["name", "owner"] })
export abstract class Owned extends Base {
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

  constructor(init: OwnedInit) {
    super(init);
  }
}

export interface OwnedInit extends BaseInit {
  name: string;
  displayName?: string;
  owner: User;
  hasReadAccess?: AccessType;
  hasWriteAccess?: AccessType;
}
