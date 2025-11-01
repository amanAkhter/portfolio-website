import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
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
import { Award, ExternalLink, Star } from 'lucide-react'
import type { Certification as CertificationType } from '../../../shared/types'

interface CertificationCardProps {
  certification: CertificationType
  onClick: () => void
}

const CertificationCard: React.FC<CertificationCardProps> = ({
  certification,
  onClick,
}) => {
  return (
    <ScaleOnHover>
      <Card
        className="cursor-pointer hover:border-tokyo-purple hover:shadow-2xl hover:shadow-tokyo-purple/20 transition-all duration-500 group overflow-hidden h-[480px] flex flex-col"
        onClick={onClick}
      >
        <div className="relative aspect-video overflow-hidden bg-tokyo-bg-light flex-shrink-0">
          {certification.coverImage ? (
            <img
              src={certification.coverImage}
              alt={certification.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-tokyo-comment">
              <Award size={48} />
            </div>
          )}
          {certification.featured && (
            <Badge className="absolute top-4 right-4 bg-tokyo-magenta text-white font-semibold flex items-center gap-1 shadow-lg shadow-tokyo-magenta/50">
              <Star size={14} fill="currentColor" />
              Featured
            </Badge>
          )}
        </div>

        <CardContent className="p-6 flex-1 flex flex-col min-h-0">
          <h3 className="text-lg font-bold text-tokyo-fg mb-2 group-hover:text-tokyo-purple transition-colors line-clamp-2 min-h-[56px]">
            {certification.title}
          </h3>
          <p className="text-tokyo-cyan font-medium mb-2 truncate">
            {certification.issuingOrganization}
          </p>
          <p className="text-tokyo-comment text-sm mb-4">{certification.year}</p>

          <div className="flex flex-wrap gap-2 overflow-hidden max-h-[80px] items-center">
            {certification.skills.slice(0, 3).map((skill, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="bg-tokyo-bg-light border-tokyo-comment/30 text-xs truncate"
              >
                {skill}
              </Badge>
            ))}
            {certification.skills.length > 3 && (
              <Badge
                variant="secondary"
                className="bg-tokyo-purple/20 text-tokyo-purple border-tokyo-purple/50 text-xs flex-shrink-0 font-semibold shadow-sm hover:shadow-tokyo-purple/30 transition-shadow"
              >
                +{certification.skills.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </ScaleOnHover>
  )
}

interface CertificationModalProps {
  certification: CertificationType
  isOpen: boolean
  onClose: () => void
}

const CertificationModal: React.FC<CertificationModalProps> = ({
  certification,
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader>
        <ModalTitle className="text-xl sm:text-2xl flex items-center gap-2">
          <Award size={24} className="text-tokyo-purple" />
          {certification.title}
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          {certification.coverImage && (
            <div className="relative aspect-video max-h-[180px] overflow-hidden rounded-lg bg-tokyo-bg-light">
              <img
                src={certification.coverImage}
                alt={certification.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <span className="text-tokyo-fg-dark text-xs">Issued by:</span>
              <div className="text-tokyo-cyan font-semibold">
                {certification.issuingOrganization}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-tokyo-fg-dark text-xs">Year:</span>
              <div className="text-tokyo-fg font-semibold">
                {certification.year}
              </div>
            </div>
          </div>

          <div>
            <p className="text-tokyo-fg-dark text-sm leading-relaxed">
              {certification.description}
            </p>
          </div>

          <div>
            <h4 className="text-base font-semibold text-tokyo-fg mb-2">
              Skills Covered
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {certification.skills.map((skill, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-tokyo-bg-light border-tokyo-comment/30 text-xs"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex gap-3">
          {certification.certificateUrl && (
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                onClick={() =>
                  window.open(certification.certificateUrl, '_blank')
                }
                className="bg-tokyo-purple hover:bg-tokyo-purple/80 transition-all duration-300 text-sm"
              >
                <ExternalLink size={16} className="mr-2" />
                View Certificate
              </Button>
            </motion.div>
          )}
        </div>
      </ModalFooter>
    </Modal>
  )
}

export const Certifications: React.FC = () => {
  const [certifications, setCertifications] = useState<CertificationType[]>([])
  const [selectedCertification, setSelectedCertification] =
    useState<CertificationType | null>(null)
  const [showFeatured, setShowFeatured] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await portfolioService.getAllCertifications()
        setCertifications(data)
      } catch (error) {
        console.error('Error fetching certifications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const displayedCertifications = showFeatured
    ? certifications.filter((cert) => cert.featured)
    : certifications

  if (loading) {
    return (
      <section id="certifications" className="py-20 bg-tokyo-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-tokyo-purple border-t-transparent rounded-full" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="certifications" className="py-20 bg-tokyo-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-tokyo-fg mb-4">
              Certifications & Awards
            </h2>
            <p className="text-tokyo-fg-dark text-lg max-w-2xl mx-auto">
              Professional certifications and achievements that validate my
              expertise
            </p>
          </div>
        </FadeIn>

        <div className="flex justify-center gap-4 mb-12">
          <Button
            onClick={() => setShowFeatured(true)}
            variant={showFeatured ? 'default' : 'outline'}
            className={
              showFeatured
                ? 'bg-tokyo-purple hover:bg-tokyo-purple/80'
                : 'hover:border-tokyo-purple hover:text-tokyo-purple'
            }
          >
            <Star
              size={18}
              className="mr-2"
              fill={showFeatured ? 'currentColor' : 'none'}
            />
            Featured
          </Button>
          <Button
            onClick={() => setShowFeatured(false)}
            variant={!showFeatured ? 'default' : 'outline'}
            className={
              !showFeatured
                ? 'bg-tokyo-purple hover:bg-tokyo-purple/80'
                : 'hover:border-tokyo-purple hover:text-tokyo-purple'
            }
          >
            All Certifications
          </Button>
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            showFeatured
              ? 'lg:grid-cols-3'
              : 'lg:grid-cols-3 xl:grid-cols-4'
          } gap-6`}
        >
          {displayedCertifications.map((cert, index) => (
            <ScrollReveal key={cert.id || index} delay={index * 0.1}>
              <CertificationCard
                certification={cert}
                onClick={() => setSelectedCertification(cert)}
              />
            </ScrollReveal>
          ))}
        </div>

        {displayedCertifications.length === 0 && !loading && (
          <div className="text-center py-12 text-tokyo-comment">
            <Award size={48} className="mx-auto mb-4 opacity-50" />
            <p>
              {showFeatured
                ? 'No featured certifications available'
                : 'No certifications available'}
            </p>
          </div>
        )}
      </div>

      {selectedCertification && (
        <CertificationModal
          certification={selectedCertification}
          isOpen={!!selectedCertification}
          onClose={() => setSelectedCertification(null)}
        />
      )}
    </section>
  )
}
