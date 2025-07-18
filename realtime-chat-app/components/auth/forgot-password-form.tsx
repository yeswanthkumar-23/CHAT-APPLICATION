"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft } from "lucide-react"

interface ForgotPasswordFormProps {
  onBackToLogin: () => void
}

export default function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsEmailSent(true)
      setIsLoading(false)
    }, 1000)
  }

  if (isEmailSent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold">Check your email</h3>
        <p className="text-gray-600">We've sent a password reset link to {email}</p>
        <Button onClick={onBackToLogin} variant="outline" className="w-full bg-transparent">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Forgot Password?</h3>
        <p className="text-gray-600 text-sm mt-2">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleForgotPassword} className="space-y-4">
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

        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>

        <Button onClick={onBackToLogin} variant="outline" className="w-full bg-transparent">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
      </form>
    </div>
  )
}
