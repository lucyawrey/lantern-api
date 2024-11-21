import { Kysely } from "kysely";
import { hashPassword } from "lib/authentication";

const defaultUserId = process.env.DEFAULT_USER_ID;
const defaultUserPassword = process.env.DEFAULT_USER_PASSWORD;

export async function up(db: Kysely<any>): Promise<void> {
  if (defaultUserId && defaultUserPassword) {
    const user = {
      id: defaultUserId,
      username: "lantern",
      email: "dev@lanterntt.com",
      isOrganization: 1,
      groups: JSON.stringify(["user", "admin"]),
      displayName: "Lantern Tabletop",
      iconUrl: "https://lanterntt.com/images/cute-anime-girl-pfp.png",
    };
    await db.insertInto("user").values(user).execute();
    const passwordHash = await hashPassword(defaultUserPassword);
    const credential = {
      id: crypto.randomUUID(),
      userId: defaultUserId,
      passwordHash,
    };
    await db.insertInto("credential").values(credential).execute();
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  if (defaultUserId && defaultUserPassword) {
    await db.deleteFrom("user").where("id", "=", defaultUserId).execute();
    await db.deleteFrom("credential").where("userId", "=", defaultUserId).execute();
  }
}
