import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../core/usecases'
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '../components/ui'
import { FadeIn } from '../components/ui/Animations'

const AdminLogin: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await authService.signIn(email, password)
      
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        setError('You do not have admin access')
        await authService.signOut()
      }
    } catch (err) {
      setError('Invalid email or password')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-tokyo-bg via-tokyo-bg-dark to-tokyo-bg flex items-center justify-center px-4">
      <FadeIn>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-tokyo-blue">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-tokyo-fg mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-tokyo-fg mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="bg-tokyo-red/10 border border-tokyo-red text-tokyo-red px-4 py-2 rounded-md text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate('/')}
              >
                Back to Portfolio
              </Button>
            </form>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}

export default AdminLogin
