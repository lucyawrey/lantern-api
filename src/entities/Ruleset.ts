import { Entity } from "@mikro-orm/core";
import { PushOwned, GetOwned, Owned } from "entities/Owned";

@Entity()
export class Ruleset extends Owned {}

export { PushOwned as PushRuleset, GetOwned as GetRuleset };
