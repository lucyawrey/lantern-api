import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user").modifyEnd(sql`STRICT`)
    // Base columns
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("createdAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`))
    .addColumn("updatedAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`))
    //
    .addColumn("groups", "text", (col) => col.defaultTo(JSON.stringify([])).notNull())
    .addColumn("username", "text", (col) => col.notNull().unique())
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("isOrganization", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("displayName", "text")
    .addColumn("iconUrl", "text")
    .execute()

    await db.schema
    .createTable("credential").modifyEnd(sql`STRICT`)
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("userId", "text", (col) => col.notNull().references("user.id"))
    .addColumn("passwordHash", "text", (col) => col.notNull())
    .execute()

    await db.schema
    .createTable("session").modifyEnd(sql`STRICT`)
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("expiresAt", "integer", (col) => col.notNull())
    .addColumn("userId", "text", (col) => col.notNull().references("user.id"))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("user").execute();
  await db.schema.dropTable("credential").execute();
  await db.schema.dropTable("session").execute();
}
