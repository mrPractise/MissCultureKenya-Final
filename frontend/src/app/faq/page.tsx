'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Mail, Phone, Users, Calendar, Heart } from 'lucide-react'
import { useState } from 'react'

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqCategories = [
    {
      title: 'General Information',
      icon: <Heart className="w-5 h-5" />,
      faqs: [
        {
          question: 'What is Miss Culture Global Kenya?',
          answer: 'Miss Culture Global Kenya is a cultural organization dedicated to preserving, promoting, and celebrating Kenya\'s diverse cultural heritage. We work to empower communities, engage youth, and represent Kenya\'s cultural excellence on the global stage.'
        },
        {
          question: 'When was Miss Culture Global Kenya established?',
          answer: 'Miss Culture Global Kenya was established in 2015 with the mission to celebrate and preserve Kenya\'s rich cultural heritage while promoting it globally.'
        },
        {
          question: 'How is Miss Culture Global Kenya different from other pageants?',
          answer: 'Unlike traditional beauty pageants, Miss Culture Global Kenya focuses exclusively on cultural representation, heritage preservation, and community empowerment. Our titleholders are cultural ambassadors who work year-round on meaningful initiatives.'
        }
      ]
    },
    {
      title: 'Participation & Events',
      icon: <Calendar className="w-5 h-5" />,
      faqs: [
        {
          question: 'How can I participate in Miss Culture Global Kenya events?',
          answer: 'We welcome participation from all Kenyans who are passionate about cultural preservation. You can participate by attending our events, volunteering, or applying to represent your community. Check our Events page for upcoming opportunities.'
        },
        {
          question: 'What are the requirements to become Miss Culture Global Kenya?',
          answer: 'Candidates must be Kenyan citizens aged 18-28, have a passion for cultural preservation, and demonstrate leadership qualities. They should also have completed at least secondary education. Detailed requirements are available in our application guidelines.'
        },
        {
          question: 'Do you have events outside Nairobi?',
          answer: 'Yes, we organize events across Kenya to ensure all communities can participate. Our Cultural Heritage Festival travels to different regions annually, and we have community outreach programs in major counties.'
        }
      ]
    },
    {
      title: 'Community Involvement',
      icon: <Users className="w-5 h-5" />,
      faqs: [
        {
          question: 'How can my community get involved with Miss Culture Global Kenya?',
          answer: 'Communities can get involved by hosting local cultural events, participating in our outreach programs, or nominating cultural ambassadors. We also welcome partnerships with local leaders and organizations.'
        },
        {
          question: 'Do you work with local artisans and craftspeople?',
          answer: 'Absolutely! Supporting local artisans is a core part of our mission. We provide platforms for artisans to showcase their work, help with marketing, and create sustainable income opportunities through cultural preservation.'
        },
        {
          question: 'Can schools and educational institutions partner with you?',
          answer: 'Yes, we actively collaborate with educational institutions to promote cultural education among youth. We offer school programs, workshops, and scholarship opportunities for students interested in cultural studies.'
        }
      ]
    },
    {
      title: 'Support & Volunteering',
      icon: <Heart className="w-5 h-5" />,
      faqs: [
        {
          question: 'How can I volunteer with Miss Culture Global Kenya?',
          answer: 'We welcome volunteers for our events, community programs, and administrative support. Visit our Volunteer page to learn about current opportunities and how to apply. Volunteers play a crucial role in our success.'
        },
        {
          question: 'What are the different ways to support your mission?',
          answer: 'You can support us through financial contributions, volunteering your time and skills, sponsoring our events, or simply spreading awareness about our work. Every contribution, big or small, makes a difference.'
        },
        {
          question: 'Are donations to Miss Culture Global Kenya tax-deductible?',
          answer: 'Yes, donations to Miss Culture Global Kenya are tax-deductible. We are a registered non-profit organization. Please consult with your tax advisor for specific deductions applicable to your situation.'
        }
      ]
    }
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
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1920&h=1080&fit=crop)' }}
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
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">Questions</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
              Find answers to common questions about Miss Culture Global Kenya and our programs.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute top-20 right-10 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Have Questions?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              We've compiled answers to the most common questions we receive. If you can't find what you're looking for, please contact us.
            </p>
          </motion.div>

          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-elegant overflow-hidden border border-gray-100 hover:shadow-elegant-lg transition-shadow duration-300"
              >
                <div className="bg-gradient-to-r from-green-50 to-white px-8 py-6 border-b border-green-100">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="mr-4 p-2 bg-white rounded-lg shadow-sm text-green-600">{category.icon}</span>
                    {category.title}
                  </h3>
                </div>

                <div className="divide-y divide-gray-100">
                  {category.faqs.map((faq, index) => {
                    const globalIndex = categoryIndex * 10 + index
                    const isOpen = openIndex === globalIndex

                    return (
                      <div key={index} className="px-8 bg-white transition-colors duration-300 hover:bg-gray-50/50">
                        <button
                          className="w-full py-6 text-left flex justify-between items-center focus:outline-none group"
                          onClick={() => toggleAccordion(globalIndex)}
                        >
                          <span className={`text-lg font-medium transition-colors duration-300 ${isOpen ? 'text-green-700' : 'text-gray-900 group-hover:text-green-700'}`}>
                            {faq.question}
                          </span>
                          <div className={`ml-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-green-100 text-green-600 rotate-180' : 'bg-gray-100 text-gray-500 group-hover:bg-green-50 group-hover:text-green-600'}`}>
                            <ChevronDown className="w-5 h-5" />
                          </div>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="pb-8 pt-2 text-gray-600 leading-relaxed border-t border-dashed border-gray-100">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-20 bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl shadow-2xl p-10 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Still Have Questions?</h2>
              <p className="text-xl text-green-50 mb-10 max-w-2xl mx-auto font-light">
                Our team is here to help. Reach out to us and we'll get back to you as soon as possible.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <a
                  href="mailto:info@misscultureglobalkenya.com"
                  className="flex items-center justify-center bg-white text-green-700 hover:bg-gray-50 font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Email Us
                </a>
                <a
                  href="tel:+254700000000"
                  className="flex items-center justify-center bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white font-bold py-4 px-8 rounded-xl transition-all duration-300 backdrop-blur-sm"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default FAQPage