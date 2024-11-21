import { Kysely, sql } from "kysely";

const contentIndexCount = 9;

export async function up(db: Kysely<any>): Promise<void> {
  /* User and Authentication Tables */
  await db.schema
    .createTable("user")
    .modifyEnd(sql`STRICT`)
    // Base columns
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("createdAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`))
    .addColumn("updatedAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`))
    //
    .addColumn("groups", "text", (col) => col.defaultTo(JSON.stringify(["user"])).notNull())
    .addColumn("username", "text", (col) =>
      col
        .notNull()
        .unique()
        .modifyEnd(sql`COLLATE NOCASE`)
    )
    .addColumn("email", "text", (col) =>
      col
        .notNull()
        .unique()
        .modifyEnd(sql`COLLATE NOCASE`)
    )
    .addColumn("emailIsVerified", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("isOrganization", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("displayName", "text")
    .addColumn("iconUrl", "text")
    .execute();

  await db.schema
    .createTable("credential")
    .modifyEnd(sql`STRICT`)
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("userId", "text", (col) => col.notNull().references("user.id"))
    .addColumn("passwordHash", "text", (col) => col.notNull())
    .execute();
  await db.schema.createIndex("credentialUserIdIndex").on("credential").column("userId").execute();

  await db.schema
    .createTable("session")
    .modifyEnd(sql`STRICT`)
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("expiresAt", "integer", (col) => col.notNull())
    .addColumn("userId", "text", (col) => col.notNull().references("user.id"))
    .execute();

  /* Content Tables */
  await db.schema
    .createTable("ruleset")
    .modifyEnd(sql`STRICT`)
    // Base columns
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("createdAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`))
    .addColumn("updatedAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`))
    //
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("ownerUserId", "text", (col) => col.notNull().references("user.id"))
    .addColumn("visibility", "text", (col) => col.notNull().defaultTo("private"))
    .execute();

  await db.schema
    .createTable("displaySheet")
    .modifyEnd(sql`STRICT`)
    // Base columns
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("createdAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`))
    .addColumn("updatedAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`))
    //
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("ownerUserId", "text", (col) => col.notNull().references("user.id"))
    .addColumn("visibility", "text", (col) => col.notNull().defaultTo("private"))
    .addColumn("contentTypeId", "text", (col) => col.references("contentType.id"))
    .addColumn("xml", "text")
    .execute();

  await db.schema
    .createTable("contentType")
    .modifyEnd(sql`STRICT`)
    // Base columns
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("createdAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`))
    .addColumn("updatedAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`))
    //
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("ownerUserId", "text", (col) => col.notNull().references("user.id"))
    .addColumn("visibility", "text", (col) => col.notNull().defaultTo("private"))
    .addColumn("defaultDisplaySheetId", "text", (col) => col.references("displaySheet.id"))
    .addColumn("rulesetId", "text", (col) => col.references("ruleset.id"))
    .execute();

  let contentTb = db.schema
    .createTable("content")
    .modifyEnd(sql`STRICT`)
    // Base columns
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("createdAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`))
    .addColumn("updatedAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`))
    //
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("ownerUserId", "text", (col) => col.notNull().references("user.id"))
    .addColumn("visibility", "text", (col) => col.notNull().defaultTo("private"))
    .addColumn("isDynamic", "integer", (col) => col.notNull().defaultTo(1))
    .addColumn("displaySheetId", "text", (col) => col.references("displaySheet.id"))
    .addColumn("contentTypeId", "text", (col) => col.references("contentType.id"))
    .addColumn("rulesetId", "text", (col) => col.references("ruleset.id"))
    .addColumn("data", "text");
  for (let i = 1; i <= contentIndexCount; i++) {
    contentTb = contentTb.addColumn(`dataIndex${i}`, "text");
  }
  contentTb.execute();
  for (let i = 1; i <= contentIndexCount; i++) {
    await db.schema
      .createIndex(`contentDataIndex${i}Index`)
      .on("content")
      .column(`dataIndex${i}`)
      .execute();
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("user").execute();
  await db.schema.dropTable("credential").execute();
  await db.schema.dropTable("session").execute();
  await db.schema.dropIndex("ruleset").execute();
  await db.schema.dropIndex("displaySheet").execute();
  await db.schema.dropIndex("contentType").execute();
  await db.schema.dropIndex("content").execute();
}
