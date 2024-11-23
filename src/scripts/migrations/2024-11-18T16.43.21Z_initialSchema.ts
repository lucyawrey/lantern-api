import { Kysely, sql } from "kysely";
import { contentIndexCount } from "lib/env";

export async function up(db: Kysely<any>): Promise<void> {
  /* User and Authentication Tables */
  await db.schema
    .createTable("user")
    .modifyEnd(sql`STRICT`)
    // Base columns
    .addColumn("id", "text", (col) => col.notNull().primaryKey()) // uuid
    .addColumn("createdAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`)) // unix timestamp
    .addColumn("updatedAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`)) // unix timestamp
    //
    .addColumn("groups", "text", (col) => col.defaultTo(JSON.stringify(["user"])).notNull()) // json (enum Group[])
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
    .addColumn("emailIsVerified", "integer", (col) => col.notNull().defaultTo(0)) // boolean
    .addColumn("isOrganization", "integer", (col) => col.notNull().defaultTo(0)) // boolean
    .addColumn("displayName", "text")
    .addColumn("iconUrl", "text")
    .execute();

  await db.schema
    .createTable("credential")
    .modifyEnd(sql`STRICT`)
    .addColumn("id", "text", (col) => col.notNull().primaryKey()) // uuid
    .addColumn("userId", "text", (col) => col.notNull().references("user.id")) // uuid
    .addColumn("passwordHash", "text", (col) => col.notNull())
    .execute();
  await db.schema.createIndex("credentialUserIdIndex").on("credential").column("userId").execute();

  await db.schema
    .createTable("session")
    .modifyEnd(sql`STRICT`)
    .addColumn("id", "text", (col) => col.notNull().primaryKey()) // uuid
    .addColumn("expiresAt", "integer", (col) => col.notNull()) // unix timestamp
    .addColumn("userId", "text", (col) => col.notNull().references("user.id")) // uuid
    .execute();

  /* Content Tables */
  await db.schema
    .createTable("ruleset")
    .modifyEnd(sql`STRICT`)
    // Base columns
    .addColumn("id", "text", (col) => col.notNull().primaryKey()) // uuid
    .addColumn("createdAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`)) // unix timestamp
    .addColumn("updatedAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`)) // unix timestamp
    //
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("ownerUserId", "text", (col) => col.notNull().references("user.id")) // uuid
    .addColumn("visibility", "text", (col) => col.notNull().defaultTo("private")) // (enum Visibility)
    .execute();
  await db.schema.createIndex("rulesetNameIndex").on("ruleset").column("name").execute();

  await db.schema
    .createTable("contentSheet")
    .modifyEnd(sql`STRICT`)
    // Base columns
    .addColumn("id", "text", (col) => col.notNull().primaryKey()) // uuid
    .addColumn("createdAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`)) // unix timestamp
    .addColumn("updatedAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`)) // unix timestamp
    //
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("ownerUserId", "text", (col) => col.notNull().references("user.id")) // uuid
    .addColumn("visibility", "text", (col) => col.notNull().defaultTo("private")) // (enum Visibility)
    .addColumn("contentTypeId", "text", (col) => col.references("contentType.id")) // uuid
    .addColumn("html", "text")
    .addColumn("css", "text")
    .execute();
  await db.schema.createIndex("contentSheetNameIndex").on("contentSheet").column("name").execute();

  await db.schema
    .createTable("contentType")
    .modifyEnd(sql`STRICT`)
    // Base columns
    .addColumn("id", "text", (col) => col.notNull().primaryKey()) // uuid
    .addColumn("createdAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`)) // unix timestamp
    .addColumn("updatedAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`)) // unix timestamp
    //
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("ownerUserId", "text", (col) => col.notNull().references("user.id")) // uuid
    .addColumn("visibility", "text", (col) => col.notNull().defaultTo("private")) // (enum Visibility)
    .addColumn("defaultDisplaySheetId", "text", (col) => col.references("displaySheet.id")) // uuid
    .addColumn("rulesetId", "text", (col) => col.references("ruleset.id")) // uuid
    .execute();
  await db.schema.createIndex("contentTypeNameIndex").on("contentType").column("name").execute();

  let contentTb = db.schema
    .createTable("content")
    .modifyEnd(sql`STRICT`)
    // Base columns
    .addColumn("id", "text", (col) => col.notNull().primaryKey()) // uuid
    .addColumn("createdAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`)) // unix timestamp
    .addColumn("updatedAt", "integer", (col) => col.notNull().defaultTo(sql`(unixepoch())`)) // unix timestamp
    //
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("ownerUserId", "text", (col) => col.notNull().references("user.id")) // uuid
    .addColumn("visibility", "text", (col) => col.notNull().defaultTo("private")) // (enum Visibility)
    .addColumn("isDynamic", "integer", (col) => col.notNull().defaultTo(1)) // boolean
    .addColumn("displaySheetId", "text", (col) => col.references("displaySheet.id")) // uuid
    .addColumn("contentTypeId", "text", (col) => col.references("contentType.id")) // uuid
    .addColumn("rulesetId", "text", (col) => col.references("ruleset.id")) // uuid
    .addColumn("data", "text");
  for (let i = 1; i <= contentIndexCount; i++) {
    contentTb = contentTb.addColumn(`dataIndexKey${i}`, "text");
    contentTb = contentTb.addColumn(`dataIndex${i}`, "text");
  }
  contentTb.execute();
  await db.schema.createIndex("contentNameIndex").on("content").column("name").execute();
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
