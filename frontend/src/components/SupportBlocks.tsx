'use client'

import { motion } from 'framer-motion'
import { Handshake, Heart, ArrowRight, Globe, Users, Award } from 'lucide-react'
import Link from 'next/link'

const SupportBlocks = () => {
  return (
    <section className="py-20 sm:py-24 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 decorative-pattern opacity-[0.03]" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-100 rounded-full blur-3xl opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-green-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
            Be Part of the Mission
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Support Our <span className="text-red-600">Cause</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you are a brand looking to partner or an individual wanting to contribute, there is a place for you in our mission.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Partnership Block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="group relative bg-gray-900 rounded-3xl p-8 sm:p-10 text-white overflow-hidden hover:shadow-2xl transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-600/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                <Handshake className="w-7 h-7 text-yellow-400" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                Partner With Us
              </h3>
              <p className="text-gray-300 leading-relaxed mb-8">
                Align your brand with values of integrity, diversity, and national pride. Gain targeted visibility, CSR impact, and access to our global network.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Globe, label: 'Global Reach' },
                  { icon: Users, label: 'Community CSR' },
                  { icon: Award, label: 'Brand Prestige' }
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <item.icon className="w-5 h-5 text-yellow-400" />
                    </div>
                    <p className="text-xs text-gray-400">{item.label}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/partnership"
                className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-full font-bold transition-all duration-300 group/btn"
              >
                <span>Explore Partnership</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Contribute Block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
            className="group relative bg-green-50 rounded-3xl p-8 sm:p-10 border border-green-100 overflow-hidden hover:shadow-2xl transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/50 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Make a Contribution
              </h3>
              <p className="text-gray-600 leading-relaxed mb-8">
                Your donation directly supports cultural preservation, youth empowerment, and community development across Kenya.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'Preserve traditional arts and music',
                  'Fund youth mentorship programs',
                  'Support community outreach'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/contribute"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-bold transition-all duration-300 group/btn shadow-lg hover:shadow-xl"
              >
                <span>Contribute Now</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default SupportBlocks
