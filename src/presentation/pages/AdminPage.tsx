import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { authService } from '../../core/usecases'
import { Button } from '../components/ui'
import { Home, Briefcase, FolderGit2, Award, GraduationCap, MessageSquare, Settings, LogOut } from 'lucide-react'

const AdminPage: React.FC = () => {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      navigate('/admin/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const menuItems = [
    { icon: Home, label: 'Home', path: '/admin' },
    { icon: Briefcase, label: 'Experience', path: '/admin/experience' },
    { icon: FolderGit2, label: 'Projects', path: '/admin/projects' },
    { icon: Settings, label: 'Skills', path: '/admin/skills' },
    { icon: Award, label: 'Certifications', path: '/admin/certifications' },
    { icon: GraduationCap, label: 'Education', path: '/admin/education' },
    { icon: MessageSquare, label: 'Contact Submissions', path: '/admin/submissions' },
  ]

  return (
    <div className="min-h-screen bg-tokyo-bg flex">
      {/* Sidebar */}
      <aside className="w-64 bg-tokyo-bg-dark border-r border-tokyo-black flex flex-col">
        <div className="p-6 border-b border-tokyo-black">
          <h1 className="text-2xl font-bold text-tokyo-blue">Admin Panel</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-tokyo-fg-dark hover:bg-tokyo-bg-highlight hover:text-tokyo-blue transition-all"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-tokyo-black">
          <Button
            variant="ghost"
            className="w-full justify-start text-tokyo-red hover:text-tokyo-red"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/experience" element={<div className="text-tokyo-fg">Experience Management Coming Soon</div>} />
          <Route path="/projects" element={<div className="text-tokyo-fg">Projects Management Coming Soon</div>} />
          <Route path="/skills" element={<div className="text-tokyo-fg">Skills Management Coming Soon</div>} />
          <Route path="/certifications" element={<div className="text-tokyo-fg">Certifications Management Coming Soon</div>} />
          <Route path="/education" element={<div className="text-tokyo-fg">Education Management Coming Soon</div>} />
          <Route path="/submissions" element={<div className="text-tokyo-fg">Contact Submissions Coming Soon</div>} />
        </Routes>
      </main>
    </div>
  )
}

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-tokyo-fg mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-tokyo-bg-light border border-tokyo-black rounded-lg">
          <h3 className="text-tokyo-blue font-semibold mb-2">Welcome</h3>
          <p className="text-tokyo-fg-dark">Admin panel is ready for content management</p>
        </div>
        <div className="p-6 bg-tokyo-bg-light border border-tokyo-black rounded-lg">
          <h3 className="text-tokyo-purple font-semibold mb-2">Status</h3>
          <p className="text-tokyo-fg-dark">All systems operational</p>
        </div>
        <div className="p-6 bg-tokyo-bg-light border border-tokyo-black rounded-lg">
          <h3 className="text-tokyo-cyan font-semibold mb-2">Info</h3>
          <p className="text-tokyo-fg-dark">Use the sidebar to manage content</p>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
