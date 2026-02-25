import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "arkhe_session";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Falta JWT_SECRET en .env");
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: { userId: number; role: string; email: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySession(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as unknown as { userId: number; role: string; email: string; exp: number; iat: number };
}

export function sessionCookie(token: string) {
  // HttpOnly para seguridad básica. SameSite Lax para no romper.
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
}

export function readCookieFromRequest(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return m?.[1] || null;
}
