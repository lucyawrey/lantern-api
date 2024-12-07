import { encodeHexLowerCase } from "@oslojs/encoding";
import { db } from "lib/database";
import { Err, Ok } from "lib/result";
import type { Session } from "types/database";
import { sha256 } from "@oslojs/crypto/sha2";
import { generateSessionToken } from "lib/authentication";
import type { Insertable } from "kysely";
import { now, toUser, User } from "types/models";

export abstract class SessionService {
  static async createSession(userId: string): Promise<Result<{ token: string; session: Session }>> {
    const token = generateSessionToken();
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: Insertable<Session> = {
      id: sessionId,
      userId,
      expiresAt: now() + 60 * 60 * 24 * 30,
    };
    const row = await db.insertInto("session").values(session).returningAll().executeTakeFirst();
    if (row) {
      return Ok({ token, session: row as Session });
    }
    return Err("Failed to create session.");
  }

  static async validateSessionToken(
    token: string
  ): Promise<Result<{ session: Session; user: User }>> {
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
    if (now() >= session.expiresAt) {
      SessionService.invalidateSession(session.id);
      return Err("Not authenticated. Session expired.");
    }
    if (now() >= session.expiresAt - 60 * 60 * 24 * 15) {
      session.expiresAt = now() + 60 * 60 * 24 * 30;
      db.updateTable("session").where("id", "=", session.id).set(session).execute();
    }
    return Ok({ session, user: toUser(row) });
  }

  static async invalidateSession(sessionId: string): Promise<Result<string>> {
    const result = await db
      .deleteFrom("session")
      .where("id", "=", sessionId)
      .returning("id")
      .executeTakeFirst();
    if (result?.id) {
      return Ok(result.id);
    }
    return Err("Could not invalidate session.");
  }

  static async invalidateAllUserSession(userId: string): Promise<Result<string>> {
    const result = await db
      .deleteFrom("session")
      .where("userId", "=", userId)
      .returning("id")
      .executeTakeFirst();
    if (result?.id) {
      return Ok(result.id);
    }
    return Err("Could not invalidate user sessions.");
  }
}
