import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { portfolioService } from '../../../core/usecases'
import { ScrollReveal, FadeIn } from '../ui/Animations'
import { TiltCard, NeonBorder, HolographicShimmer } from '../ui/AdvancedAnimations'
import { Card, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from '../ui/Modal'
import { ExternalLink, Github, Tag as TagIcon } from 'lucide-react'
import type { Project as ProjectType, ProjectTag } from '../../../shared/types'

interface ProjectCardProps {
  project: ProjectType
  onClick: () => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <TiltCard>
      <NeonBorder color="tokyo-blue">
        <Card
          className="cursor-pointer hover:border-tokyo-blue hover:shadow-2xl hover:shadow-tokyo-blue/20 transition-all duration-500 group overflow-hidden h-[420px] flex flex-col bg-transparent hover:bg-tokyo-bg-dark"
          onClick={onClick}
        >
          <div className="relative aspect-video overflow-hidden bg-tokyo-bg-light flex-shrink-0">
            <HolographicShimmer>
              {project.coverImage ? (
                <img
                  src={project.coverImage}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-tokyo-comment">
                  <TagIcon size={48} />
                </div>
              )}
            </HolographicShimmer>
            {project.featured && (
              <Badge className="absolute top-4 right-4 bg-tokyo-cyan text-tokyo-bg-dark font-semibold shadow-lg shadow-tokyo-cyan/50">
                Featured
              </Badge>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-tokyo-bg/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <CardContent className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-tokyo-fg mb-2 group-hover:text-tokyo-blue transition-colors line-clamp-2 min-h-[56px]">
              {project.name}
            </h3>
            <p className="text-tokyo-fg-dark mb-4 line-clamp-3 flex-1">
              {project.shortDescription}
            </p>

            <div className="space-y-3 mt-auto">
              <Badge className="bg-tokyo-bg-dark border-tokyo-blue/30 text-tokyo-blue text-xs font-semibold">
                {project.year}
              </Badge>
              <div className="flex flex-wrap gap-2 items-center">
                {project.technologies.slice(0, 3).map((tech, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-tokyo-bg-light border-tokyo-comment/30 text-xs hover:border-tokyo-blue/50 transition-colors"
                  >
                    {tech}
                  </Badge>
                ))}
                {project.technologies.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="bg-tokyo-blue/20 text-tokyo-blue border-tokyo-blue/50 text-xs"
                  >
                    +{project.technologies.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </NeonBorder>
    </TiltCard>
  )
}

interface ProjectModalProps {
  project: ProjectType
  isOpen: boolean
  onClose: () => void
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const getIconComponent = (iconName: string) => {
    // Map icon names to Lucide components - you can expand this
    const icons: Record<string, typeof TagIcon> = {
      ExternalLink,
      Github,
      Tag: TagIcon,
    }
    return icons[iconName] || TagIcon
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader>
        <ModalTitle className="text-xl sm:text-2xl">
          {project.name}
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <div className="space-y-3">
          {project.coverImage && (
            <div className="relative aspect-video max-h-[180px] overflow-hidden rounded-lg bg-tokyo-bg-light">
              <HolographicShimmer>
                <img
                  src={project.coverImage}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </HolographicShimmer>
            </div>
          )}

          <div>
            <p className="text-tokyo-fg-dark text-sm leading-relaxed">
              {project.description}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-tokyo-fg mb-2 flex items-center gap-2">
              <span className="w-1 h-3.5 bg-tokyo-blue rounded-full"></span>
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-tokyo-bg-light border-tokyo-comment/30 hover:border-tokyo-blue/50 transition-colors text-xs"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {project.tags && project.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-tokyo-fg mb-2 flex items-center gap-2">
                <span className="w-1 h-3.5 bg-tokyo-purple rounded-full"></span>
                Features & Highlights
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.tags.slice(0, 4).map((tag: ProjectTag, i) => {
                  const IconComponent = getIconComponent(tag.icon)
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-2 p-2 rounded-lg bg-tokyo-bg-light border border-tokyo-comment/20 hover:border-tokyo-blue/50 transition-colors"
                    >
                      <div className="p-1 rounded-md bg-tokyo-blue/20">
                        <IconComponent size={14} className="text-tokyo-blue" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-tokyo-fg text-xs truncate">
                          {tag.label}
                        </div>
                        <div className="text-xs text-tokyo-fg-dark truncate">
                          {tag.subHeading}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex flex-wrap gap-3">
          {project.liveUrl && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => window.open(project.liveUrl, '_blank')}
                className="bg-tokyo-blue hover:bg-tokyo-blue/80 shadow-lg shadow-tokyo-blue/20 transition-all duration-300 text-sm"
              >
                <ExternalLink size={16} className="mr-2" />
                Live Demo
              </Button>
            </motion.div>
          )}
          {project.githubUrl && (
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="outline"
                onClick={() => window.open(project.githubUrl, '_blank')}
                className="border-tokyo-purple/50 hover:border-tokyo-purple hover:bg-tokyo-purple/10 transition-all duration-300 text-sm"
              >
                <Github size={16} className="mr-2" />
                View Code
              </Button>
            </motion.div>
          )}
        </div>
      </ModalFooter>
    </Modal>
  )
}

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(
    null
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await portfolioService.getAllProjects()
        setProjects(data)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <section id="projects" className="py-12 bg-tokyo-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-8">
            <div className="animate-spin h-12 w-12 border-4 border-tokyo-purple border-t-transparent rounded-full" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-12 bg-tokyo-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-tokyo-fg mb-4">
              Featured Projects
            </h2>
            <p className="text-tokyo-fg-dark text-lg max-w-2xl mx-auto">
              A collection of projects I've worked on, showcasing my skills and
              passion for development
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <ScrollReveal key={project.id || index} delay={index * 0.1}>
              <ProjectCard
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            </ScrollReveal>
          ))}
        </div>

        {projects.length === 0 && !loading && (
          <div className="text-center py-12 text-tokyo-comment">
            <TagIcon size={48} className="mx-auto mb-4 opacity-50" />
            <p>No projects available</p>
          </div>
        )}
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  )
}
