import React, { useEffect, useState } from 'react'
import { portfolioService } from '../../../core/usecases'
import { ScrollReveal, FadeIn } from '../ui/Animations'
import { Card, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { GraduationCap, MapPin, Calendar, Award } from 'lucide-react'
import type { Education as EducationType } from '../../../shared/types'

interface EducationCardProps {
  education: EducationType
  isLast: boolean
}

const EducationCard: React.FC<EducationCardProps> = ({ education, isLast }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="relative pl-8 md:pl-12 pb-12 last:pb-0">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[15px] md:left-[23px] top-[40px] bottom-0 w-0.5 bg-gradient-to-b from-tokyo-blue to-tokyo-purple" />
      )}

      {/* Timeline dot */}
      <div className="absolute left-0 md:left-2 top-0 w-8 h-8 rounded-full bg-tokyo-bg border-4 border-tokyo-blue flex items-center justify-center shadow-lg shadow-tokyo-blue/50">
        <GraduationCap size={16} className="text-tokyo-blue" />
      </div>

      <Card className="hover:border-tokyo-blue transition-all duration-300 hover:shadow-lg hover:shadow-tokyo-blue/20">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-tokyo-fg mb-2">
                {education.courseName}
              </h3>
              <p className="text-tokyo-cyan font-semibold text-lg mb-2">
                {education.universityName}
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-tokyo-fg-dark">
                {education.location && (
                  <div className="flex items-center gap-1">
                    <MapPin size={16} className="text-tokyo-green" />
                    <span>{education.location}</span>
                  </div>
                )}
                {education.endDate && (
                  <div className="flex items-center gap-1">
                    <Calendar size={16} className="text-tokyo-purple" />
                    <span>{new Date(education.endDate).getFullYear()}</span>
                  </div>
                )}
              </div>
            </div>

            <Badge
              className={
                education.status === 'Completed'
                  ? 'bg-tokyo-green/20 text-tokyo-green border-tokyo-green/50'
                  : 'bg-tokyo-yellow/20 text-tokyo-yellow border-tokyo-yellow/50'
              }
            >
              {education.status}
            </Badge>
          </div>

          {education.academicFocus && (
            <div className="mb-4">
              <p className="text-tokyo-fg-dark">
                <span className="font-semibold text-tokyo-fg">Focus: </span>
                {education.academicFocus.mainCourse}
                {education.academicFocus.specialization &&
                  ` - ${education.academicFocus.specialization}`}
              </p>
            </div>
          )}

          {education.keyAchievements && education.keyAchievements.length > 0 && (
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-tokyo-fg mb-3 flex items-center gap-2">
                <Award size={18} className="text-tokyo-yellow" />
                Key Achievements
              </h4>
              <ul className="space-y-2">
                {education.keyAchievements.map((achievement, i) => (
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

          {education.relevantCoursework &&
            education.relevantCoursework.length > 0 && (
              <div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-sm font-semibold text-tokyo-blue hover:text-tokyo-cyan transition-colors mb-2"
                >
                  {isExpanded ? '▼' : '▶'} Relevant Coursework
                </button>
                {isExpanded && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {education.relevantCoursework.map((course, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-tokyo-bg-light border-tokyo-comment/30 text-xs"
                      >
                        {course}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  )
}

export const Education: React.FC = () => {
  const [educations, setEducations] = useState<EducationType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await portfolioService.getAllEducations()
        setEducations(data)
      } catch (error) {
        console.error('Error fetching education:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <section id="education" className="py-12 bg-tokyo-bg-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-8">
            <div className="animate-spin h-12 w-12 border-4 border-tokyo-green border-t-transparent rounded-full" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="education" className="py-12 bg-tokyo-bg-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-tokyo-fg mb-4">
              Education
            </h2>
            <p className="text-tokyo-fg-dark text-lg max-w-2xl mx-auto">
              My academic journey and the foundations of my knowledge
            </p>
          </div>
        </FadeIn>

        <div className="max-w-4xl mx-auto">
          {educations.map((edu, index) => (
            <ScrollReveal key={edu.id || index} delay={index * 0.1}>
              <EducationCard
                education={edu}
                isLast={index === educations.length - 1}
              />
            </ScrollReveal>
          ))}
        </div>

        {educations.length === 0 && !loading && (
          <div className="text-center py-12 text-tokyo-comment">
            <GraduationCap size={48} className="mx-auto mb-4 opacity-50" />
            <p>No education data available</p>
          </div>
        )}
      </div>
    </section>
  )
}
