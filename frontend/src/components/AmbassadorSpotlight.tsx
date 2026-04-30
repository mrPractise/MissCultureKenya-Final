'use client'

import { motion } from 'framer-motion'
import { Award, ArrowRight, Quote, User } from 'lucide-react'
import Link from 'next/link'
import { useSiteSettings } from '@/lib/useSiteSettings'

const AmbassadorSpotlight = () => {
  const settings = useSiteSettings()

  return (
    <section className="py-20 sm:py-24 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-100 rounded-full blur-3xl opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-green-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
            The Human Face of Our Mission
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet Our <span className="text-red-600">Ambassador</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The inspiring individual who represents Kenya&apos;s cultural heritage and values on the global stage.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-5xl mx-auto">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-green-600/10 rounded-3xl rotate-2 group-hover:rotate-3 transition-transform duration-500" />
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              {(settings.ambassador_profile_image_url || settings.home_ambassador_highlight_image_url) ? (
                <img
                  src={(settings.ambassador_profile_image_url || settings.home_ambassador_highlight_image_url) as string}
                  alt="Susan - Miss Culture Global Kenya Ambassador"
                  className="w-full h-[500px] object-cover"
                />
              ) : (
                <div className="w-full h-[500px] bg-green-100 flex items-center justify-center">
                  <User className="w-20 h-20 text-green-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold">Susan</p>
                      <p className="text-white/80 text-sm">Miss Culture Global Kenya</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative bg-gray-50 rounded-3xl p-8 sm:p-10 border border-gray-100">
              <Quote className="w-10 h-10 text-red-200 mb-4" />
              <blockquote className="text-xl sm:text-2xl text-gray-800 font-medium leading-relaxed mb-6">
                &ldquo;I believe in the power of heritage to transform lives. When we celebrate our culture, we don&apos;t just preserve the past — we build the future.&rdquo;
              </blockquote>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Susan</p>
                  <p className="text-green-600 text-sm font-medium">Cultural Ambassador</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-8">
                A passionate advocate for Kenya&apos;s cultural heritage, Susan represents the beauty and diversity of our nation on the global stage. Through authentic storytelling and genuine connection, she bridges divides and builds understanding across continents.
              </p>
              <Link
                href="/ambassador"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                <span>Explore Susan&apos;s Journey</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AmbassadorSpotlight
