'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, Instagram, Facebook, Twitter, Youtube, MessageCircle, HelpCircle, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import ContactModal from '@/components/ContactModal'

const ContactPage = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'info@misscultureglobalkenya.com',
      description: 'Send us an email and we\'ll respond within 24 hours'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+254 700 000 000',
      description: 'Monday to Friday, 9:00 AM to 5:00 PM EAT'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'Nairobi, Kenya',
      description: 'We\'re located in the heart of Kenya\'s capital city'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Mon - Fri: 9:00 AM - 5:00 PM',
      description: 'EAT (East Africa Time)'
    }
  ]

  const faqData = [
    {
      question: "How can I become a partner with Miss Culture Global Kenya?",
      answer: "We welcome partnerships from organizations that share our vision of promoting Kenyan culture globally. Please contact us through our partnership inquiry form or email us directly at partnerships@misscultureglobalkenya.com"
    },
    {
      question: "How do I book Susan for an event?",
      answer: "To book Susan for your event, please contact us at least 30 days in advance. You can use our event booking form or call us directly. We'll discuss your requirements and provide a customized proposal."
    },
    {
      question: "Do you offer media interviews?",
      answer: "Yes, we welcome media inquiries and interviews. Please contact our media team at media@misscultureglobalkenya.com with your request, including the topic, format, and preferred timeline."
    },
    {
      question: "How can I support the organization?",
      answer: "You can support us through partnerships, donations, volunteering, or by spreading awareness about our mission. Visit our partnership page to learn about different ways to get involved."
    },
    {
      question: "What is your response time for inquiries?",
      answer: "We typically respond to all inquiries within 24-48 hours during business days. For urgent matters, please call us directly at +254 700 000 000."
    }
  ]

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/misscultureglobalkenya', color: 'hover:text-pink-600' },
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/misscultureglobalkenya', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/missculturekenya', color: 'hover:text-blue-400' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/misscultureglobalkenya', color: 'hover:text-red-600' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-black/80 to-yellow-900/90 z-10" />
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop)' }}
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
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
              Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
              We'd love to hear from you. Reach out to us for partnerships, media inquiries, or general questions.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
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
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Contact Information
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-6 p-8 bg-white rounded-2xl shadow-elegant hover:shadow-elegant-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-green-100 group"
                  >
                    <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors duration-300">
                      <info.icon className="w-7 h-7 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
                      <p className="text-lg text-green-700 font-medium mb-1">{info.details}</p>
                      <p className="text-gray-600 leading-relaxed">{info.description}</p>
                    </div>
                  </motion.div>
                ))}
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
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500" />

              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Send us a Message
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 focus:bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 focus:bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <div className="relative">
                    <select
                      id="subject"
                      name="subject"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 focus:bg-white appearance-none"
                    >
                      <option value="">Select a subject</option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="media">Media Inquiry</option>
                      <option value="event">Event Booking</option>
                      <option value="general">General Question</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 focus:bg-white resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <motion.button
                  type="button"
                  onClick={() => setIsContactModalOpen(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about Miss Culture Global Kenya
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${openFAQ === index ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <span className={`font-semibold text-lg transition-colors duration-300 ${openFAQ === index ? 'text-green-700' : 'text-gray-900'}`}>
                      {faq.question}
                    </span>
                  </div>
                  <div className={`transform transition-transform duration-300 ${openFAQ === index ? 'rotate-180 text-green-600' : 'text-gray-400'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                <AnimatePresence>
                  {openFAQ === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 pt-2 pl-20">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Follow Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-400">Journey</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              Stay connected with us on social media for the latest updates, behind-the-scenes content, and cultural highlights.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6">
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
                className={`flex items-center space-x-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 group`}
              >
                <social.icon className={`w-6 h-6 transition-colors duration-300 ${social.color.replace('hover:', 'group-hover:')}`} />
                <span className="font-semibold">{social.name}</span>
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
