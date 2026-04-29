'use client'

import { motion } from 'framer-motion'
import { Users, Globe, Heart, MapPin } from 'lucide-react'

const ImpactStats = () => {
  const stats = [
    {
      number: '500+',
      label: 'Artisans Supported',
      description: 'Sustainable income through cultural crafts',
      icon: Heart
    },
    {
      number: '1,000+',
      label: 'Youth Engaged',
      description: 'Empowering the next generation of cultural ambassadors',
      icon: Users
    },
    {
      number: '50+',
      label: 'Countries Reached',
      description: 'Promoting Kenyan culture on the global stage',
      icon: Globe
    },
    {
      number: '100+',
      label: 'Communities Impacted',
      description: 'Strengthening local cultural preservation efforts',
      icon: MapPin
    }
  ]

  return (
    <section className="py-12 sm:py-16 bg-green-900 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-300 text-xs font-bold tracking-widest uppercase mb-4">
            Our Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Making a <span className="text-red-500">Difference</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-1">
                {stat.number}
              </div>
              <div className="text-sm sm:text-base font-semibold text-white mb-1">
                {stat.label}
              </div>
              <div className="text-xs sm:text-sm text-green-200">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ImpactStats
