"use client"

import { Share2Icon } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export function ShareButton({ title, text }: { title: string, text: string }) {
  const [canShare, setCanShare] = useState(false)
  const [url, setUrl] = useState("")

  useEffect(() => {
    setUrl(window.location.href)
    if (typeof navigator !== "undefined" && "share" in navigator) {
      setCanShare(true)
    }
  }, [])

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({
          title,
          text,
          url,
        })
      } catch (err) {
        // user cancelled or failed silently
      }
    } else {
      // fallback to clipboard
      try {
        await navigator.clipboard.writeText(url)
        toast.success("تم نسخ الرابط بنجاح")
      } catch (err) {
        toast.error("فشل نسخ الرابط")
      }
    }
  }

  return (
    <button
      onClick={handleShare}
      className="w-full inline-flex items-center justify-center gap-2 bg-white border border-[#E5DDD0] hover:bg-[#FAF8F3] text-[#4A4038] font-cairo font-semibold h-12 rounded-xl transition-all"
    >
      <Share2Icon className="size-4" />
      <span>مشاركة الدعوة</span>
    </button>
  )
}
