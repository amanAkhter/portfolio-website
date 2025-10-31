import React from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../../core/usecases'
import { Button } from '../components/ui'
import { Home, Briefcase, FolderGit2, Award, GraduationCap, MessageSquare, Settings, LogOut, Mail, Info } from 'lucide-react'
import {
  HomeManager,
  AboutManager,
  ExperienceManager,
  ProjectManager,
  SkillManager,
  CertificationManager,
  EducationManager,
  ContactManager,
  ContactSubmissionsManager,
} from '../components/admin'

const AdminPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      navigate('/admin/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin' },
    { icon: Home, label: 'Home Section', path: '/admin/home' },
    { icon: Info, label: 'About Section', path: '/admin/about' },
    { icon: Briefcase, label: 'Experience', path: '/admin/experience' },
    { icon: FolderGit2, label: 'Projects', path: '/admin/projects' },
    { icon: Settings, label: 'Skills', path: '/admin/skills' },
    { icon: Award, label: 'Certifications', path: '/admin/certifications' },
    { icon: GraduationCap, label: 'Education', path: '/admin/education' },
    { icon: Mail, label: 'Contact Info', path: '/admin/contact' },
    { icon: MessageSquare, label: 'Submissions', path: '/admin/submissions' },
  ]

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-tokyo-bg flex">
      {/* Sidebar */}
      <aside className="w-64 bg-tokyo-bg-dark border-r border-tokyo-black flex flex-col fixed h-screen overflow-y-auto">
        <div className="p-6 border-b border-tokyo-black">
          <h1 className="text-2xl font-bold text-tokyo-blue">Admin Panel</h1>
          <p className="text-tokyo-fg-dark text-sm mt-1">Portfolio Management</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-tokyo-bg-highlight text-tokyo-blue border-l-2 border-tokyo-blue'
                    : 'text-tokyo-fg-dark hover:bg-tokyo-bg-highlight hover:text-tokyo-blue'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
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
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/home" element={<HomeManager />} />
          <Route path="/about" element={<AboutManager />} />
          <Route path="/experience" element={<ExperienceManager />} />
          <Route path="/projects" element={<ProjectManager />} />
          <Route path="/skills" element={<SkillManager />} />
          <Route path="/certifications" element={<CertificationManager />} />
          <Route path="/education" element={<EducationManager />} />
          <Route path="/contact" element={<ContactManager />} />
          <Route path="/submissions" element={<ContactSubmissionsManager />} />
        </Routes>
      </main>
    </div>
  )
}

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-tokyo-fg mb-2">Dashboard</h2>
      <p className="text-tokyo-fg-dark mb-6">Manage your portfolio content from here</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-tokyo-bg-light border border-tokyo-black rounded-lg hover:border-tokyo-blue transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-tokyo-blue/20 flex items-center justify-center">
              <Home className="w-5 h-5 text-tokyo-blue" />
            </div>
            <h3 className="text-tokyo-blue font-semibold text-lg">Home & About</h3>
          </div>
          <p className="text-tokyo-fg-dark text-sm">Manage home section and about information</p>
        </div>

        <div className="p-6 bg-tokyo-bg-light border border-tokyo-black rounded-lg hover:border-tokyo-purple transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-tokyo-purple/20 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-tokyo-purple" />
            </div>
            <h3 className="text-tokyo-purple font-semibold text-lg">Experience & Projects</h3>
          </div>
          <p className="text-tokyo-fg-dark text-sm">Add and manage your work experience and projects</p>
        </div>

        <div className="p-6 bg-tokyo-bg-light border border-tokyo-black rounded-lg hover:border-tokyo-cyan transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-tokyo-cyan/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-tokyo-cyan" />
            </div>
            <h3 className="text-tokyo-cyan font-semibold text-lg">Skills & Certifications</h3>
          </div>
          <p className="text-tokyo-fg-dark text-sm">Showcase your skills and certifications</p>
        </div>

        <div className="p-6 bg-tokyo-bg-light border border-tokyo-black rounded-lg hover:border-tokyo-green transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-tokyo-green/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-tokyo-green" />
            </div>
            <h3 className="text-tokyo-green font-semibold text-lg">Education</h3>
          </div>
          <p className="text-tokyo-fg-dark text-sm">Add your educational background</p>
        </div>

        <div className="p-6 bg-tokyo-bg-light border border-tokyo-black rounded-lg hover:border-tokyo-yellow transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-tokyo-yellow/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-tokyo-yellow" />
            </div>
            <h3 className="text-tokyo-yellow font-semibold text-lg">Contact</h3>
          </div>
          <p className="text-tokyo-fg-dark text-sm">Manage contact information and view submissions</p>
        </div>

        <div className="p-6 bg-tokyo-bg-light border border-tokyo-black rounded-lg hover:border-tokyo-red transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-tokyo-red/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-tokyo-red" />
            </div>
            <h3 className="text-tokyo-red font-semibold text-lg">Quick Actions</h3>
          </div>
          <p className="text-tokyo-fg-dark text-sm">Use the sidebar to navigate between sections</p>
        </div>
      </div>

      <div className="mt-8 p-6 bg-tokyo-bg-light border border-tokyo-black rounded-lg">
        <h3 className="text-tokyo-fg font-semibold text-lg mb-3">Getting Started</h3>
        <ul className="space-y-2 text-tokyo-fg-dark text-sm">
          <li className="flex items-start gap-2">
            <span className="text-tokyo-blue mt-1">•</span>
            <span>Start by updating your <strong>Home</strong> and <strong>About</strong> sections with your basic information</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-tokyo-purple mt-1">•</span>
            <span>Add your work <strong>Experience</strong> and showcase your <strong>Projects</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-tokyo-cyan mt-1">•</span>
            <span>Create skill sections and add your <strong>Skills</strong> with proficiency levels</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-tokyo-green mt-1">•</span>
            <span>Upload your <strong>Certifications</strong> and <strong>Education</strong> details</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-tokyo-yellow mt-1">•</span>
            <span>Set up your <strong>Contact</strong> information and monitor form submissions</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AdminPage
