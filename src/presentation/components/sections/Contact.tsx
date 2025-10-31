import React, { useState } from 'react'
import { motion } from 'motion/react'
import { FadeIn, SlideIn } from '../ui/Animations'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Mail, Phone, MapPin, Send, CheckCircle, Github, Linkedin, Twitter } from 'lucide-react'
import { portfolioService } from '../../../core/usecases'
import { isValidEmail, isValidPhone } from '../../../shared/utils/helpers'
import type { ContactSubmissionFormData } from '../../../shared/types'

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactSubmissionFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ContactSubmissionFormData, string>>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContactSubmissionFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email address'
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await portfolioService.createContactSubmission({
        ...formData,
        timestamp: new Date(),
      })
      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
      setErrors({})
      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      setErrors({ message: 'Failed to send message. Please try again.' })
      console.error('Error submitting contact form:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof ContactSubmissionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const socialLinks = [
    { icon: Github, label: 'GitHub', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
  ]

  return (
    <section id="contact" className="py-12 bg-tokyo-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-tokyo-fg mb-4">
              Get In Touch
            </h2>
            <p className="text-tokyo-fg-dark text-lg max-w-2xl mx-auto">
              Have a project in mind or want to collaborate? Feel free to reach
              out!
            </p>
          </div>
        </FadeIn>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <SlideIn direction="left">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-tokyo-fg mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <Card className="hover:border-tokyo-blue transition-all">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-tokyo-blue/20">
                        <Mail size={24} className="text-tokyo-blue" />
                      </div>
                      <div>
                        <p className="text-sm text-tokyo-fg-dark">Email</p>
                        <a
                          href="mailto:your.email@example.com"
                          className="text-tokyo-fg font-semibold hover:text-tokyo-blue transition-colors"
                        >
                          your.email@example.com
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:border-tokyo-cyan transition-all">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-tokyo-cyan/20">
                        <Phone size={24} className="text-tokyo-cyan" />
                      </div>
                      <div>
                        <p className="text-sm text-tokyo-fg-dark">Phone</p>
                        <a
                          href="tel:+1234567890"
                          className="text-tokyo-fg font-semibold hover:text-tokyo-cyan transition-colors"
                        >
                          +1 (234) 567-890
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:border-tokyo-green transition-all">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-tokyo-green/20">
                        <MapPin size={24} className="text-tokyo-green" />
                      </div>
                      <div>
                        <p className="text-sm text-tokyo-fg-dark">Location</p>
                        <p className="text-tokyo-fg font-semibold">
                          City, Country
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="text-xl font-bold text-tokyo-fg mb-4">
                  Connect With Me
                </h4>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.15, rotate: 360 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.6 }}
                      className="relative"
                    >
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-tokyo-blue/30 hover:border-tokyo-blue bg-tokyo-bg-dark/60 hover:bg-tokyo-blue/10 transition-all duration-300 backdrop-blur-sm relative"
                        aria-label={social.label}
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
                        <social.icon className="h-6 w-6 text-tokyo-blue" />
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </SlideIn>

          {/* Contact Form */}
          <SlideIn direction="right">
            <Card className="border-tokyo-comment/20">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-tokyo-fg mb-2"
                    >
                      Name *
                    </label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Your full name"
                      className={errors.name ? 'border-tokyo-red' : ''}
                    />
                    {errors.name && (
                      <p className="text-tokyo-red text-sm mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-tokyo-fg mb-2"
                    >
                      Email *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      className={errors.email ? 'border-tokyo-red' : ''}
                    />
                    {errors.email && (
                      <p className="text-tokyo-red text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-tokyo-fg mb-2"
                    >
                      Phone (Optional)
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+1 (234) 567-890"
                      className={errors.phone ? 'border-tokyo-red' : ''}
                    />
                    {errors.phone && (
                      <p className="text-tokyo-red text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-tokyo-fg mb-2"
                    >
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      placeholder="What's this about?"
                      className={errors.subject ? 'border-tokyo-red' : ''}
                    />
                    {errors.subject && (
                      <p className="text-tokyo-red text-sm mt-1">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-tokyo-fg mb-2"
                    >
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Tell me about your project or idea..."
                      rows={6}
                      className={errors.message ? 'border-tokyo-red' : ''}
                    />
                    {errors.message && (
                      <p className="text-tokyo-red text-sm mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {success && (
                    <div className="bg-tokyo-green/10 border border-tokyo-green text-tokyo-green px-4 py-3 rounded-md flex items-center gap-2">
                      <CheckCircle size={20} />
                      <span>Message sent successfully! I'll get back to you soon.</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-tokyo-blue hover:bg-tokyo-blue/80"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Send size={18} />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </SlideIn>
        </div>
      </div>
    </section>
  )
}
