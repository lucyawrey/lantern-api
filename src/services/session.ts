import { encodeHexLowerCase } from "@oslojs/encoding";
import { db } from "lib/database";
import { Err, Ok } from "lib/result";
import type { Session, User } from "types/database";
import { sha256 } from "@oslojs/crypto/sha2";
import { generateSessionToken } from "lib/authentication";
import type { Insertable, Selectable } from "kysely";

export abstract class SessionService {
  static async createSession(userId: string): Promise<Result<[string, Session]>> {
    const token = generateSessionToken();
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: Insertable<Session> = {
      id: sessionId,
      userId,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
    };
    const row = await db.insertInto("session").values(session).returningAll().executeTakeFirst();
    if (row) {
      return Ok([token, row as Session]);
    }
    return Err("Failed to create session.");
  }

  static async validateSessionToken(
    token: string
  ): Promise<Result<{ session: Session; user: Selectable<User> }>> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const row = await db
      .selectFrom("session")
      .where("session.id", "=", sessionId)
      .innerJoin("user", "user.id", "session.userId")
      .selectAll()
      .executeTakeFirst();
    if (!row) {
      return Err("Not authenticated. Invalid session token.");
    }
    const session: Session = {
      id: sessionId,
      userId: row.userId,
      expiresAt: row.expiresAt,
    };
    const user: Selectable<User> = {
      id: row.userId,
      createdAt: row.createdAt,
      displayName: row.displayName,
      email: row.email,
      groups: row.groups,
      iconUrl: row.iconUrl,
      isOrganization: row.isOrganization,
      updatedAt: row.updatedAt,
      username: row.username,
      emailIsVerified: row.emailIsVerified,
    };
    if (Date.now() >= session.expiresAt) {
      SessionService.invalidateSession(session.id);
      return Err("Not authenticated. Session expired.");
    }
    if (Date.now() >= session.expiresAt - 1000 * 60 * 60 * 24 * 15) {
      session.expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30;
      db.updateTable("session").where("id", "=", session.id).set(session).execute();
    }
    return Ok({ session, user });
  }

  static async invalidateSession(sessionId: string): Promise<void> {
    db.deleteFrom("session").where("id", "=", sessionId).execute();
  }

  static async invalidateAllUserSession(userId: string): Promise<void> {
    db.deleteFrom("session").where("userId", "=", userId).execute();
  }
}
