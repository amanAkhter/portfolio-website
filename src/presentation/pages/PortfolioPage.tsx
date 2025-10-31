import React, { useEffect, useState } from 'react'
import { portfolioService } from '../../core/usecases'
import { Home } from '../components/sections/Home'
import { About } from '../components/sections/About'
import { Experience } from '../components/sections/Experience'
import { Projects } from '../components/sections/Projects'
import { Skills } from '../components/sections/Skills'
import { Certifications } from '../components/sections/Certifications'
import { Education } from '../components/sections/Education'
import { Contact } from '../components/sections/Contact'
import { LoadingScreen } from '../components/ui'
import type {
  HomeData,
  AboutData,
  Experience as ExperienceType,
  Project,
  Certification,
} from '../../shared/types'

const PortfolioPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [homeData, setHomeData] = useState<HomeData | null>(null)
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [experiences, setExperiences] = useState<ExperienceType[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])

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

  return (
    <div className="min-h-screen bg-tokyo-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-tokyo-bg/80 backdrop-blur-md border-b border-tokyo-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="#home" className="text-xl font-bold text-tokyo-blue">
              Portfolio
            </a>
            <div className="hidden md:flex space-x-8">
              {['Home', 'About', 'Experience', 'Projects', 'Skills', 'Certifications', 'Education', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-tokyo-fg-dark hover:text-tokyo-blue transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Sections */}
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

      {/* Footer */}
      <footer className="bg-tokyo-bg-dark border-t border-tokyo-black py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-tokyo-comment">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default PortfolioPage
