import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
  encodeBase64urlNoPadding,
  encodeBase32UpperCaseNoPadding,
} from "@oslojs/encoding";
import { hash, verify } from "@node-rs/argon2";
import { Cookie } from "elysia";
import { sha256 } from "@oslojs/crypto/sha2";
import { AccessType, Role } from "types/enums";
import { User } from "entities/User";

/* Ids */
export function generateId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const id = encodeBase64urlNoPadding(bytes);
  return id;
}

/* Recovery Codes */
export async function generateRecoveryToken(): Promise<
  [token: string, hash: string]
> {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32UpperCaseNoPadding(bytes);
  let hash = await hashToken(token);
  return [token, hash];
}

/* Sessions */
export function hashToken(token: string): string {
  const hash = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  return hash;
}

export async function generateSessionToken(): Promise<
  [token: string, hash: string]
> {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  let hash = await hashToken(token);
  return [token, hash];
}

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

export function hasRole(user?: User, ...roles: Role[]): boolean {
  if (!user) return false;
  return roles.some((role) => user.roles.includes(role));
}

export function hasAccess(
  _mode: "read" | "write",
  owningUser: User,
  hasAccess: AccessType,
  accessingUser?: User
): boolean {
  // TODO implement access checks for other AccessTypes (friends, tables, members)
  // TODO implement individual shares properly
  // TODO implement read/write modes properly
  if (hasAccess === "public") {
    return true;
  }
  if (owningUser.id === accessingUser?.id) {
    return true;
  }
  if (hasRole(accessingUser, "admin")) {
    return true;
  }
  return false;
}
