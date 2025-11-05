import { Entity } from "@mikro-orm/core";
import { t } from "elysia";
import { CreateOwned, GetOwned, Owned } from "entities/Owned";

@Entity()
export class Ruleset extends Owned {}

export const CreateRuleset = CreateOwned;

export const UpdateRuleset = t.Partial(CreateRuleset);

export const GetRuleset = GetOwned;
