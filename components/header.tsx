"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth-modal"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut, type User } from "firebase/auth"

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  return (
    <>
      <header className="bg-[#2d7d7d] text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/images/go-jab-logo.png" alt="GO-JAB" className="w-12 h-12" />
              <div>
                <span className="text-xl font-bold">GO-</span>
                <span className="text-xl font-bold text-[#e67e22]">JAB</span>
                <div className="text-xs text-gray-300">BUS & TRAVEL</div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="hover:text-[#e67e22] transition-colors">
                Home
              </Link>
              <Link href="/track-bus" className="hover:text-[#e67e22] transition-colors">
                Track Bus
              </Link>
              <Link href="/alerts" className="hover:text-[#e67e22] transition-colors">
                Alerts
              </Link>
              <Link href="/dashboard" className="hover:text-[#e67e22] transition-colors">
                Dashboard
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">Welcome, {user.displayName || user.email?.split("@")[0]}</div>
                    <div className="text-xs text-gray-300">{user.email}</div>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-[#2d7d7d] bg-transparent"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    onClick={() => openAuthModal("login")}
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-[#2d7d7d] bg-transparent"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => openAuthModal("signup")}
                    className="bg-[#e67e22] hover:bg-[#d35400] text-white"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  )
}
