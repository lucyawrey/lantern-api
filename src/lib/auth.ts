import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { hash, verify } from "@node-rs/argon2";
import { Cookie } from "elysia";
import { sha256 } from "@oslojs/crypto/sha2";
import { Role } from "types/enums";
import { User } from "entities/User";
import { Owned } from "entities/Owned";

/* Ids */
export function generateId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const id = encodeBase32LowerCaseNoPadding(bytes);
  return id;
}

/* Tokens */
export async function generateAuthToken(): Promise<
  [token: string, hash: string]
> {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  let hash = await hashToken(token);
  return [token, hash];
}

export function hashToken(token: string): string {
  const hash = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  return hash;
}

/* Sessions */
export function setSessionCookie(
  sessionTokenCookie: Cookie<unknown>,
  token: string,
  expires: Date
) {
  sessionTokenCookie.set({
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires,
  });
}

/* Passwords */
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
}

export async function verifyPasswordHash(
  hash: string,
  password: string
): Promise<boolean> {
  return await verify(hash, password);
}

export function verifyPasswordStrength(password: string): boolean {
  if (
    password.length < 8 ||
    password.length > 255 ||
    password.includes("1234") ||
    password.includes("password")
  ) {
    return false;
  }
  return true;
}

/* Input Verification */
export function verifyNameInput(name: string): boolean {
  return name.length > 2 && name.length < 32 && /^[a-zA-Z0-9_]+$/.test(name);
}

export function hasRole(
  user?: PartialExcept<User, "roles">,
  ...roles: Role[]
): boolean {
  if (!user) return false;
  return roles.some((role) => user.roles.includes(role));
}

export function hasAccess(
  mode: "read" | "write",
  owningUser: PartialExcept<User, "id">,
  entity:
    | PartialExcept<Owned, "hasReadAccess" | "hasWriteAccess">
    | PartialExcept<User, "hasReadAccess" | "hasWriteAccess">,
  accessingUser?: PartialExcept<User, "roles">
): boolean {
  // TODO implement access checks for other AccessTypes (friends, tables, members)
  // TODO implement individual shares properly
  if (hasRole(accessingUser, "admin")) {
    return true;
  }
  if (accessingUser && owningUser.id === accessingUser.id) {
    return true;
  }
  if (mode === "write") {
    if (entity.hasWriteAccess === "public") {
      return true;
    }
  }
  if (mode === "read") {
    if (entity.hasReadAccess === "public") {
      return true;
    }
  }
  return false;
}
