"use client"

import { useRouter } from "next/navigation"
import { User } from "lucide-react"

export function Header({ showLogo = true, rightContent }: { showLogo?: boolean; rightContent?: React.ReactNode }) {
  const router = useRouter()

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {showLogo ? (
            <div className="flex items-center gap-3">
              <img src="/365-logo.svg" alt="365 Hub" className="h-10 w-10" />
              <span className="text-xl font-bold text-slate-900">365 Hub</span>
            </div>
          ) : null}

          {rightContent || (
            <button
              onClick={() => router.push("/")}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <User className="h-5 w-5 text-slate-600" />
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
