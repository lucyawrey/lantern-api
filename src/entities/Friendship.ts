import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Unique,
} from "@mikro-orm/core";
import { User } from "entities/User";
import { generateId } from "lib/auth";

@Entity()
@Unique({ properties: ["userA", "userB"] })
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

  constructor(init: PartialSome<Friendship, "id" | "createdAt" | "updatedAt">) {
    Object.assign(this, init);
  }
}
