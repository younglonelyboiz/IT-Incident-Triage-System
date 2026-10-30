import React from 'react'
import { Bell, HelpCircle } from 'lucide-react'

interface TopBarProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export const TopBar: React.FC<TopBarProps> = ({ title, subtitle, actions }) => {
  return (
    <header className="h-14 px-6 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div>
        <h2 className="text-sm font-semibold text-slate-900 leading-snug">{title}</h2>
        {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2.5">
        {actions}

        <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

        <button
          type="button"
          aria-label="Thông báo hệ thống"
          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-md cursor-pointer transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-sky-500 ring-2 ring-white" />
        </button>

        <button
          type="button"
          aria-label="Trợ giúp và hướng dẫn"
          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-md cursor-pointer transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
