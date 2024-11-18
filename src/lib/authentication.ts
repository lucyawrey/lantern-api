import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { database } from "lib/database";
import { User, NewSession, Session } from "types/database"

export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(token: string, userId: string): Promise<Session | undefined> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const now = Date.now()
	const session: NewSession = {
		id: sessionId,
        createdAt: now,
		userId,
		expiresAt: now + 1000 * 60 * 60 * 24 * 30
	};
	const res = await database.insertInto("session").values(session).returningAll().executeTakeFirst() as Session | undefined;
	return res;
}


export function validateSessionToken(token: string): Result<{session: Session, user: User}> {

}

export function invalidateSession(sessionId: string): void {
	// TODO
}
