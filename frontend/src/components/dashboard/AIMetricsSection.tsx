import React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AlertCircle, Bot, CheckCircle, Sparkles, TrendingUp } from 'lucide-react'

export const AIMetricsSection: React.FC = () => {
  const categoryOverrideData = [
    { category: 'Mạng & VPN', overrideRate: 8, color: '#3F3F46' },
    { category: 'Phần mềm ERP', overrideRate: 14, color: '#52525B' },
    { category: 'Phần cứng', overrideRate: 4, color: '#71717A' },
    { category: 'Cloud/Server', overrideRate: 11, color: '#A1A1AA' },
    { category: 'Bảo mật/Auth', overrideRate: 6, color: '#D4D4D8' },
  ]

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-900 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">
              Chỉ số Đo lường AI Engineering (AI Observability)
            </h3>
            <p className="text-xs text-zinc-500">
              Đánh giá hiệu quả mô hình Triage, khả năng giải quyết tự động và mức độ can thiệp con người
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded border border-zinc-200">
          ITIL & RAG Metrics
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Metric 1: Deflection Rate */}
        <div className="bg-zinc-50/70 p-4 rounded-md border border-zinc-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
                Tỷ lệ Tự giải quyết (Deflection)
              </span>
              <Bot className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-semibold font-mono text-zinc-900">38.5%</span>
              <span className="inline-flex items-center text-[11px] font-medium text-zinc-700 bg-zinc-200/70 px-1.5 py-0.5 rounded">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                +5.2%
              </span>
            </div>
            <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
              142 sự cố được người dùng tự khắc phục thành công nhờ gợi ý tri thức RAG mà không cần tạo ticket tới kỹ thuật viên.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-200/60 flex items-center justify-between text-xs text-zinc-600">
            <span>Tiết kiệm ước tính:</span>
            <span className="font-semibold text-zinc-900">~71 giờ công L1/L2</span>
          </div>
        </div>

        {/* Metric 2: Category Override Chart */}
        <div className="bg-zinc-50/70 p-4 rounded-md border border-zinc-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
                Tỷ lệ Ghi đè (Human Override)
              </span>
              <span className="text-[11px] font-mono text-zinc-500">Avg: 8.6%</span>
            </div>
            <p className="text-xs text-zinc-500 mb-2">
              Tỷ lệ kỹ thuật viên phải can thiệp sửa đổi kết quả AI:
            </p>

            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height={130}>
                <BarChart
                  data={categoryOverrideData}
                  layout="vertical"
                  margin={{ top: 0, right: 15, left: 15, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="2 2" horizontal={false} stroke="#E4E4E7" />
                  <XAxis type="number" domain={[0, 20]} unit="%" tick={{ fontSize: 9, fill: '#71717A' }} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: '#27272A' }} width={80} />
                  <Tooltip
                    formatter={(val: any) => [`${val}% ghi đè`, 'Tỷ lệ']}
                    contentStyle={{ fontSize: '11px', borderRadius: '4px', border: '1px solid #E4E4E7' }}
                  />
                  <Bar isAnimationActive={false} dataKey="overrideRate" radius={[0, 2, 2, 0]}>
                    {categoryOverrideData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Metric 3: Fallback & DLQ */}
        <div className="bg-zinc-50/70 p-4 rounded-md border border-zinc-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
                Hàng đợi Thủ công (Fallback / DLQ)
              </span>
              <AlertCircle className="w-4 h-4 text-zinc-500" />
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-semibold font-mono text-zinc-900">3.2%</span>
              <span className="text-xs text-zinc-500">độ tin cậy &lt; 70%</span>
            </div>

            <div className="mt-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-white border border-zinc-200/80">
                <span className="text-zinc-600">Sự cố cần kiểm tra thủ công:</span>
                <span className="font-semibold text-zinc-900">1 sự cố</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-white border border-zinc-200/80">
                <span className="text-zinc-600">Dead Letter Queue (DLQ):</span>
                <span className="font-semibold text-zinc-900">0 message</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-200/60 flex items-center gap-1.5 text-xs text-zinc-600">
            <CheckCircle className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
            <span>Độ trễ trung bình: <strong className="font-mono text-zinc-900">480ms</strong></span>
          </div>
        </div>
      </div>
    </div>
  )
}
