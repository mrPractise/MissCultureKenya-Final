'use client'

import { motion } from 'framer-motion'
import { Sparkles, Handshake, TrendingUp } from 'lucide-react'

const CultureImpact = () => {
  const pillars = [
    {
      title: 'Heritage & Fashion',
      description: 'Showcasing the evolution of Kenyan textiles and craftsmanship — where tradition meets the modern creative economy.',
      icon: Sparkles,
      color: 'bg-red-600',
      hoverColor: 'group-hover:text-red-600'
    },
    {
      title: 'Diplomacy & Peace',
      description: 'Using culture as a tool for national cohesion and international relations — building bridges across borders.',
      icon: Handshake,
      color: 'bg-green-600',
      hoverColor: 'group-hover:text-green-600'
    },
    {
      title: 'Economic Empowerment',
      description: 'Supporting the "Made in Kenya" movement through brand endorsements and entrepreneurial training.',
      icon: TrendingUp,
      color: 'bg-gray-900',
      hoverColor: 'group-hover:text-gray-900'
    }
  ]

  return (
    <section className="py-20 sm:py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-red-600 font-bold tracking-widest uppercase text-sm">Our Approach</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-6">
            Culture with <span className="text-red-600">Impact</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light">
            Three pillars that define how culture drives sustainable development and global unity.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-elegant hover:shadow-elegant-lg transition-all duration-500 p-8 sm:p-10 text-center group border border-gray-100 hover:border-red-100"
            >
              <div className={`w-16 h-16 ${pillar.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <pillar.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-xl sm:text-2xl font-bold text-gray-900 mb-4 ${pillar.hoverColor} transition-colors duration-300`}>
                {pillar.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CultureImpact
