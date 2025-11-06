import { Entity } from "@mikro-orm/core";
import { NewOwned, PushOwned, GetOwned, Owned } from "entities/Owned";

@Entity()
export class Ruleset extends Owned {}

export {
  NewOwned as NewRuleset,
  PushOwned as PushRuleset,
  GetOwned as GetRuleset,
};
