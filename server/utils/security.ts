import { randomBytes, createHash, createCipheriv, createDecipheriv } from "crypto";
import env from "../config/env.ts";

// ─── Constants ───────────────────────────────────────────────────────────────

const API_KEY_PREFIX = "sk_live_" as const; // Prefix to identify key type at a glance
const API_KEY_RANDOM_BYTES = 32;   // 256 bits of entropy


const HASH_ALGORITHM = "sha256" as const;
const ENCRYPT_ALGORITHM = "aes-256-gcm" as const;


// const ENCRYPTION_KEY_HEX = process.env.API_KEY_ENCRYPTION_SECRET; // 64-char hex → 32-byte key
const ENCRYPTION_KEY_HEX:string | undefined  = env.MASTER_ENCRYPTION_KEY; // 64-char hex → 32-byte key






// ─── Branded / structural types ───────────────────────────────────────────────

/**
 * A raw API key string, always prefixed with `sk_live_`.
 * Purely a compile-time label — doesn't validate at runtime.
 */
export type APIKey = `${typeof API_KEY_PREFIX}${string}`;

/** SHA-256 hex digest of an API key — safe to store/index in the DB. */
export type APIKeyHash = string;

/** Colon-delimited `iv:authTag:ciphertext`, all hex-encoded. */
export type EncryptedAPIKey = `${string}:${string}:${string}`;

interface EncryptedParts {
    iv: Buffer;
    authTag: Buffer;
    ciphertext: Buffer;
}


// ─── Helpers ─────────────────────────────────────────────────────────────────

const getEncryptionKey = (): Buffer => {
  if (!ENCRYPTION_KEY_HEX || ENCRYPTION_KEY_HEX.length !== 64) {
    throw new Error(
      "API_KEY_ENCRYPTION_SECRET env var must be a 64-character hex string (32 bytes)"
    );
  }
  return Buffer.from(ENCRYPTION_KEY_HEX, "hex");
}

const isNonEmptyString = (value: unknown): value is string => typeof value === "string" && value.length > 0;



const parseEncryptedFormat = (encrypted: EncryptedAPIKey): EncryptedParts => {
  const parts = encrypted.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted format — expected iv:authTag:ciphertext");
  }

  const [ivHex, authTagHex, ciphertextHex] = parts as [string, string, string];

  return {
    iv: Buffer.from(ivHex, "hex"),
    authTag: Buffer.from(authTagHex, "hex"),
    ciphertext: Buffer.from(ciphertextHex, "hex"),
  };
};


// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Generates a cryptographically secure API key.
 *
 * Format: sk_live_<base64url(32 random bytes)>
 * Example: sk_live_3Xk9mN2pQr...
 *
 * Show this to the user ONCE. Store only the hash in your DB.
 */
export const createAPIKey = async (): Promise<string> => {
  const randomPart = randomBytes(API_KEY_RANDOM_BYTES).toString("base64url");
  return `${API_KEY_PREFIX}${randomPart}`;
};





/**
 * Deterministically hashes an API key for safe database storage.
 *
 * Use case: fast lookup — index this column in your DB.
 *   - Store this, NOT the raw key.
 *   - Recompute on each incoming request to verify the caller.
 *
 * Algorithm: SHA-256 (non-reversible, constant-time comparison recommended)
 */
export const hashAPIKey = async (apiKey: string): Promise<string> => {
//   if (!apiKey || typeof apiKey !== "string") {
//     throw new Error("apiKey must be a non-empty string");
//   }


    if (!isNonEmptyString(apiKey)) {
        throw new Error("apiKey must be a non-empty string");
    }

  return createHash(HASH_ALGORITHM).update(apiKey, "utf8").digest("hex");
};

/**
 * Encrypts an API key using AES-256-GCM (authenticated encryption).
 *
 * Use case: storing a key so it can be *recovered* later (e.g. to show
 * the user their key again, or to pass it to a third-party service).
 * If you don't need recovery, prefer hashAPIKey instead.
 *
 * Output format (colon-delimited, all hex): iv:authTag:ciphertext
 *
 * Requires env var: API_KEY_ENCRYPTION_SECRET — 64 hex chars (32 bytes).
 * Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */
export const encryptAPIKey = async (apiKey: string): Promise<string> => {
//   if (!apiKey || typeof apiKey !== "string") {
//     throw new Error("apiKey must be a non-empty string");
    //   }
  if (!isNonEmptyString(apiKey)) {
    throw new Error("apiKey must be a non-empty string");
  }

  const key = getEncryptionKey();
  const iv = randomBytes(12); // 96-bit IV recommended for GCM

  const cipher = createCipheriv(ENCRYPT_ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(apiKey, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag(); // GCM authentication tag (integrity check)

  // Encode as a single storable string
  return [iv.toString("hex"), authTag.toString("hex"), encrypted.toString("hex")].join(":");
};

/**
 * Decrypts a value produced by encryptAPIKey.
 * Throws if the ciphertext has been tampered with (GCM integrity check).
 */
export const decryptAPIKey = async (encrypted: string): Promise<string> => {
  if (!isNonEmptyString(encrypted)) {
    throw new Error("encrypted must be a non-empty string");
  }

//   const parts = encrypted.split(":");
//   if (parts.length !== 3) {
//     throw new Error("Invalid encrypted format — expected iv:authTag:ciphertext");
//   }

  const [ivHex, authTagHex, ciphertextHex] = parseEncryptedFormat(encrypted);;
  const key = getEncryptionKey();

  const decipher = createDecipheriv(ENCRYPT_ALGORITHM, key, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(ciphertextHex, "hex")),
    decipher.final(), // Throws here if tampered
  ]);

  return decrypted.toString("utf8");
};