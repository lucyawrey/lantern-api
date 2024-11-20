import { hashPassword, verifyPasswordStrength } from "lib/authentication";
import { Err, Ok } from "lib/result";
import { db } from "lib/database";
import { NewUser, NewCredential, SelectUser } from "types/database";

export function verifyUsernameInput(username: string): boolean {
	return username.length > 2 && username.length < 32 && username.trim() === username;
}

export function verifyEmailInput(email: string): boolean {
	return /^.+@.+\..+$/.test(email) && email.length < 256;
}

export async function checkEmailAvailability(email: string): Promise<Result> {
	const row = await db.selectFrom("user").where("email", "=", email).select(db.fn.countAll().as("count")).executeTakeFirst();
	if (!row) {
		return Err("Failed to get email count from database.");
	}
	if (row.count != 0) {
		return Err("Email is already taken.");
	}
	return Ok();
}

export async function createUser(
	username: string, email: string, password: string,
	isOrganization: boolean = false, groups?: string[],
	displayName?: string, iconUrl?: string
): Promise<Result<SelectUser>> {
	if (!verifyEmailInput(email)) {
		return Err("Invalid email.");
	}
	if (!verifyUsernameInput(email)) {
		return Err("Invalid username.");
	}
	const strongPassword = await verifyPasswordStrength(password);
    if (!strongPassword.ok) {
        return strongPassword;
    }
	const emailAvailable = await checkEmailAvailability(email);
	if (!emailAvailable.ok) {
		return emailAvailable;
	}
	
    const passwordHash = await hashPassword(password);
    const user: NewUser = {
        id: crypto.randomUUID(),
        username,
        email,
		groups: (groups) ? JSON.stringify(groups) : undefined,
		isOrganization: (isOrganization) ? 1 : 0,
        displayName: displayName,
        iconUrl: iconUrl,
    };
	const credential: NewCredential = {
		id: crypto.randomUUID(),
		userId: user.id,
		passwordHash,
    };

	const userRow = await db.insertInto("user").values(user).returningAll().executeTakeFirst();
	if (!(userRow && userRow.id)) {
		return Err("Database error. Could not create user.");
	}
	const credentialRow = await db.insertInto("credential").values(credential).returning("id").executeTakeFirst();
	if (!(credentialRow && credentialRow.id)) {
		await db.deleteFrom("user").where("id", "=", user.id).execute();
		return Err("Database error. Could not create user credential.");
	}

	return Ok(userRow);
}
