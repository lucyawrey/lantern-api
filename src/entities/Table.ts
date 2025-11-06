import { Entity } from "@mikro-orm/core";
import { t } from "elysia";
import { NewOwned, GetOwned, Owned } from "entities/Owned";

@Entity()
export class Table extends Owned {}

export const NewTable = NewOwned;

export const UpdateTable = t.Partial(NewTable);

export const GetTable = GetOwned;
