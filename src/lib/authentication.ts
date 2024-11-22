import {
  encodeBase32LowerCaseNoPadding,
  encodeBase32UpperCaseNoPadding,
  encodeHexLowerCase,
  decodeBase64,
} from "@oslojs/encoding";
import { sha1 } from "@oslojs/crypto/sha1";
import { Err, Ok } from "lib/result";
import { hash, verify } from "@node-rs/argon2";
import { Cookie } from "elysia";
import { encryptionKey } from "lib/env";

/* Encryption */
const key = decodeBase64(encryptionKey);

/* Sessions */
export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

/* Session Cookie */
export function setSessionCookie(
  sessionTokenCookie: Cookie<string | undefined>,
  token: string,
  expires: Date
) {
  sessionTokenCookie.set({ value: token, httpOnly: true, sameSite: "lax", path: "/", expires });
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

export async function verifyPasswordHash(hash: string, password: string): Promise<boolean> {
  return await verify(hash, password);
}

export async function verifyPasswordStrength(password: string): Promise<Result> {
  if (password.length < 8 || password.length > 255) {
    return Err("Invalid password. Password is not between 8 and 256 characters.");
  }
  const hash = encodeHexLowerCase(sha1(new TextEncoder().encode(password)));
  const hashPrefix = hash.slice(0, 5);
  const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`);
  const data = await response.text();
  const items = data.split("\n");
  for (const item of items) {
    const hashSuffix = item.slice(0, 35).toLowerCase();
    if (hash === hashPrefix + hashSuffix) {
      return Err("Invalid password. Password has potentially been exposed in a security breech.");
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

/* Input Verification */
export function verifyUsernameInput(username: string): boolean {
  return username.length > 2 && username.length < 32 && /^[a-zA-Z0-9_]+$/.test(username);
}

export function verifyEmailInput(email: string): boolean {
  return email.length < 256 && /^.+@.+\..+$/.test(email);
}
