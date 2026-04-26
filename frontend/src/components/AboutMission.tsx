'use client'

import { motion } from 'framer-motion'
import { Heart, Globe, Users } from 'lucide-react'

const AboutMission = () => {
  const features = [
    {
      icon: Heart,
      title: 'Cultural Heritage',
      description: 'Preserving and celebrating Kenya\'s rich cultural traditions and values.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Representing Kenya on the world stage with grace and authenticity.'
    },
    {
      icon: Users,
      title: 'Community Unity',
      description: 'Bringing together diverse communities through shared cultural experiences.'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            About Our Mission
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Miss Culture Global Kenya represents the beautiful tapestry of Kenya's diverse cultures, 
            promoting unity, heritage, and global understanding through cultural exchange and community engagement.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <feature.icon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutMission
