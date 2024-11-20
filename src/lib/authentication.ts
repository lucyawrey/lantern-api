import { encodeBase32LowerCaseNoPadding, encodeBase32UpperCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { sha1 } from "@oslojs/crypto/sha1";
import { db } from "lib/database";
import { NewSession, SelectUser, Session } from "types/database"
import { Err, Ok } from "utils/result";
import { hash, verify } from "@node-rs/argon2";

/* Sessions */
export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(token: string, userId: string): Promise<Result<Session>> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: NewSession = {
		id: sessionId,
		userId,
		expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30
	};
	const row = await db.insertInto("session").values(session).returningAll().executeTakeFirst();
	if (row) {
        return Ok(row as Session);
    }
    return Err("Failed to create session.");
}

type ValidationResult = Result<{ session: Session, user: SelectUser }>;

export async function validateSessionToken(token: string): Promise<ValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const row = await db.selectFrom("session").where("id", "=", sessionId).innerJoin("user", "user.id", "session.userId").selectAll().executeTakeFirst();
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
        db.updateTable("session").where("id", "=", session.id).set(session).execute()
	}
	return Ok({session, user});
}

export async function invalidateSession(sessionId: string): Promise<void> {
	db.deleteFrom("session").where("id", "=", sessionId).execute();
}

/* Passwords */
export async function hashPassword(password: string): Promise<string> {
	return await hash(password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
}

export async function verifyPasswordHash(hash: string, password: string): Promise<boolean> {
	return await verify(hash, password);
}

export async function verifyPasswordStrength(password: string): Promise<Result> {
	if (password.length < 8 || password.length > 255) {
		return Err("Password is not between 8 and 256 characters.");
	}
	const hash = encodeHexLowerCase(sha1(new TextEncoder().encode(password)));
	const hashPrefix = hash.slice(0, 5);
	const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`);
	const data = await response.text();
	const items = data.split("\n");
	for (const item of items) {
		const hashSuffix = item.slice(0, 35).toLowerCase();
		if (hash === hashPrefix + hashSuffix) {
			return Err("This password has potentially been exposed in a security breech.");
		}
	}
	return Ok();
}

/* One Time Password */
export function generateRandomOTP(): string {
	const bytes = new Uint8Array(5);
	crypto.getRandomValues(bytes);
	const code = encodeBase32UpperCaseNoPadding(bytes);
	return code;
}
