import React, { useEffect, useState } from 'react'
import { portfolioService } from '../../../core/usecases'
import { ScrollReveal, FadeIn } from '../ui/Animations'
import { Card, CardContent } from '../ui/Card'
import { Progress } from '../ui/Progress'
import { ChevronDown, ChevronUp, Code2 } from 'lucide-react'
import type { SkillSection, Skill as SkillType } from '../../../shared/types'
import { motion, AnimatePresence } from 'motion/react'

interface SkillCategoryProps {
  section: SkillSection
  skills: SkillType[]
}

const SkillCategory: React.FC<SkillCategoryProps> = ({ section, skills }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Card className="overflow-hidden border-tokyo-comment/20 hover:border-tokyo-blue/50 transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-tokyo-bg-light transition-colors"
      >
        <h3 className="text-xl font-bold text-tokyo-fg flex items-center gap-2">
          <Code2 size={24} className="text-tokyo-blue" />
          {section.name}
        </h3>
        {isExpanded ? (
          <ChevronUp size={24} className="text-tokyo-cyan" />
        ) : (
          <ChevronDown size={24} className="text-tokyo-cyan" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="px-6 pb-6 pt-0">
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <ScrollReveal key={skill.id || index} delay={index * 0.05}>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-tokyo-fg font-medium">
                          {skill.name}
                        </span>
                        <span className="text-tokyo-blue font-semibold">
                          {skill.percentage}%
                        </span>
                      </div>
                      <Progress
                        value={skill.percentage}
                        className="h-2"
                      />
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

export const Skills: React.FC = () => {
  const [sections, setSections] = useState<SkillSection[]>([])
  const [skillsBySection, setSkillsBySection] = useState<
    Record<string, SkillType[]>
  >({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionsData = await portfolioService.getAllSkillSections()
        setSections(sectionsData)

        const skillsData: Record<string, SkillType[]> = {}
        for (const section of sectionsData) {
          const skills = await portfolioService.getSkillsBySection(section.name)
          skillsData[section.name] = skills
        }
        setSkillsBySection(skillsData)
      } catch (error) {
        console.error('Error fetching skills:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <section id="skills" className="py-20 bg-tokyo-bg-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-tokyo-cyan border-t-transparent rounded-full" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="skills" className="py-20 bg-tokyo-bg-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-tokyo-fg mb-4">
              Skills & Expertise
            </h2>
            <p className="text-tokyo-fg-dark text-lg max-w-2xl mx-auto">
              My technical skills and proficiency levels across various
              technologies and tools
            </p>
          </div>
        </FadeIn>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, index) => (
            <ScrollReveal key={section.id || index} delay={index * 0.1}>
              <SkillCategory
                section={section}
                skills={skillsBySection[section.name] || []}
              />
            </ScrollReveal>
          ))}
        </div>

        {sections.length === 0 && !loading && (
          <div className="text-center py-12 text-tokyo-comment">
            <Code2 size={48} className="mx-auto mb-4 opacity-50" />
            <p>No skills data available</p>
          </div>
        )}
      </div>
    </section>
  )
}
