import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import { User } from "entities/User";
import { generateId } from "lib/authentication";
import { Table } from "entities/Table";

@Entity()
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
}
