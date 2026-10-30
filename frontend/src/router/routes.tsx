import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleGuard } from './RoleGuard'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuth } from '@/context/AuthContext'
import { DashboardPage } from '@/pages/DashboardPage'
import { LoginPage } from '@/pages/LoginPage'
import { MyTicketsPage } from '@/pages/MyTicketsPage'
import { NewTicketPage } from '@/pages/NewTicketPage'
import { TicketDetailPage } from '@/pages/TicketDetailPage'
import { WorkbenchPage } from '@/pages/WorkbenchPage'

const RootRedirect: React.FC = () => {
  const { role, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role === 'END_USER') return <Navigate to="/my-tickets" replace />
  return <Navigate to="/tickets" replace />
}

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes inside AppLayout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<RootRedirect />} />

        {/* Workbench: IT_SUPPORT & ADMIN only */}
        <Route
          path="/tickets"
          element={
            <RoleGuard allowedRoles={['IT_SUPPORT', 'ADMIN']}>
              <WorkbenchPage />
            </RoleGuard>
          }
        />

        {/* Ticket Detail: all roles */}
        <Route path="/tickets/:id" element={<TicketDetailPage />} />

        {/* Create new Ticket: all roles */}
        <Route path="/tickets/new" element={<NewTicketPage />} />

        {/* End-User incidents view: all roles */}
        <Route path="/my-tickets" element={<MyTicketsPage />} />

        {/* Dashboard: IT_SUPPORT & ADMIN only */}
        <Route
          path="/dashboard"
          element={
            <RoleGuard allowedRoles={['IT_SUPPORT', 'ADMIN']}>
              <DashboardPage />
            </RoleGuard>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
