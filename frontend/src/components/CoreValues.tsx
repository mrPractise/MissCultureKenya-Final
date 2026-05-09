'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, Heart, Sparkles, Award } from 'lucide-react'

const CoreValues = () => {
  const values = [
    {
      title: '1. Empowerment',
      description: 'We are committed to equipping young women and youth with the confidence, skills, and opportunities needed to lead and succeed.',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: '2. Leadership & Integrity',
      description: 'We nurture ethical, responsible, and visionary leaders who positively influence society.',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: '3. Cultural Pride & Diversity',
      description: 'We celebrate and promote Kenya\'s rich cultural heritage while embracing diversity and inclusion.',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: '4. Professionalism & Etiquette',
      description: 'We uphold high standards of conduct, grooming, communication, and personal branding.',
      icon: Sparkles,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: '5. Excellence',
      description: 'We strive for quality, innovation, and continuous improvement in all our programs and partnerships.',
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ]

  return (
    <section className="py-20 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-red-600 font-bold tracking-widest uppercase text-sm"
          >
            What We Stand For
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-6"
          >
            Our Core <span className="text-red-600">Pillars</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto text-lg font-light"
          >
            The strategic pillars that guide our mission and shape our approach to cultural representation.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl border border-gray-100 bg-white hover:border-red-100 hover:shadow-elegant-lg transition-all duration-500 group"
            >
              <div className={`w-14 h-14 ${value.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <value.icon className={`w-7 h-7 ${value.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CoreValues
