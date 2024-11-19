import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user")
    // Base columns
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("createdAt", "integer", (col) => col.notNull())
    .addColumn("updatedAt", "integer", (col) => col.notNull())
    //
    .addColumn("groups", "text", (col) =>
      col.defaultTo("[]").notNull(),
    )
    .addColumn("username", "text", (col) => col.notNull().unique())
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("isOrganization", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("displayName", "text")
    .addColumn("iconUrl", "text")
    .execute()

    await db.schema
    .createTable("credential")
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("userId", "text", (col) => col.notNull().references("user.id"))
    .addColumn("passwordHash", "text", (col) => col.notNull())
    .execute()

    await db.schema
    .createTable("session")
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("expiresAt", "integer", (col) => col.notNull())
    .addColumn("userId", "text", (col) => col.notNull().references("user.id"))
    .execute()

    //Insert example data
    const now = Date.now()
    const user = {
      // Randomly generated v4UUID
      id: "9a3d6ecd-4d7a-4489-a03e-f1c1326c70c3",
      createdAt: now,
      updatedAt: now,
      username: "lanterndev",
      email: "dev@lanterntt.com",
      displayName: "Lantern Developer",
      iconUrl: "https://lanterntt.com/images/cute-anime-girl-pfp.png",
    };
    await db.insertInto("user").values(user).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("user").execute();
  await db.schema.dropTable("credential").execute();
  await db.schema.dropTable("session").execute();
}
