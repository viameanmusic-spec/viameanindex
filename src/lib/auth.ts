import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = () =>
  new TextEncoder().encode(process.env.AUTH_SECRET || "viamean-dev-secret-degistir");

export const COOKIE = "viamean_admin";

export async function createSession(): Promise<string> {
  return await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifyToken(token?: string): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}

export async function isAuthed(): Promise<boolean> {
  const token = cookies().get(COOKIE)?.value;
  return verifyToken(token);
}
