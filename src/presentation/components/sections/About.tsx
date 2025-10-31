import React from 'react'
import { motion } from 'motion/react'
import { Briefcase, Award, Calendar } from 'lucide-react'
import { ScrollReveal, FadeIn } from '../ui/Animations'
import { Card, CardContent } from '../ui'
import type { AboutData, Experience, Project, Certification } from '../../../shared/types'
import { calculateYearsOfExperience } from '../../../shared/utils/helpers'

interface AboutProps {
  data: AboutData
  experiences: Experience[]
  projects: Project[]
  certifications: Certification[]
}

export const About: React.FC<AboutProps> = ({ data, experiences, projects, certifications }) => {
  const yearsOfExperience = calculateYearsOfExperience(experiences)

  const stats = [
    { icon: Calendar, label: 'Years Experience', value: yearsOfExperience },
    { icon: Briefcase, label: 'Projects Completed', value: projects.length },
    { icon: Award, label: 'Certifications', value: certifications.length },
  ]

  return (
    <section id="about" className="py-12 bg-tokyo-bg-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-4xl sm:text-5xl font-bold text-center text-tokyo-fg mb-4">
            About <span className="text-tokyo-blue">Me</span>
          </h2>
          <p className="text-tokyo-comment text-center mb-12 max-w-2xl mx-auto">
            Get to know more about my journey and expertise
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Card className="text-center hover:border-tokyo-blue transition-all duration-300 hover:shadow-2xl hover:shadow-tokyo-blue/20 group">
                  <CardContent className="pt-6">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className="w-12 h-12 mx-auto mb-4 text-tokyo-blue group-hover:text-tokyo-cyan transition-colors duration-300" />
                    </motion.div>
                    <motion.h3 
                      className="text-3xl font-bold text-tokyo-fg mb-2"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    >
                      {stat.value}+
                    </motion.h3>
                    <p className="text-tokyo-comment group-hover:text-tokyo-fg transition-colors duration-300">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ScrollReveal>
            <div>
              <h3 className="text-2xl font-semibold text-tokyo-fg mb-4">Overview</h3>
              <p className="text-tokyo-fg-dark leading-relaxed mb-6">{data.intro}</p>
              <p className="text-tokyo-fg-dark leading-relaxed">{data.overview}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div>
              <h3 className="text-2xl font-semibold text-tokyo-fg mb-4">Latest Positions</h3>
              <div className="space-y-4">
                {data.latestPositions.map((position, index) => (
                  <FadeIn key={index} delay={index * 0.1}>
                    <motion.div 
                      className="p-4 bg-tokyo-bg-light rounded-lg border border-tokyo-black hover:border-tokyo-blue transition-all duration-300 hover:shadow-lg hover:shadow-tokyo-blue/10"
                      whileHover={{ x: 10 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <h4 className="font-semibold text-tokyo-fg">{position.title}</h4>
                      <p className="text-tokyo-blue text-sm">{position.company}</p>
                      <p className="text-tokyo-comment text-xs mt-1">{position.duration}</p>
                    </motion.div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
