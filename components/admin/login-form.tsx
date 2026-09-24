"use client"

import { useActionState } from "react"
import Link from "next/link"
import { LockIcon, UserIcon, ArrowRightIcon, Loader2Icon } from "lucide-react"
import { loginAction, type LoginState } from "@/app/admin/actions"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<LoginState | undefined, FormData>(
    loginAction,
    undefined
  )

  return (
    <div className="w-full max-w-md mx-auto" dir="rtl">
      <Card className="border border-[#E5DDD0] shadow-sm bg-[#FCFEFB] overflow-hidden">
        {/* Top colored accent line */}
        <div className="h-1.5 w-full bg-[#8B1A1A]" />

        <CardHeader className="space-y-3 text-center pb-2 pt-6">
          {/* Logo with matching navbar fill and border styling */}
          <div className="flex justify-center">
            <div
              className="p-2 rounded-full border border-[#E5DDD0]/80 shadow-xs inline-flex items-center justify-center"
              style={{
                background: "rgba(250,248,243,0.92)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="size-16 rounded-full bg-[#FCFEFB] overflow-hidden flex items-center justify-center border border-[#E5DDD0]/80 shadow-xs">
                <img
                  src="/logo.png"
                  alt="سناب مطير"
                  className="size-full object-contain p-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <CardTitle
              className="text-2xl font-bold text-[#1A1714]"
              style={{ fontFamily: "'ThmanyahSerifDisplay', serif" }}
            >
              تسجيل دخول لوحة التحكم
            </CardTitle>
            <CardDescription className="text-sm text-[#7D6E63] font-cairo">
              أدخل بيانات حساب الإدارة للمتابعة
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800 font-cairo flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-red-600 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="username"
                className="font-cairo text-xs font-semibold text-[#4A4038]"
              >
                اسم المستخدم
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="admin"
                  dir="ltr"
                  className="font-cairo text-sm h-10 pr-9 border-[#E5DDD0] focus-visible:border-[#8B1A1A] focus-visible:ring-[#8B1A1A]/20 bg-[#FAF8F3]/50 text-left"
                  disabled={isPending}
                />
                <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#A09080] pointer-events-none" />
              </div>
              {state?.errors?.username && (
                <p className="text-xs text-red-600 font-cairo mt-1">
                  {state.errors.username[0]}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="font-cairo text-xs font-semibold text-[#4A4038]"
              >
                كلمة المرور
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  dir="ltr"
                  className="font-cairo text-sm h-10 pr-9 border-[#E5DDD0] focus-visible:border-[#8B1A1A] focus-visible:ring-[#8B1A1A]/20 bg-[#FAF8F3]/50 text-left"
                  disabled={isPending}
                />
                <LockIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#A09080] pointer-events-none" />
              </div>
              {state?.errors?.password && (
                <p className="text-xs text-red-600 font-cairo mt-1">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-10 font-cairo text-sm font-semibold bg-[#8B1A1A] hover:bg-[#721515] text-white shadow-sm transition-all mt-2"
            >
              {isPending ? (
                <>
                  <Loader2Icon className="size-4 animate-spin ml-2" />
                  جاري التحقق...
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="border-t border-[#E5DDD0]/60 bg-[#FAF8F3]/60 px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-cairo text-[#7D6E63] hover:text-[#8B1A1A] transition-colors"
          >
            <ArrowRightIcon className="size-3.5" />
            العودة إلى الموقع الرئيسي
          </Link>
          <span className="text-[11px] font-cairo text-[#A09080]">
            سناب مطير الرسمي
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}
