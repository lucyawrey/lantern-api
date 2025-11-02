import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import { User } from "entities/User";
import { generateId } from "lib/authentication";

@Entity()
export class Friendship {
  @PrimaryKey()
  id: string = generateId();

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne()
  userA!: User;

  @ManyToOne()
  userB!: User;
}
