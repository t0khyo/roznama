"use client";

import { useEffect, useRef } from "react";
import { EyeIcon } from "lucide-react";

export function ViewCounter({ eventId, count }: { eventId: string; count: number }) {
  const hasFired = useRef(false);

  useEffect(() => {
    // Ensure we only fire once per mount in strict mode
    if (hasFired.current) return;
    hasFired.current = true;

    // Fire and forget
    fetch(`/api/events/${eventId}/view`, { method: "POST" }).catch(console.error);
  }, [eventId]);

  return (
    <div className="flex items-center justify-center gap-2 py-3 text-sm font-cairo text-[#7D6E63] bg-[#FAF8F3] rounded-xl border border-[#E5DDD0]/50 mt-2 shadow-sm">
      <EyeIcon className="size-4" />
      <span>عدد المشاهدات:</span>
      <span className="font-bold text-[#4A4038]" dir="ltr">
        {count.toLocaleString('en-US')}
      </span>
    </div>
  );
}
