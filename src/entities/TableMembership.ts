import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Unique,
} from "@mikro-orm/core";
import { User } from "entities/User";
import { generateId } from "lib/auth";
import { Table } from "entities/Table";

@Entity()
@Unique({ properties: ["table", "user"] })
export class TableMembership {
  @PrimaryKey()
  id: string = generateId();

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne()
  table!: Table;

  @ManyToOne()
  user!: User;

  constructor(
    init: PartialSome<TableMembership, "id" | "createdAt" | "updatedAt">
  ) {
    Object.assign(this, init);
  }
}
