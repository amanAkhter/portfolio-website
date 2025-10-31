import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { authService } from './core/usecases'
import { LoadingScreen } from './presentation/components/ui'
import type { User } from './shared/types'

// Lazy load pages for better performance
const PortfolioPage = React.lazy(() => import('./presentation/pages/PortfolioPage'))
const AdminPage = React.lazy(() => import('./presentation/pages/AdminPage'))
const AdminLogin = React.lazy(() => import('./presentation/pages/AdminLogin'))

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; user: User | null }> = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = authService.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <React.Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Main Portfolio Route */}
          <Route path="/" element={<PortfolioPage />} />

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Route */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute user={user}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </Router>
  )
}

export default App
