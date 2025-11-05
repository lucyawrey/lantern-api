import { Entity, ManyToOne, Unique } from "@mikro-orm/core";
import { User } from "entities/User";
import { Table } from "entities/Table";
import { Base, BaseInit } from "./Base";

@Entity()
@Unique({ properties: ["table", "user"] })
export class TableMembership extends Base {
  @ManyToOne()
  table!: Table;

  @ManyToOne()
  user!: User;

  constructor(init: { table: Table; user: User } & BaseInit) {
    super(init);
  }
}
