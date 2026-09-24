"use server"

import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { createSession, deleteSession, verifySession } from "@/lib/session"
import { getDashboardStats } from "@/lib/data/stats"

const loginSchema = z.object({
  username: z.string().min(1, "يرجى إدخال اسم المستخدم").trim(),
  password: z.string().min(1, "يرجى إدخال كلمة المرور"),
})

export interface LoginState {
  errors?: {
    username?: string[]
    password?: string[]
  }
  error?: string
}

export async function loginAction(
  _prevState: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const usernameInput = formData.get("username")?.toString() || ""
  const passwordInput = formData.get("password")?.toString() || ""

  const parsed = loginSchema.safeParse({
    username: usernameInput,
    password: passwordInput,
  })

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const { username, password } = parsed.data
  const adminUsername = process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || "admin"
  const adminHash = process.env.ADMIN_PASSWORD_HASH

  if (!adminHash) {
    return {
      error: "إعدادات الدخول للمسؤول غير مهيأة في بيئة الخادم (.env.local)",
    }
  }

  const usernameMatches =
    username.trim().toLowerCase() === adminUsername.trim().toLowerCase()
  const passwordMatches =
    usernameMatches && (await bcrypt.compare(password, adminHash))

  if (!usernameMatches || !passwordMatches) {
    return {
      error: "اسم المستخدم أو كلمة المرور غير صحيحة",
    }
  }

  await createSession(adminUsername)
  redirect("/admin")
}

export async function logoutAction() {
  await deleteSession()
  redirect("/admin/login")
}

export async function getDashboardStatsAction() {
  const session = await verifySession()
  if (!session) redirect("/admin/login")
  return getDashboardStats()
}
