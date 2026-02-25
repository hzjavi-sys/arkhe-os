import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();
const ISSUER = "arkhe-os";
const AUDIENCE = "arkhe-os-users";

function secretKey() {
  const secret = process.env.ARKHE_JWT_SECRET || "";
  if (!secret) throw new Error("Falta ARKHE_JWT_SECRET en .env");
  return encoder.encode(secret);
}

export type JwtPayload = {
  sub: string;
  username: string;
  role: string;
};

export async function signJwt(payload: JwtPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return {
      sub: String(payload.sub || ""),
      username: String(payload.username || ""),
      role: String(payload.role || ""),
    };
  } catch {
    return null;
  }
}
