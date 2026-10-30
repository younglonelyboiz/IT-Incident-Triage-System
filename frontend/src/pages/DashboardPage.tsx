import React, { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle, Clock, LayoutDashboard } from 'lucide-react'
import { AIMetricsSection } from '@/components/dashboard/AIMetricsSection'
import { KPICard } from '@/components/dashboard/KPICard'
import { PriorityPieChart } from '@/components/dashboard/PriorityPieChart'
import { TicketBarChart } from '@/components/dashboard/TicketBarChart'
import { TopBar } from '@/components/layout/TopBar'
import { ticketService } from '@/services/ticketService'
import { Priority } from '@/types'

export const DashboardPage: React.FC = () => {
  const [pieData, setPieData] = useState<{ priority: Priority; count: number }[]>([
    { priority: 'P1', count: 3 },
    { priority: 'P2', count: 8 },
    { priority: 'P3', count: 18 },
    { priority: 'P4', count: 12 },
  ])

  const [dailyData] = useState([
    { date: '24/10', p1: 1, p2: 2, p3: 4, p4: 3 },
    { date: '25/10', p1: 0, p2: 1, p3: 5, p4: 2 },
    { date: '26/10', p1: 2, p2: 3, p3: 6, p4: 4 },
    { date: '27/10', p1: 1, p2: 2, p3: 3, p4: 5 },
    { date: '28/10', p1: 0, p2: 4, p3: 7, p4: 3 },
    { date: '29/10', p1: 3, p2: 2, p3: 5, p4: 4 },
    { date: 'Hôm nay', p1: 2, p2: 3, p3: 4, p4: 2 },
  ])

  useEffect(() => {
    const calculateStats = async () => {
      const tickets = await ticketService.getTickets()
      const p1 = tickets.filter((t) => t.priority === 'P1').length
      const p2 = tickets.filter((t) => t.priority === 'P2').length
      const p3 = tickets.filter((t) => t.priority === 'P3').length
      const p4 = tickets.filter((t) => t.priority === 'P4').length
      setPieData([
        { priority: 'P1', count: p1 || 2 },
        { priority: 'P2', count: p2 || 5 },
        { priority: 'P3', count: p3 || 12 },
        { priority: 'P4', count: p4 || 8 },
      ])
    }
    calculateStats()
  }, [])

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <TopBar
        title="Bảng điều khiển Giám sát Vận hành IT & SLA"
        subtitle="Tổng quan sức khỏe dịch vụ, tuân thủ cam kết SLA và hiệu năng của AI Triage"
      />

      <div className="p-8 max-w-[1500px] w-full mx-auto space-y-6">
        {/* Row 1: 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KPICard
            title="Tổng sự cố tiếp nhận"
            value="128"
            subtitle="Tăng 12% so với tuần trước"
            icon={<LayoutDashboard className="w-5 h-5" />}
            trend={{ value: '+12%', isPositive: false }}
            highlightColor="default"
          />

          <KPICard
            title="P1 Khẩn cấp Active"
            value="3"
            subtitle="2 sự cố đang có kỹ thuật viên L2 xử lý"
            icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
            highlightColor="red"
          />

          <KPICard
            title="Tỷ lệ Tuân thủ SLA"
            value="94.2%"
            subtitle="Mục tiêu cam kết doanh nghiệp: >= 90%"
            icon={<CheckCircle className="w-5 h-5 text-emerald-600" />}
            trend={{ value: '+1.8%', isPositive: true }}
            highlightColor="green"
          />

          <KPICard
            title="MTTR Trung bình"
            value="2.3 giờ"
            subtitle="Thời gian trung bình phục hồi dịch vụ"
            icon={<Clock className="w-5 h-5 text-blue-600" />}
            trend={{ value: '-35 phút', isPositive: true }}
            highlightColor="blue"
          />
        </div>

        {/* Row 2: Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <PriorityPieChart data={pieData} />
          </div>
          <div className="lg:col-span-7">
            <TicketBarChart data={dailyData} />
          </div>
        </div>

        {/* Row 3: AI Engineering Metrics */}
        <div>
          <AIMetricsSection />
        </div>
      </div>
    </div>
  )
}
