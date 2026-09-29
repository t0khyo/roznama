"use client"

import { useEffect, useRef, type ReactNode } from "react"

export default function ScrollReveal({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current

    if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    const targets = Array.from(
      container.querySelectorAll<HTMLElement>("[data-reveal]")
    )
    const revealTargets = targets.length > 0
      ? targets
      : Array.from(
          container.querySelectorAll<HTMLElement>(":scope > section, :scope > footer")
        )

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          entry.target.classList.add("revealed")
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.15 }
    )

    revealTargets.forEach((target, index) => {
      target.classList.add("reveal")
      target.style.setProperty("--reveal-delay", `${(index % 4) * 0.1}s`)
      observer.observe(target)
    })

    return () => observer.disconnect()
  }, [])

  return <div ref={containerRef}>{children}</div>
}
