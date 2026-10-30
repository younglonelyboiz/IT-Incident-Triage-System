import React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface DailyTicketStats {
  date: string
  p1: number
  p2: number
  p3: number
  p4: number
}

interface TicketBarChartProps {
  data: DailyTicketStats[]
}

export const TicketBarChart: React.FC<TicketBarChartProps> = ({ data }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Khối lượng Sự cố theo Ngày</h3>
          <p className="text-xs text-slate-500">Số lượng phiếu tiếp nhận trong 7 ngày gần nhất</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#E2E8F0',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />
            <Bar isAnimationActive={false} dataKey="p1" name="P1 Khẩn cấp" fill="#EF4444" stackId="a" radius={[0, 0, 0, 0]} />
            <Bar isAnimationActive={false} dataKey="p2" name="P2 Cao" fill="#F97316" stackId="a" />
            <Bar isAnimationActive={false} dataKey="p3" name="P3 Trung bình" fill="#EAB308" stackId="a" />
            <Bar isAnimationActive={false} dataKey="p4" name="P4 Thấp" fill="#22C55E" stackId="a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
