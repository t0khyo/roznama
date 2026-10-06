"use client"

import { useState, useActionState } from "react"
import Link from "next/link"
import { UserIcon, ArrowLeftIcon, Loader2Icon, EyeIcon, EyeOffIcon } from "lucide-react"
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
  const [showPassword, setShowPassword] = useState(false)
  const [state, formAction, isPending] = useActionState<LoginState | undefined, FormData>(
    loginAction,
    undefined
  )

  return (
    <div className="w-full max-w-md mx-auto" dir="rtl">
      <Card className="border border-border shadow-sm bg-card overflow-hidden">
        <CardHeader className="space-y-3 text-center pb-2 pt-6">
          {/* Logo with matching navbar fill and border styling */}
          <div className="flex justify-center mb-2">
            <img
              src="/logo.png"
              alt="سناب مطير"
              className="h-20 w-auto object-contain drop-shadow-sm"
            />
          </div>

          <div className="space-y-1">
            <CardTitle
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-thmanyah-serif), serif" }}
            >
              تسجيل دخول لوحة التحكم
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground font-cairo">
              أدخل بيانات حساب الإدارة للمتابعة
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30 font-cairo flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-red-600 dark:bg-red-500 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="username"
                className="font-cairo text-xs font-semibold text-foreground/90"
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
                  className="font-cairo text-sm h-10 pr-9 border-border focus-visible:border-primary focus-visible:ring-primary/20 bg-background/50 text-left"
                  disabled={isPending}
                />
                <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
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
                className="font-cairo text-xs font-semibold text-foreground/90"
              >
                كلمة المرور
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  dir="ltr"
                  className="font-cairo text-sm h-10 pr-9 border-border focus-visible:border-primary focus-visible:ring-primary/20 bg-background/50 text-left"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  tabIndex={0}
                >
                  {showPassword ? (
                    <EyeOffIcon className="size-4" />
                  ) : (
                    <EyeIcon className="size-4" />
                  )}
                </button>
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
              className="w-full h-10 font-cairo text-sm font-semibold bg-primary hover:bg-primary-dark text-white shadow-sm transition-all mt-2"
            >
              {isPending ? (
                <>
                  جاري التحقق...
                  <Loader2Icon className="size-4 animate-spin ml-2" />
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="border-t border-border/60 bg-background/60 px-6 py-3 flex items-center justify-between">
          <span className="text-[11px] font-cairo text-muted-foreground">
            سناب مطير الرسمي
          </span>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-cairo text-muted-foreground hover:text-primary transition-colors"
          >
            العودة إلى الموقع الرئيسي
            <ArrowLeftIcon className="size-3.5" />
          </Link>

        </CardFooter>
      </Card>
    </div>
  )
}
