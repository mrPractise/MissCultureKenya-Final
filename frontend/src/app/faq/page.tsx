'use client'

import { motion } from 'framer-motion'
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
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-green-900/80 via-green-800/70 to-yellow-600/80">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat" 
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1920&h=600&fit=crop)' }} 
            />
          </div>
        </div>
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xl sm:text-2xl text-gray-100 max-w-3xl mx-auto">
              Find answers to common questions about Miss Culture Global Kenya and our programs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Have Questions?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've compiled answers to the most common questions we receive. If you can't find what you're looking for, please contact us.
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-elegant overflow-hidden"
              >
                <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="mr-3 text-green-600">{category.icon}</span>
                    {category.title}
                  </h3>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {category.faqs.map((faq, index) => {
                    const globalIndex = categoryIndex * 10 + index
                    return (
                      <div key={index} className="px-6">
                        <button
                          className="w-full py-6 text-left flex justify-between items-center focus:outline-none"
                          onClick={() => toggleAccordion(globalIndex)}
                        >
                          <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                          <ChevronDown 
                            className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${
                              openIndex === globalIndex ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                        
                        <motion.div
                          initial={false}
                          animate={{ 
                            height: openIndex === globalIndex ? 'auto' : 0,
                            opacity: openIndex === globalIndex ? 1 : 0
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6 -mt-4 text-gray-600">
                            {faq.answer}
                          </div>
                        </motion.div>
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
            className="mt-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-elegant p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Still Have Questions?</h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Our team is here to help. Reach out to us and we'll get back to you as soon as possible.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a 
                href="mailto:info@misscultureglobalkenya.com" 
                className="flex items-center justify-center bg-white text-green-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg transition-colors duration-300"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Us
              </a>
              <a 
                href="tel:+254700000000" 
                className="flex items-center justify-center bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-6 rounded-lg transition-colors duration-300"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default FAQPage