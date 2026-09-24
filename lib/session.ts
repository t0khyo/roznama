import "server-only"
import { cookies } from "next/headers"
import {
  ADMIN_COOKIE_NAME,
  encryptSession,
  decryptSession,
  type AdminSessionPayload,
} from "./auth-token"

export { ADMIN_COOKIE_NAME, type AdminSessionPayload }

export async function createSession(username: string) {
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000)
  const session = await encryptSession({
    username,
    role: "admin",
    expiresAt: expiresAt.toISOString(),
  })
  const cookieStore = await cookies()

  cookieStore.set(ADMIN_COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}

export async function verifySession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  const session = await decryptSession(token)

  if (!session || session.role !== "admin") {
    return null
  }

  return session as unknown as AdminSessionPayload
}
