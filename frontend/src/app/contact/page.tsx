'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, Instagram, Facebook, Twitter, Youtube, MessageCircle, ChevronDown, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import ContactModal from '@/components/ContactModal'
import apiClient from '@/lib/api'
import { useSiteSettings } from '@/lib/useSiteSettings'

const contactInfo = [
  {
    icon: Mail,
    title: 'Email (Primary)',
    details: 'info@misscultureglobalkenya.org',
    description: 'We respond within 24-48 hours on business days.',
    color: 'bg-green-50 text-green-600',
    priority: 'Best for detailed inquiries'
  },
  {
    icon: Phone,
    title: 'Phone / WhatsApp',
    details: '+254 721 706983',
    description: 'Call or WhatsApp, Mon-Fri 9AM-5PM EAT.',
    color: 'bg-blue-50 text-blue-600',
    priority: 'Best for urgent matters'
  },
  {
    icon: MapPin,
    title: 'Physical Location',
    details: 'Nairobi, Kenya',
    description: 'Visitors welcome by appointment only.',
    color: 'bg-red-50 text-red-600',
    priority: 'In-person meetings'
  },
  {
    icon: MessageCircle,
    title: 'Social Media (Secondary)',
    details: 'Instagram DM or Facebook Messenger',
    description: 'Response times vary; email is faster for urgent matters.',
    color: 'bg-purple-50 text-purple-600',
    priority: 'Casual inquiries'
  }
]

const miniFAQ = [
  { question: 'Looking for event tickets?', answer: 'Visit our Events page for upcoming events and ticketing.', link: '/events' },
  { question: 'Want to vote?', answer: 'Head to the Voting page to cast your vote.', link: '/voting' },
  { question: 'Need a media kit?', answer: 'Download our media kit from the Partnership page.', link: '/partnership' },
  { question: 'Want to donate?', answer: 'Visit the Contribute page for secure donation options.', link: '/contribute' }
]

const subjectOptions = [
  { value: '', label: 'Select a subject' },
  { value: 'General Inquiry', label: 'General Inquiry' },
  { value: 'Partnership Opportunity', label: 'Partnership Opportunity' },
  { value: 'Media Request', label: 'Media Request' },
  { value: 'Event Registration', label: 'Event Registration' },
  { value: 'Volunteering', label: 'Volunteering' },
  { value: 'Donation Question', label: 'Donation Question' },
  { value: 'Technical Issue', label: 'Technical Issue' }
]

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/misscultureglobalkenya', color: 'hover:text-pink-600' },
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/misscultureglobalkenya', color: 'hover:text-blue-600' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/missculturekenya', color: 'hover:text-blue-400' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/misscultureglobalkenya', color: 'hover:text-red-600' }
]

const ContactPage = () => {
  const settings = useSiteSettings()
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[55vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/70 z-10" />
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            className="w-full h-full bg-cover bg-center"
            style={settings.contact_hero_image_url ? { backgroundImage: `url(${settings.contact_hero_image_url})` } : undefined}
          />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl animate-pulse-glow z-10" />
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl animate-pulse-glow delay-1000 z-10" />

        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm sm:text-base uppercase tracking-[0.3em] text-green-400 mb-4 font-semibold">We&apos;re Here to Listen</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
              Let&apos;s <span className="text-red-600">Talk</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
              Questions, partnership inquiries, media requests, or just want to learn more? Reach out — we respond to every message.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="h-1 w-24 bg-red-600 rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute top-20 right-10 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact <span className="text-red-600">Information</span></h2>
              <p className="text-gray-600 mb-8 leading-relaxed">Choose the channel that works best for you. We&apos;ve set clear expectations on response times so you&apos;re never left waiting.</p>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-5 p-6 bg-white rounded-2xl shadow-elegant hover:shadow-elegant-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-green-100 group"
                  >
                    <div className={`w-14 h-14 ${info.color.split(' ')[0]} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <info.icon className={`w-7 h-7 ${info.color.split(' ')[1]}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{info.title}</h3>
                      <p className="text-green-700 font-semibold mb-1">{info.details}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{info.description}</p>
                      <span className="text-xs text-gray-400 mt-1 inline-block">{info.priority}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Business Hours */}
              <div className="mt-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-gray-900">Business Hours</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Monday — Friday</span><span className="font-medium text-gray-900">9:00 AM — 5:00 PM EAT</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Saturday</span><span className="font-medium text-gray-400">Closed</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Sunday</span><span className="font-medium text-gray-400">Closed</span></div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-10 border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-green-600" />

              <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
              <p className="text-gray-600 text-sm mb-8">We route your message to the right person based on the subject you select.</p>

              <form className="space-y-5" onSubmit={async (e) => {
                e.preventDefault()
                setIsSubmitting(true)
                setSubmitStatus('idle')
                try {
                  await apiClient.sendContactMessage({
                    name: `${contactForm.firstName} ${contactForm.lastName}`,
                    email: contactForm.email,
                    phone: contactForm.phone,
                    subject: contactForm.subject,
                    message: contactForm.message,
                    type: contactForm.subject.toLowerCase().includes('partner') ? 'partnership' : contactForm.subject.toLowerCase().includes('media') ? 'media' : 'general',
                  })
                  setSubmitStatus('success')
                  setContactForm({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' })
                } catch {
                  setSubmitStatus('error')
                } finally {
                  setIsSubmitting(false)
                }
              }}>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">First Name *</label>
                    <input type="text" id="firstName" required value={contactForm.firstName} onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 focus:bg-white text-sm" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">Last Name *</label>
                    <input type="text" id="lastName" required value={contactForm.lastName} onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 focus:bg-white text-sm" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                  <input type="email" id="email" required value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 focus:bg-white text-sm" />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <input type="tel" id="phone" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 focus:bg-white text-sm" />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                  <div className="relative">
                    <select id="subject" required value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 focus:bg-white appearance-none text-sm">
                      {subjectOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea id="message" rows={5} required value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 focus:bg-white resize-none text-sm" placeholder="Tell us how we can help you..."></textarea>
                </div>

                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-green-700 font-medium text-sm">Your message has been sent successfully! We will get back to you within 24-48 hours.</p>
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-700 font-medium text-sm">Failed to send message. Please try again or email us directly at info@misscultureglobalkenya.org</p>
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Sending...</span></>
                  ) : (
                    <><Send className="w-5 h-5" /><span>Send Message</span></>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mini-FAQ Section — Deflect Simple Questions */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Before You Reach Out...</h2>
            <p className="text-gray-600">These common questions might save you a step.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {miniFAQ.map((item, index) => (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-100 hover:bg-green-50/30 transition-all duration-200"
              >
                <p className="font-semibold text-gray-900 text-sm mb-1">{item.question}</p>
                <p className="text-gray-600 text-sm mb-3">{item.answer}</p>
                <Link href={item.link} className="text-green-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all duration-200">
                  Go there <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 bg-black relative overflow-hidden text-white">
        <div className="absolute inset-0 decorative-pattern opacity-5" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Follow Our <span className="text-red-600">Journey</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8 text-sm">Stay connected for the latest updates, behind-the-scenes content, and cultural highlights. Response times vary on social — email is faster for urgent matters.</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex items-center space-x-3 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 group`}
              >
                <social.icon className={`w-5 h-5 transition-colors duration-300 ${social.color.replace('hover:', 'group-hover:')}`} />
                <span className="font-semibold text-sm">{social.name}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        type="general"
      />
    </div>
  )
}

export default ContactPage
