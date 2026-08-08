// Uses Web Crypto (globalThis.crypto.subtle) instead of Node's `crypto`
// module so this also works in the Edge runtime middleware uses.

export const SESSION_COOKIE = "jk_session";
const SESSION_VALUE = "authenticated";

function getSecret() {
  const secret = process.env.SESSION_SECRET || process.env.ACCESS_PASSWORD;
  if (!secret) {
    throw new Error("SESSION_SECRET or ACCESS_PASSWORD env var must be set");
  }
  return secret;
}

async function hmacHex(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(): Promise<string> {
  const sig = await hmacHex(SESSION_VALUE);
  return `${SESSION_VALUE}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [value, sig] = token.split(".");
  if (value !== SESSION_VALUE || !sig) return false;
  const expected = await hmacHex(SESSION_VALUE);
  if (expected.length !== sig.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  return mismatch === 0;
}
