import { initialize, createClient } from "opencider-sdk";

/**
 * Call this directly from a click handler, with nothing awaited before it:
 * initialize() opens the SSO popup, and browsers block popups that aren't tied to a click.
 */
export async function signInWithOpenCider(): Promise<string> {
  const key = import.meta.env.VITE_OPENCIDER_SERVICE_KEY;
  if (!key) {
    throw new Error("VITE_OPENCIDER_SERVICE_KEY is not set. See .env.example.");
  }

  const client = await initialize(key);

  const token = client.token;
  if (!token) {
    throw new Error("initialize() returned a client without a token.");
  }
  return token;
}

/** Resumes a session from a stored service user token. */
export async function getClient(token: string) {
  return await createClient(token);
}
