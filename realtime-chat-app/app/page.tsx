"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/auth/login-form"
import RegisterForm from "@/components/auth/register-form"
import ForgotPasswordForm from "@/components/auth/forgot-password-form"

export default function AuthPage() {
  const [currentView, setCurrentView] = useState<"login" | "register" | "forgot">("login")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("chatAppToken")
    if (token) {
      setIsAuthenticated(true)
      router.push("/chat")
    }
  }, [router])

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-green-600 text-white p-6 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04 1.05 4.35L2 22l5.65-1.05C9.96 21.64 11.46 22 13 22h-1c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.4 0-2.76-.3-4-.85L6 20l.85-2C6.3 16.76 6 15.4 6 14c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">ChatApp</h1>
          <p className="text-green-100 mt-2">Connect with friends instantly</p>
        </div>

        <div className="p-6">
          {currentView === "login" && (
            <LoginForm
              onSwitchToRegister={() => setCurrentView("register")}
              onSwitchToForgot={() => setCurrentView("forgot")}
            />
          )}
          {currentView === "register" && <RegisterForm onSwitchToLogin={() => setCurrentView("login")} />}
          {currentView === "forgot" && <ForgotPasswordForm onBackToLogin={() => setCurrentView("login")} />}
        </div>
      </div>
    </div>
  )
}
