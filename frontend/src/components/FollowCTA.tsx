'use client'

import { motion } from 'framer-motion'
import { Instagram, Facebook, Twitter, Youtube, Mail } from 'lucide-react'

const FollowCTA = () => {
  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/misscultureglobalkenya',
      color: 'from-pink-500 to-purple-600',
      hoverColor: 'from-pink-600 to-purple-700'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://facebook.com/misscultureglobalkenya',
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'from-blue-700 to-blue-800'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: 'https://twitter.com/missculturekenya',
      color: 'from-blue-400 to-blue-500',
      hoverColor: 'from-blue-500 to-blue-600'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      href: 'https://youtube.com/misscultureglobalkenya',
      color: 'from-red-500 to-red-600',
      hoverColor: 'from-red-600 to-red-700'
    }
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-green-600 via-green-700 to-yellow-600 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 decorative-pattern opacity-10" />
      <div className="absolute top-10 right-10 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-green-400/20 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Follow My Journey
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-green-100 mb-10 sm:mb-12 max-w-3xl mx-auto drop-shadow-md leading-relaxed">
            Stay connected with Susan's cultural journey, behind-the-scenes moments, 
            and the latest updates from Miss Culture Global Kenya.
          </p>

          {/* Social Media Links */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 sm:mb-12">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`inline-flex items-center space-x-3 bg-gradient-to-r ${social.color} hover:bg-gradient-to-r ${social.hoverColor} text-white px-5 sm:px-6 py-3.5 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 shadow-elegant hover:shadow-elegant-lg border border-white/20`}
              >
                <social.icon className="w-6 h-6" />
                <span>{social.name}</span>
              </motion.a>
            ))}
          </div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-elegant border border-white/20"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay Updated
            </h3>
            <p className="text-green-100 mb-6">
              Get the latest news, cultural insights, and event updates delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-full text-gray-900 placeholder-gray-500 bg-white/95 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(234, 179, 8, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
              >
                <Mail className="w-5 h-5" />
                <span>Subscribe</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Hashtag */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <p className="text-green-100 text-lg mb-4">
              Share your cultural moments with us
            </p>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/30">
              <span className="text-white font-bold text-xl drop-shadow-md">
                #MissCultureGlobalKenya
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default FollowCTA
