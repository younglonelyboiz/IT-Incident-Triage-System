import React from 'react'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: {
    value: string
    isPositive: boolean
  }
  highlightColor?: 'default' | 'red' | 'green' | 'blue' | 'violet'
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  highlightColor = 'default',
}) => {
  const colorStyles = {
    default: 'text-slate-900 border-slate-200',
    red: 'text-red-600 border-red-200 bg-red-50/20',
    green: 'text-emerald-700 border-emerald-200 bg-emerald-50/20',
    blue: 'text-blue-700 border-blue-200 bg-blue-50/20',
    violet: 'text-violet-700 border-violet-200 bg-violet-50/20',
  }[highlightColor]

  return (
    <div className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between ${colorStyles}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</span>
        {trend && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              trend.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
  )
}
