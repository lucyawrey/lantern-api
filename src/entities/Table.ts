import { Entity } from "@mikro-orm/core";
import { NewOwned, PushOwned, GetOwned, Owned } from "entities/Owned";

@Entity()
export class Table extends Owned {}

export { NewOwned as NewTable, PushOwned as PushTable, GetOwned as GetTable };
