'use client'

import { motion } from 'framer-motion'
import { Heart, Users, Globe, Award } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import ContactModal from '@/components/ContactModal'

const PartnershipPage = () => {
  const impactAreas = [
    {
      title: 'Cultural Preservation',
      description: 'Support traditional arts, music, and cultural practices',
      icon: Heart,
      impact: '500+ artisans supported'
    },
    {
      title: 'Youth Empowerment',
      description: 'Educational programs and leadership development',
      icon: Users,
      impact: '1,000+ youth reached'
    },
    {
      title: 'Global Outreach',
      description: 'International cultural exchange programs',
      icon: Globe,
      impact: '50+ countries reached'
    },
    {
      title: 'Community Development',
      description: 'Local community projects and initiatives',
      icon: Award,
      impact: '100+ communities impacted'
    }
  ]

  const sponsors = [
    {
      name: 'Kenya Tourism Board',
      logo: '/api/placeholder/200/100',
      description: 'Promoting Kenya\'s cultural heritage globally'
    },
    {
      name: 'Safaricom Foundation',
      logo: '/api/placeholder/200/100',
      description: 'Empowering communities through technology'
    },
    {
      name: 'Equity Bank',
      logo: '/api/placeholder/200/100',
      description: 'Supporting youth empowerment programs'
    },
    {
      name: 'KCB Bank',
      logo: '/api/placeholder/200/100',
      description: 'Investing in cultural preservation'
    },
    {
      name: 'Coca-Cola East Africa',
      logo: '/api/placeholder/200/100',
      description: 'Community development partner'
    },
    {
      name: 'Kenya Airways',
      logo: '/api/placeholder/200/100',
      description: 'Connecting Kenya to the world'
    },
    {
      name: 'Tusker',
      logo: '/api/placeholder/200/100',
      description: 'Celebrating Kenyan spirit and culture'
    },
    {
      name: 'Nation Media Group',
      logo: '/api/placeholder/200/100',
      description: 'Media partner for cultural visibility'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            className="w-full h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10" />
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1920&h=600&fit=crop)' }}
            />
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl tracking-tight">
              Partnership & <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">Sponsorship</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto mb-8 rounded-full" />
            <p className="text-lg sm:text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto px-4 drop-shadow-lg font-light leading-relaxed">
              Join us in promoting Kenya's cultural heritage and empowering communities worldwide through meaningful partnerships.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partnership Content */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 decorative-pattern opacity-[0.03]" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Impact Areas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Impact Areas</h2>
              <div className="w-20 h-1 bg-green-500 mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {impactAreas.map((area, index) => (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center group border border-gray-100 hover:border-green-100 transform hover:-translate-y-2"
                >
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-100 transition-colors duration-300">
                    <area.icon className="w-10 h-10 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors duration-300">{area.title}</h3>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">{area.description}</p>
                  <div className="inline-block bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                    {area.impact}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Partnership Opportunities */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Partnership Opportunities</h2>
              <div className="w-20 h-1 bg-green-500 mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 p-10 text-center border border-gray-100 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600" />
                <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3 group-hover:rotate-6 transition-transform duration-300">
                  <Heart className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Event Sponsorship</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Support our cultural events and festivals with your brand visibility and community impact.
                </p>
                <ul className="text-left space-y-4 mb-8 bg-gray-50 p-6 rounded-2xl">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Brand visibility at events</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Social media recognition</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Community impact reports</span>
                  </li>
                </ul>
                <button className="w-full py-3 rounded-xl bg-white border-2 border-green-600 text-green-700 font-bold hover:bg-green-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md">
                  Learn More
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 p-10 text-center border border-gray-100 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-600" />
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3 group-hover:rotate-6 transition-transform duration-300">
                  <Users className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Program Support</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Fund specific programs like youth empowerment, cultural education, or community development.
                </p>
                <ul className="text-left space-y-4 mb-8 bg-gray-50 p-6 rounded-2xl">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Program naming rights</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Progress updates</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Impact measurement</span>
                  </li>
                </ul>
                <button className="w-full py-3 rounded-xl bg-white border-2 border-blue-600 text-blue-700 font-bold hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md">
                  Learn More
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 p-10 text-center border border-gray-100 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-pink-600" />
                <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3 group-hover:rotate-6 transition-transform duration-300">
                  <Globe className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Global Outreach</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Support our international cultural exchange programs and global visibility initiatives.
                </p>
                <ul className="text-left space-y-4 mb-8 bg-gray-50 p-6 rounded-2xl">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">International recognition</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Global media coverage</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Cultural diplomacy</span>
                  </li>
                </ul>
                <button className="w-full py-3 rounded-xl bg-white border-2 border-purple-600 text-purple-700 font-bold hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md">
                  Learn More
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Our Sponsors Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-24 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden"
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Our Valued <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Sponsors</span>
                </h2>
                <p className="text-xl text-green-100 max-w-3xl mx-auto font-light leading-relaxed">
                  We are grateful to our sponsors who believe in our mission and support us in promoting Kenya's cultural heritage worldwide.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sponsors.map((sponsor, index) => (
                  <motion.div
                    key={sponsor.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-6 hover:bg-white/20 transition-all duration-300 group cursor-pointer text-center"
                  >
                    <div className="mb-6 h-20 flex items-center justify-center bg-white rounded-xl p-4 group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="max-h-full w-auto object-contain"
                      />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">
                      {sponsor.name}
                    </h4>
                    <p className="text-sm text-green-100 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      {sponsor.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-16 text-center">
                <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Become a Sponsor
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default PartnershipPage
