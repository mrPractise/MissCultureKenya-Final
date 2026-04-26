'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Compass, User, ArrowRight, Globe } from 'lucide-react'

const Highlights = () => {
  const highlights = [
    {
      title: 'Kenya Overview',
      description: 'Explore Our Kenya, Our Culture, and Global Stage in one clean, photo-led page.',
      icon: Compass,
      href: '/kenya',
      image: '',
      color: 'from-green-600 to-emerald-700'
    },
    {
      title: 'The Ambassador',
      description: 'Meet Susan, the inspiring individual who represents Kenya\'s cultural heritage and values globally.',
      icon: User,
      href: '/ambassador',
      image: '',
      color: 'from-red-600 to-red-700'
    }
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 decorative-pattern opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Explore Our <span className="text-gradient-green">World</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
            Journey through Kenya's rich heritage, vibrant culture, global achievements, 
            and meet the ambassador who represents our beautiful nation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7 lg:gap-8 max-w-4xl mx-auto">
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={highlight.href}>
                <div className="relative h-full overflow-hidden rounded-2xl shadow-elegant hover:shadow-elegant-lg transition-all duration-300 bg-white/95 backdrop-blur-sm transform hover:-translate-y-2 border border-gray-100/70">
                  <div className="relative h-48">
                    <img
                      src={highlight.image}
                      alt={highlight.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${highlight.color} opacity-80`} />
                    <div className="absolute top-4 left-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <highlight.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-lg sm:text-xl font-bold mb-2">{highlight.title}</h3>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col min-h-[220px]">
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base leading-relaxed">
                      {highlight.description}
                    </p>
                    <div className="mt-auto flex items-center text-red-600 font-semibold group-hover:text-red-700 transition-colors duration-200">
                      <span>Explore More</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Global Network Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-10 sm:mt-14 max-w-4xl mx-auto"
        >
          <a
            href="https://misscultureglobal.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-5 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-red-900 hover:via-red-800 hover:to-green-900 rounded-2xl p-5 sm:p-6 shadow-elegant hover:shadow-elegant-lg transition-all duration-500 border border-gray-700/50 hover:border-red-600/40"
          >
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-red-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-base sm:text-lg mb-0.5 group-hover:text-yellow-300 transition-colors">
                Part of the Miss Culture Global Network
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Miss Culture Global Kenya is a proud franchise of Miss Culture Global — an international cultural diplomacy platform. Visit the global platform to discover our worldwide mission.
              </p>
            </div>
            <div className="flex-shrink-0 hidden sm:flex">
              <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </a>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              href="/gallery"
              className="bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white text-gray-700 hover:text-red-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base shadow-elegant hover:shadow-elegant-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              View Gallery
            </Link>
            <Link
              href="/events"
              className="bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white text-gray-700 hover:text-red-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base shadow-elegant hover:shadow-elegant-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Upcoming Events
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Highlights
