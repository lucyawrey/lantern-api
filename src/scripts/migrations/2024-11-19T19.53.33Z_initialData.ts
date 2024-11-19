import { Kysely } from "kysely";
import { defaultUserId } from "utils/env";

export async function up(db: Kysely<any>): Promise<void> {
    //Insert example data
    if (defaultUserId) {
      const user = {
        id: defaultUserId,
        username: "lantern",
        email: "dev@lanterntt.com",
        isOrganization: 1,
        groups: JSON.stringify(["admin"]),
        displayName: "Lantern Tabletop",
        iconUrl: "https://lanterntt.com/images/cute-anime-girl-pfp.png",
      };
      await db.insertInto("user").values(user).execute();
    }
}

export async function down(db: Kysely<any>): Promise<void> {
  if (defaultUserId) {
    await db.deleteFrom("user").where("id", "=", defaultUserId).execute();
  }
}
