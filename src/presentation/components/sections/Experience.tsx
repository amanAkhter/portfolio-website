import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { portfolioService } from '../../../core/usecases'
import { ScrollReveal, FadeIn, SlideIn } from '../ui/Animations'
import { Card, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Briefcase, MapPin, Calendar, Clock } from 'lucide-react'
import type { Experience as ExperienceType } from '../../../shared/types'
import { formatDateRange } from '../../../shared/utils/helpers'

const ITEMS_PER_PAGE = 3

export const Experience: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienceType[]>([])
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await portfolioService.getAllExperiences()
        setExperiences(data)
      } catch (error) {
        console.error('Error fetching experiences:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const displayedExperiences = experiences.slice(0, displayCount)
  const hasMore = displayCount < experiences.length

  const getTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'remote':
        return 'bg-tokyo-blue/20 text-tokyo-blue border-tokyo-blue/50'
      case 'office':
        return 'bg-tokyo-purple/20 text-tokyo-purple border-tokyo-purple/50'
      case 'hybrid':
        return 'bg-tokyo-cyan/20 text-tokyo-cyan border-tokyo-cyan/50'
      default:
        return 'bg-tokyo-comment/20 text-tokyo-comment border-tokyo-comment/50'
    }
  }

  if (loading) {
    return (
      <section id="experience" className="py-12 bg-tokyo-bg-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-8">
            <div className="animate-spin h-12 w-12 border-4 border-tokyo-blue border-t-transparent rounded-full" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="experience" className="py-12 bg-tokyo-bg-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-tokyo-fg mb-4">
              Work Experience
            </h2>
            <p className="text-tokyo-fg-dark text-lg max-w-2xl mx-auto">
              My professional journey and the amazing teams I've worked with
            </p>
          </div>
        </FadeIn>

        <div className="max-w-5xl mx-auto space-y-8">
          {displayedExperiences.map((exp, index) => (
            <ScrollReveal key={exp.id || index} delay={index * 0.1}>
              <motion.div
                whileHover={{ scale: 1.01, y: -5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <Card className="hover:border-tokyo-blue transition-all duration-300 hover:shadow-2xl hover:shadow-tokyo-blue/20">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-tokyo-blue mb-2">
                        {exp.currentPosition}
                      </h3>
                      <div className="flex items-center gap-2 text-tokyo-fg mb-2">
                        <Briefcase size={18} className="text-tokyo-cyan" />
                        <span className="font-semibold text-lg">{exp.companyName}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-tokyo-fg-dark">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} className="text-tokyo-purple" />
                          <span>{formatDateRange(exp.startDate, exp.endDate)}</span>
                        </div>
                        {exp.location && (
                          <div className="flex items-center gap-1">
                            <MapPin size={16} className="text-tokyo-green" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge className={`${getTypeBadgeColor(exp.type)} border`}>
                        {exp.type}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-tokyo-fg-dark mb-6 leading-relaxed">
                    {exp.description}
                  </p>

                  {exp.keyAchievements && exp.keyAchievements.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-tokyo-fg mb-3 flex items-center gap-2">
                        <span className="text-tokyo-cyan">✨</span>
                        Key Achievements
                      </h4>
                      <ul className="space-y-2">
                        {exp.keyAchievements.map((achievement, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-tokyo-fg-dark"
                          >
                            <span className="text-tokyo-blue mt-1">▸</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-tokyo-fg mb-3 flex items-center gap-2">
                        <Clock size={16} className="text-tokyo-purple" />
                        Technologies Used
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="bg-tokyo-bg border-tokyo-comment/30 hover:border-tokyo-blue transition-colors"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {hasMore && (
          <SlideIn direction="up" delay={0.2}>
            <div className="flex justify-center mt-12">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setDisplayCount((prev) => prev + ITEMS_PER_PAGE)}
                  variant="outline"
                  className="hover:bg-tokyo-blue hover:text-white transition-all duration-300"
                >
                  Load More Experiences
                </Button>
              </motion.div>
            </div>
          </SlideIn>
        )}

        {experiences.length === 0 && !loading && (
          <div className="text-center py-12 text-tokyo-comment">
            <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
            <p>No experience data available</p>
          </div>
        )}
      </div>
    </section>
  )
}
