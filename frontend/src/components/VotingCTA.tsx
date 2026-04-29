'use client'

import { motion } from 'framer-motion'
import { Heart, ArrowRight, Trophy } from 'lucide-react'
import Link from 'next/link'

const VotingCTA = () => {
  return (
    <section className="py-20 sm:py-24 bg-gray-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 decorative-pattern opacity-[0.03]" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-red-100 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-green-100 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-200 bg-red-50 text-red-600 text-xs font-bold tracking-widest uppercase mb-6">
              <Trophy className="w-3.5 h-3.5" />
              Get Involved Now
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Your Vote Shapes <span className="text-red-600">Our Culture</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
              Support talented individuals and groups showcasing Kenya&apos;s diverse cultural heritage. Every vote celebrates the beauty of purpose and the power of heritage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/voting"
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                <Heart className="w-5 h-5" />
                <span>Vote Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-full font-bold transition-all duration-300 hover:border-red-300"
              >
                <span>View Events</span>
              </Link>
            </div>
          </motion.div>

          {/* Visual Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { number: '4', label: 'Active Competitions', color: 'bg-red-600' },
              { number: '15+', label: 'Participants', color: 'bg-green-600' },
              { number: '2K+', label: 'Votes Cast', color: 'bg-gray-900' },
              { number: '100%', label: 'Free to Vote', color: 'bg-yellow-500' }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${item.color} rounded-2xl p-6 text-white text-center shadow-lg`}
              >
                <div className="text-3xl sm:text-4xl font-bold mb-1">{item.number}</div>
                <div className="text-xs sm:text-sm font-medium opacity-90">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default VotingCTA
