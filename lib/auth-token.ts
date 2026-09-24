import { SignJWT, jwtVerify } from "jose"

const secretKey =
  process.env.SESSION_SECRET ||
  "roznama_super_secret_admin_jwt_key_2026_snap_mutair"
const encodedKey = new TextEncoder().encode(secretKey)

export const ADMIN_COOKIE_NAME = "admin_session"

export interface AdminSessionPayload {
  username: string
  email?: string
  role: "admin"
  expiresAt: string
}

export async function encryptSession(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(encodedKey)
}

export async function decryptSession(token?: string) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    })
    return payload
  } catch {
    return null
  }
}
