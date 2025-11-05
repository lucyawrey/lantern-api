import { Entity } from "@mikro-orm/core";
import { Owned } from "./Owned";

@Entity()
export class Table extends Owned {}
