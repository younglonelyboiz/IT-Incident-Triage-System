import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { PRIORITY_CONFIG } from '@/lib/constants'
import { Priority } from '@/types'

interface PriorityPieChartProps {
  data: { priority: Priority; count: number }[]
}

export const PriorityPieChart: React.FC<PriorityPieChartProps> = ({ data }) => {
  const chartData = data.map((d) => ({
    name: PRIORITY_CONFIG[d.priority].label,
    value: d.count,
    priority: d.priority,
    color: PRIORITY_CONFIG[d.priority].color,
  }))

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Phân bố Mức độ Ưu tiên Sự cố</h3>
          <p className="text-xs text-slate-500">Tỷ trọng các sự cố theo ITIL P1–P4</p>
        </div>
      </div>

      <div className="h-64 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              isAnimationActive={false}
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => [`${value} sự cố`, name]}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#E2E8F0',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-slate-600 truncate">{item.name}</span>
            <span className="text-xs font-bold text-slate-900 ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
