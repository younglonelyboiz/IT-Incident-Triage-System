import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Layers,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  ShieldAlert,
  Ticket,
  UserCheck,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useNotification } from '@/context/NotificationContext'
import { UserRole } from '@/types'

export const AppSidebar: React.FC = () => {
  const { user, role, logout, loginAsRole } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useNotification()

  const handleRoleSwitch = async (targetRole: UserRole) => {
    if (role === targetRole) return
    await loginAsRole(targetRole)
    showToast({
      title: 'Chuyển đổi vai trò',
      message: `Đang xem dưới quyền: ${targetRole}`,
      type: 'info',
    })
    if (targetRole === 'END_USER') {
      navigate('/my-tickets')
    } else {
      navigate('/tickets')
    }
  }

  const handleLogout = () => {
    logout()
    showToast({
      title: 'Đã đăng xuất',
      message: 'Hẹn gặp lại bạn!',
      type: 'info',
    })
    navigate('/login')
  }

  const navItems = [
    ...(role === 'IT_SUPPORT' || role === 'ADMIN'
      ? [
          {
            to: '/tickets',
            label: 'Bàn làm việc (Triage)',
            icon: <Layers className="w-4 h-4 shrink-0" aria-hidden="true" />,
          },
          {
            to: '/dashboard',
            label: 'Dashboard Vận hành',
            icon: <LayoutDashboard className="w-4 h-4 shrink-0" aria-hidden="true" />,
          },
        ]
      : []),
    {
      to: '/my-tickets',
      label: 'Sự cố của tôi',
      icon: <Ticket className="w-4 h-4 shrink-0" aria-hidden="true" />,
    },
    {
      to: '/tickets/new',
      label: 'Báo cáo sự cố',
      icon: <PlusCircle className="w-4 h-4 shrink-0" aria-hidden="true" />,
    },
  ]

  return (
    <aside
      aria-label="Thanh điều hướng chính"
      className="w-[240px] shrink-0 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between select-none z-20"
    >
      {/* Brand Header */}
      <div>
        <div className="h-14 flex items-center gap-2.5 px-4 border-b border-slate-200/80">
          <div className="w-7 h-7 rounded-md bg-sky-600 flex items-center justify-center text-white shadow-xs">
            <ShieldAlert className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xs font-bold text-slate-900 tracking-tight">IT Incident</h1>
            <p className="text-[10px] text-sky-600 font-mono font-medium">Triage System</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-2 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-semibold border-l-2 border-sky-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Role Switcher for Mentor Demo & User Footer */}
      <div className="p-3 border-t border-slate-200/80 bg-slate-50/60">
        <div className="mb-3 px-1">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Mô phỏng vai trò
          </p>
          <div className="grid grid-cols-3 gap-1">
            {(['END_USER', 'IT_SUPPORT', 'ADMIN'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleSwitch(r)}
                className={`px-1.5 py-1 text-[10px] font-medium rounded border cursor-pointer transition-all ${
                  role === r
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title={`Đổi sang vai trò ${r}`}
              >
                {r === 'END_USER' ? 'User' : r === 'IT_SUPPORT' ? 'Support' : 'Admin'}
              </button>
            ))}
          </div>
        </div>

        {/* User Card */}
        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-semibold text-xs shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <UserCheck className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">{user?.name || 'Kỹ thuật viên'}</p>
              <p className="text-[11px] text-slate-600 truncate">{user?.department || 'IT Department'}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Đăng xuất khỏi hệ thống"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer transition-colors"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
