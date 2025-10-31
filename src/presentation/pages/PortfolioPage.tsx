import React, { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { portfolioService } from '../../core/usecases'
import { Home } from '../components/sections/Home'
import { About } from '../components/sections/About'
import { Experience } from '../components/sections/Experience'
import { Projects } from '../components/sections/Projects'
import { Skills } from '../components/sections/Skills'
import { Certifications } from '../components/sections/Certifications'
import { Education } from '../components/sections/Education'
import { Contact } from '../components/sections/Contact'
import { LoadingScreen, EasterEggManager } from '../components/ui'
import { FloatingParticles, AnimatedGrid, KonamiCodeDetector } from '../components/ui/AdvancedAnimations'
import type {
  HomeData,
  AboutData,
  Experience as ExperienceType,
  Project,
  Certification,
} from '../../shared/types'

const PortfolioPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [homeData, setHomeData] = useState<HomeData | null>(null)
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [experiences, setExperiences] = useState<ExperienceType[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [easterEggActivated, setEasterEggActivated] = useState(false)

  const menuItems = ['Home', 'About', 'Experience', 'Projects', 'Skills', 'Certifications', 'Education', 'Contact']

  const handleMenuClick = () => {
    setMobileMenuOpen(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          home,
          about,
          exp,
          proj,
          cert,
        ] = await Promise.all([
          portfolioService.getHomeData(),
          portfolioService.getAboutData(),
          portfolioService.getAllExperiences(),
          portfolioService.getAllProjects(),
          portfolioService.getAllCertifications(),
        ])

        setHomeData(home)
        setAboutData(about)
        setExperiences(exp)
        setProjects(proj)
        setCertifications(cert)
      } catch (error) {
        console.error('Error fetching portfolio data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading || !homeData || !aboutData) {
    return <LoadingScreen />
  }

  const handleEasterEgg = () => {
    setEasterEggActivated(true)
    // Show a fun notification
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 z-50 bg-tokyo-purple/90 backdrop-blur-sm border border-tokyo-purple text-tokyo-fg px-6 py-4 rounded-lg shadow-lg shadow-tokyo-purple/50 animate-bounce'
    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎮</span>
        <div>
          <div class="font-bold">Easter Egg Unlocked!</div>
          <div class="text-sm text-tokyo-fg-dark">You found the Konami code!</div>
        </div>
      </div>
    `
    document.body.appendChild(notification)
    setTimeout(() => notification.remove(), 4000)
  }

  return (
    <div className="min-h-screen bg-tokyo-bg relative overflow-hidden">
      {/* Easter Egg Manager */}
      <EasterEggManager />
      
      {/* Background effects */}
      <FloatingParticles />
      <AnimatedGrid className="fixed inset-0 text-tokyo-blue" />
      
      {/* Easter egg detector */}
      <KonamiCodeDetector onActivate={handleEasterEgg} />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-tokyo-bg/80 backdrop-blur-md border-b border-tokyo-black shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a 
              href="#home" 
              className="text-xl font-bold text-tokyo-blue hover:text-tokyo-cyan transition-colors"
            >
              Portfolio
            </a>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {menuItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-tokyo-fg-dark hover:text-tokyo-blue transition-all duration-300 hover:scale-110 relative group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-tokyo-blue group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-tokyo-fg hover:text-tokyo-blue transition-all duration-300 hover:scale-110"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <Menu 
                  className={`w-6 h-6 absolute inset-0 transition-all duration-300 ${
                    mobileMenuOpen ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'
                  }`} 
                />
                <X 
                  className={`w-6 h-6 absolute inset-0 transition-all duration-300 ${
                    mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0'
                  }`} 
                />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <div 
            className={`md:hidden absolute top-16 left-0 right-0 bg-tokyo-bg-dark/95 backdrop-blur-md border-b border-tokyo-black shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${
              mobileMenuOpen 
                ? 'max-h-[400px] opacity-100' 
                : 'max-h-0 opacity-0 border-b-0'
            }`}
          >
            <div className="flex flex-col py-4">
              {menuItems.map((item, index) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={handleMenuClick}
                  className="px-4 py-3 text-tokyo-fg-dark hover:text-tokyo-blue hover:bg-tokyo-bg-highlight transition-all duration-300 border-l-2 border-transparent hover:border-tokyo-blue transform hover:translate-x-1"
                  style={{
                    animation: mobileMenuOpen ? `slideInFromRight 0.3s ease-out ${index * 0.05}s both` : 'none'
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Sections */}
      <div className="relative z-10">
        <Home data={homeData} />
        <About 
          data={aboutData} 
          experiences={experiences}
          projects={projects}
          certifications={certifications}
        />
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <Education />
        <Contact />
      </div>

      {/* Footer */}
      <footer className="bg-tokyo-bg-dark border-t border-tokyo-black py-8 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-tokyo-comment">
            © {new Date().getFullYear()} All rights reserved.
            {easterEggActivated && (
              <span className="ml-2 text-tokyo-purple animate-pulse">✨ Easter egg mode activated!</span>
            )}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default PortfolioPage
