import React, { useEffect, useState } from 'react'
import { portfolioService } from '../../../core/usecases'
import { ScrollReveal, FadeIn, ScaleOnHover } from '../ui/Animations'
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
    <ScaleOnHover>
      <Card
        className="cursor-pointer hover:border-tokyo-blue transition-all duration-300 group overflow-hidden h-full"
        onClick={onClick}
      >
        <div className="relative aspect-video overflow-hidden bg-tokyo-bg-light">
          {project.coverImage ? (
            <img
              src={project.coverImage}
              alt={project.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-tokyo-comment">
              <TagIcon size={48} />
            </div>
          )}
          {project.featured && (
            <Badge className="absolute top-4 right-4 bg-tokyo-yellow text-tokyo-bg font-semibold">
              Featured
            </Badge>
          )}
          <Badge className="absolute bottom-4 right-4 bg-tokyo-bg/80 backdrop-blur-sm">
            {project.year}
          </Badge>
        </div>

        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-tokyo-fg mb-2 group-hover:text-tokyo-blue transition-colors">
            {project.name}
          </h3>
          <p className="text-tokyo-fg-dark mb-4 line-clamp-2">
            {project.shortDescription}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="bg-tokyo-bg-light border-tokyo-comment/30 text-xs"
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
        </CardContent>
      </Card>
    </ScaleOnHover>
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalHeader>
        <ModalTitle className="text-2xl">{project.name}</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <div className="space-y-6">
          {project.coverImage && (
            <div className="relative aspect-video overflow-hidden rounded-lg bg-tokyo-bg-light">
              <img
                src={project.coverImage}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div>
            <p className="text-tokyo-fg-dark leading-relaxed">
              {project.description}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-tokyo-fg mb-3">
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-tokyo-bg-light border-tokyo-comment/30"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {project.tags && project.tags.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-tokyo-fg mb-3">
                Features & Highlights
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.tags.map((tag: ProjectTag, i) => {
                  const IconComponent = getIconComponent(tag.icon)
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-lg bg-tokyo-bg-light border border-tokyo-comment/20"
                    >
                      <div className="p-2 rounded-md bg-tokyo-blue/20">
                        <IconComponent size={20} className="text-tokyo-blue" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-tokyo-fg">
                          {tag.label}
                        </div>
                        <div className="text-sm text-tokyo-fg-dark">
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
            <Button
              onClick={() => window.open(project.liveUrl, '_blank')}
              className="bg-tokyo-blue hover:bg-tokyo-blue/80"
            >
              <ExternalLink size={18} className="mr-2" />
              Live Demo
            </Button>
          )}
          {project.githubUrl && (
            <Button
              variant="outline"
              onClick={() => window.open(project.githubUrl, '_blank')}
            >
              <Github size={18} className="mr-2" />
              View Code
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
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
      <section id="projects" className="py-20 bg-tokyo-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-tokyo-purple border-t-transparent rounded-full" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 bg-tokyo-bg">
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
