import { Entity, ManyToOne, Unique } from "@mikro-orm/core";
import { User } from "entities/User";
import { Base, type BaseInit } from "./Base";

@Entity()
@Unique({ properties: ["userA", "userB"] })
export class Friendship extends Base {
  @ManyToOne()
  userA!: User;

  @ManyToOne()
  userB!: User;

  constructor(init: { userA: User; userB: User } & BaseInit) {
    super(init);
  }
}
