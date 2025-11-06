import { Entity } from "@mikro-orm/core";
import { t } from "elysia";
import { NewOwned, GetOwned, Owned } from "entities/Owned";

@Entity()
export class Ruleset extends Owned {}

export const NewRuleset = NewOwned;

export const UpdateRuleset = t.Partial(NewRuleset);

export const GetRuleset = GetOwned;
