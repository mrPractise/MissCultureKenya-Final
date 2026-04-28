'use client'

import { motion } from 'framer-motion'
import { Target, Eye } from 'lucide-react'

const MissionVision = () => {
  return (
    <section className="py-20 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-3xl p-8 sm:p-10 border border-gray-100 hover:border-red-100 hover:shadow-elegant-lg transition-all duration-500 group"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              To identify, mentor, and empower visionary young women who will safeguard Kenyan cultural identity, promote responsible tourism, and foster cross-cultural partnerships that create tangible impact in local communities.
            </p>
            <p className="text-gray-500 leading-relaxed text-sm italic">
              &ldquo;By blending &lsquo;The Beauty of Purpose&rsquo; with &lsquo;The Power of Heritage,&rsquo; we create a stage where culture drives sustainable development and global unity.&rdquo;
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: true }}
            className="bg-green-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/10 rounded-full blur-[60px]" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors duration-300">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">Our Vision</h2>
              </div>
              <p className="text-green-100 leading-relaxed text-lg font-light">
                To be Africa&apos;s premier leadership platform that transforms cultural heritage into a global asset for socio-economic empowerment and international diplomacy.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default MissionVision
