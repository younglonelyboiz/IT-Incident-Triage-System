import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { UserRole } from '@/types'

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { role, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (!role || !allowedRoles.includes(role)) {
    // If END_USER attempts to access admin/support only route, redirect to /my-tickets
    return <Navigate to="/my-tickets" replace />
  }

  return <>{children}</>
}
