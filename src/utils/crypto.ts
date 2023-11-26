import { createHash } from "crypto";
import AppConfig from "~/constants/configs";

export function hashString(content: string, algorithm: string = "sha256"): string {
  return createHash(algorithm).update(content).digest("hex");
}

export function verifyString(content: string, hash: string, algorithm: string = "sha256"): boolean {
  return hashString(content, algorithm) === hash;
}

export function hashPassword(password: string): string {
  return hashString(password + AppConfig.PASSWORD_SECRET_KEY);
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Generate 6 number code
export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}