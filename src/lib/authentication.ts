import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { database } from "lib/database";
import { NewSession, SelectUser, Session } from "types/database"
import { Err, Ok } from "utils/result";

export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(token: string, userId: string): Promise<Result<Session>> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const now = Date.now()
	const session: NewSession = {
		id: sessionId,
		userId,
		expiresAt: now + 1000 * 60 * 60 * 24 * 30
	};
	const res = await database.insertInto("session").values(session).returningAll().executeTakeFirst();
	if (res) {
        return Ok(res as Session);
    }
    return Err("Failed to create session.");
}

type ValidationResult = Result<{ session: Session, user: SelectUser }>;

export async function validateSessionToken(token: string): Promise<ValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const row = await database.selectFrom("session").where("id", "=", sessionId).innerJoin("user", "user.id", "session.userId").selectAll().executeTakeFirst();
	if (!row) {
		return Err("Not authenticated. Invalid session token.");
	}
	const session: Session = {
		id: row.id,
		userId: row.userId,
		expiresAt: row.expiresAt
	};
	const user: SelectUser = {
        id: row.userId,
        createdAt: row.createdAt,
        displayName: row.displayName,
        email: row.email,
        groups: row.groups,
        iconUrl: row.iconUrl,
        isOrganization: row.isOrganization,
        updatedAt: row.updatedAt,
        username: row.username,
    };
	if (Date.now() >= session.expiresAt) {
		invalidateSession(session.id);
		return Err("Not authenticated. Session expired.");
	}
	if (Date.now() >= session.expiresAt - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30;
        database.updateTable("session").where("id", "=", session.id).set(session).execute()
	}
	return Ok({session, user});
}

export async function invalidateSession(sessionId: string): Promise<void> {
	database.deleteFrom("session").where("id", "=", sessionId).execute();
}
