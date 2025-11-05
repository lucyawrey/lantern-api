import { Entity } from "@mikro-orm/core";
import { t } from "elysia";
import { CreateOwned, GetOwned, Owned } from "entities/Owned";

@Entity()
export class Table extends Owned {}

export const CreateTable = CreateOwned;

export const UpdateTable = t.Partial(CreateTable);

export const GetTable = GetOwned;
