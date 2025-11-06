import { MikroORM } from "@mikro-orm/sqlite";

export const db = await MikroORM.init();

export type Em = typeof db.em;
