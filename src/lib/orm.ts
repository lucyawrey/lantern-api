import { MikroORM } from "@mikro-orm/sqlite";

export const orm = await MikroORM.init();
