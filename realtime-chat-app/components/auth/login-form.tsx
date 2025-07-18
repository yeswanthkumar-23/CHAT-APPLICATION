"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

interface LoginFormProps {
  onSwitchToRegister: () => void
  onSwitchToForgot: () => void
}

export default function LoginForm({ onSwitchToRegister, onSwitchToForgot }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Mock authentication - in real app, validate against backend
      const mockUsers = JSON.parse(localStorage.getItem("chatAppUsers") || "[]")
      const user = mockUsers.find((u: any) => u.email === email && u.password === password)

      if (user || (email === "demo@example.com" && password === "demo123")) {
        const userData = user || {
          id: "demo-user",
          name: "Demo User",
          email: "demo@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
        }

        localStorage.setItem("chatAppToken", "mock-jwt-token")
        localStorage.setItem("chatAppUser", JSON.stringify(userData))
        router.push("/chat")
      } else {
        alert("Invalid credentials. Try demo@example.com / demo123")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button type="button" onClick={onSwitchToForgot} className="text-sm text-green-600 hover:text-green-700">
          Forgot Password?
        </button>
      </div>

      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="text-center">
        <span className="text-sm text-gray-600">{"Don't have an account? "}</span>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-sm text-green-600 hover:text-green-700 font-medium"
        >
          Sign up
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Demo Credentials:</strong>
          <br />
          Email: demo@example.com
          <br />
          Password: demo123
        </p>
      </div>
    </form>
  )
}
