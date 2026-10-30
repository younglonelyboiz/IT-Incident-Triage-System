import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, ShieldAlert, Sparkles, User, UserCheck, Shield } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useNotification } from '@/context/NotificationContext'
import { SEED_USERS } from '@/lib/constants'
import { UserRole } from '@/types'

export const LoginPage: React.FC = () => {
  const { login, loginAsRole, isLoading } = useAuth()
  const { showToast } = useNotification()
  const navigate = useNavigate()

  const [email, setEmail] = useState('duc.tran@company.com')
  const [password, setPassword] = useState('password123')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loginAttempts, setLoginAttempts] = useState(0)

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}
    if (!email) {
      newErrors.email = 'Vui lòng nhập địa chỉ email công ty'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email không hợp lệ'
    }
    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      await login(email, password)
      showToast({
        title: 'Đăng nhập thành công',
        message: 'Chào mừng bạn quay trở lại!',
        type: 'success',
      })
      navigate('/tickets')
    } catch {
      setLoginAttempts((prev) => prev + 1)
      showToast({
        title: 'Đăng nhập thất bại',
        message: 'Email hoặc mật khẩu không chính xác',
        type: 'error',
      })
    }
  }

  const handleQuickRoleSelect = async (role: UserRole) => {
    const seed = SEED_USERS.find((u) => u.role === role)
    if (seed) {
      setEmail(seed.email)
      setPassword(seed.password)
      await loginAsRole(role)
      showToast({
        title: `Đăng nhập vai trò ${role}`,
        message: `Chào mừng ${seed.name}!`,
        type: 'success',
      })
      if (role === 'END_USER') {
        navigate('/my-tickets')
      } else {
        navigate('/tickets')
      }
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-[400px] bg-white border border-zinc-200 rounded-xl shadow-xs p-7 space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 bg-sky-600 rounded-lg mx-auto flex items-center justify-center text-white shadow-xs">
            <ShieldAlert className="w-5 h-5" aria-hidden="true" />
          </div>
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
            IT Incident Triage System
          </h1>
          <p className="text-xs text-slate-500">
            Hệ thống Quản lý & Phân loại Sự cố IT Chuẩn ITIL
          </p>
        </div>

        {/* Quick Role Selector for Mentor Demo */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              Chọn nhanh vai trò (Demo):
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickRoleSelect('END_USER')}
              className="flex flex-col items-center justify-center p-2 rounded-md border border-slate-200 bg-white hover:border-sky-500 hover:text-sky-700 text-slate-700 cursor-pointer transition-colors"
            >
              <User className="w-3.5 h-3.5 mb-1 text-slate-500" />
              <span className="text-xs font-medium">End-User</span>
              <span className="text-[10px] text-slate-400">Báo sự cố</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleSelect('IT_SUPPORT')}
              className="flex flex-col items-center justify-center p-2 rounded-md border border-sky-600 bg-sky-600 text-white cursor-pointer transition-colors shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5 mb-1 text-sky-100" />
              <span className="text-xs font-semibold">IT Support</span>
              <span className="text-[10px] text-sky-100">Triage & RAG</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleSelect('ADMIN')}
              className="flex flex-col items-center justify-center p-2 rounded-md border border-slate-200 bg-white hover:border-sky-500 hover:text-sky-700 text-slate-700 cursor-pointer transition-colors"
            >
              <Shield className="w-3.5 h-3.5 mb-1 text-slate-500" />
              <span className="text-xs font-medium">Admin</span>
              <span className="text-[10px] text-slate-400">Dashboard</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-2.5 text-[10px] font-medium text-slate-400 uppercase tracking-wider relative">
            Hoặc đăng nhập
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label htmlFor="login-email" className="block text-xs font-medium text-slate-700 mb-1">
              Địa chỉ Email doanh nghiệp
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
              }}
              onBlur={validate}
              placeholder="ten.nguyen@company.com"
              className={`w-full text-xs px-3 py-2 rounded-md border bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors ${
                errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'
              }`}
            />
            {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-medium text-slate-700 mb-1">
              Mật khẩu
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
              }}
              onBlur={validate}
              placeholder="••••••••"
              className={`w-full text-xs px-3 py-2 rounded-md border bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors ${
                errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'
              }`}
            />
            {errors.password && <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>}
          </div>

          {loginAttempts >= 5 && (
            <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-md text-xs text-slate-700">
              Bạn đã nhập sai quá 5 lần. Vui lòng thử lại sau 15 phút.
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || loginAttempts >= 5}
            className="w-full py-2 px-4 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-medium rounded-md shadow-xs cursor-pointer transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Đăng nhập hệ thống</span>
          </button>
        </form>
      </div>

      <p className="text-[11px] text-zinc-400 mt-5 text-center font-mono">
        ITIL v4 Incident Management & Grounded RAG
      </p>
    </div>
  )
}
