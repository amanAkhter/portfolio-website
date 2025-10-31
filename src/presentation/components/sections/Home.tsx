import React, { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { gsap } from 'gsap'
import { Download, Mail, Github, Linkedin, Twitter, Instagram, Code, Trophy, Award, BookOpen, FileText, Code2, Youtube, MessageSquare } from 'lucide-react'
import { Button, TypingTagline, ParticlesBackground } from '../ui'
import { FadeIn, SlideIn, GlowOnHover } from '../ui/Animations'
import type { HomeData } from '../../../shared/types'

interface HomeProps {
  data: HomeData
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Code,
  Trophy,
  Award,
  BookOpen,
  FileText,
  Code2,
  Youtube,
  MessageSquare,
}

export const Home: React.FC<HomeProps> = ({ data }) => {
  const heroRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Convert Google Drive URL to direct image URL
  const getDirectImageUrl = (url: string): string => {
    if (!url) return url
    
    // Check if it's a Google Drive URL
    const driveMatch = url.match(/\/file\/d\/([^/]+)/)
    if (driveMatch && driveMatch[1]) {
      // Convert to direct image URL
      return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`
    }
    
    return url
  }

  useEffect(() => {
    if (heroRef.current && imageRef.current) {
      // GSAP animations
      gsap.fromTo(
        imageRef.current,
        { scale: 0.8, opacity: 0, rotation: -10 },
        { scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: 'back.out(1.4)' }
      )

      // Floating animation for profile image
      gsap.to(imageRef.current, {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      })
    }
  }, [])

  return (
    <section
      id="home"
      ref={heroRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-tokyo-bg via-tokyo-bg-dark to-tokyo-bg"
    >
      {/* Particles.js Background */}
      <ParticlesBackground id="home-particles" />
      
      {/* Mouse Particle Effect */}
      {/* <MouseParticleEffect /> */}
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-tokyo-blue/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-tokyo-purple/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <SlideIn direction="left">
              <p className="text-tokyo-cyan text-lg font-medium">
                {data.greeting || 'Hi, I am'}
              </p>
            </SlideIn>

            <FadeIn delay={0.2}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-tokyo-fg">
                {data.name || 'Your Name'}
              </h1>
            </FadeIn>

            <SlideIn direction="left" delay={0.3}>
              {data.taglines && data.taglines.length > 0 ? (
                <TypingTagline 
                  taglines={data.taglines}
                  className="text-3xl sm:text-4xl font-semibold"
                  typingSpeed={80}
                  deletingSpeed={40}
                  pauseDuration={2000}
                />
              ) : (
                <h2 className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-tokyo-blue via-tokyo-purple to-tokyo-cyan bg-clip-text text-transparent">
                  {data.tagline || 'Full Stack Developer'}
                </h2>
              )}
            </SlideIn>

            <FadeIn delay={0.4}>
              <p className="text-tokyo-fg-dark text-lg leading-relaxed max-w-xl">
                {data.description || 'Building exceptional digital experiences with modern web technologies.'}
              </p>
            </FadeIn>

            {/* Action Buttons */}
            <FadeIn delay={0.5}>
              <div className="flex flex-wrap gap-4 pt-4">
                <GlowOnHover>
                  <Button
                    size="lg"
                    onClick={() => window.open(data.resumeURL, '_blank')}
                    className="group"
                  >
                    <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                    Download Resume
                  </Button>
                </GlowOnHover>

                <GlowOnHover>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => window.location.href = `mailto:${data.email}`}
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    Contact Me
                  </Button>
                </GlowOnHover>
              </div>
            </FadeIn>

            {/* Social Links */}
            <FadeIn delay={0.6}>
              <div className="flex flex-wrap gap-4 pt-6">
                {data.socialLinks.map((social) => {
                  const Icon = iconMap[social.icon || 'Code'] || Code
                  return (
                    <motion.div
                      key={social.url}
                      whileHover={{ scale: 1.15, rotate: 360 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.6 }}
                      className="relative"
                    >
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-tokyo-blue/30 hover:border-tokyo-blue bg-tokyo-bg-dark/60 hover:bg-tokyo-blue/10 transition-all duration-300 backdrop-blur-sm relative"
                        style={{
                          boxShadow: '0 4px 14px 0 rgba(122, 162, 247, 0.15)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(122, 162, 247, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(122, 162, 247, 0.15)';
                        }}
                      >
                        <Icon className="h-6 w-6 text-tokyo-blue" />
                      </a>
                    </motion.div>
                  )
                })}
              </div>
            </FadeIn>
          </div>

          {/* Right Content - Profile Image */}
          <SlideIn direction="right" delay={0.3}>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-tokyo-blue via-tokyo-purple to-tokyo-cyan opacity-20 blur-2xl rounded-full" />
                
                {/* Profile Image Container */}
                <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full overflow-hidden border-4 border-tokyo-blue/30 shadow-2xl">
                  <img
                    ref={imageRef}
                    src={getDirectImageUrl(data.profileURL)}
                    alt={data.name || 'Profile'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://via.placeholder.com/400x400/1a1b26/7aa2f7?text=Profile'
                    }}
                  />
                </div>

                {/* Decorative Elements */}
                <motion.div
                  className="absolute -z-10 w-full h-full border-4 border-tokyo-purple/30 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  style={{ top: '10%', left: '10%' }}
                />
              </div>
            </div>
          </SlideIn>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="hidden lg:block absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-tokyo-blue rounded-full flex justify-center">
          <motion.div
            className="w-1.5 h-1.5 bg-tokyo-blue rounded-full mt-2"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}
