'use client'

import { motion } from 'framer-motion'
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react'

const FollowCTA = () => {
  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/misscultureglobalkenya',
      color: 'bg-red-600',
      hoverColor: 'bg-red-700'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://facebook.com/misscultureglobalkenya',
      color: 'bg-green-600',
      hoverColor: 'bg-green-700'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: 'https://twitter.com/missculturekenya',
      color: 'bg-gray-900',
      hoverColor: 'bg-black'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      href: 'https://youtube.com/misscultureglobalkenya',
      color: 'bg-red-700',
      hoverColor: 'bg-red-800'
    }
  ]

  return (
    <section className="py-20 sm:py-24 bg-white relative overflow-hidden border-t border-gray-100">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-red-200 bg-red-50 text-red-600 text-xs sm:text-sm font-bold tracking-widest uppercase mb-6">
            Stay Connected
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Follow My <span className="text-red-600">Journey</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Be part of Susan&apos;s mission to celebrate Kenyan heritage on the global stage.
            Join our community for exclusive updates and cultural stories.
          </p>

          {/* Social Media Links */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
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
                className={`inline-flex items-center space-x-3 ${social.color} hover:${social.hoverColor} text-white px-5 sm:px-6 py-3.5 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                <social.icon className="w-6 h-6" />
                <span>{social.name}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FollowCTA
