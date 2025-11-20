import { Entity } from "@mikro-orm/core";
import { PushOwned, GetOwned, Owned } from "entities/Owned";

@Entity()
export class Table extends Owned {}

export { PushOwned as PushTable, GetOwned as GetTable };
