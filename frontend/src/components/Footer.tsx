'use client'

import { motion } from 'framer-motion'
import { Globe, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    about: [
      { name: 'Our Kenya', href: '/our-kenya' },
      { name: 'Our Culture', href: '/our-culture' },
      { name: 'Global Stage', href: '/global-stage' },
      { name: 'The Ambassador', href: '/ambassador' },
      { name: 'About Us', href: '/about' }
    ],
    explore: [
      { name: 'Gallery', href: '/gallery' },
      { name: 'Events', href: '/events' },
      { name: 'Voting', href: '/voting' },
      { name: 'Partnership', href: '/partnership' },
      { name: 'Blog', href: '/blog' }
    ],
    connect: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'Partnership', href: '/partnership' },
      { name: 'Contribute', href: '/contribute' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Media Inquiries', href: '/media' },
      { name: 'Privacy Policy', href: '/privacy' }
    ]
  }

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/misscultureglobalkenya' },
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/misscultureglobalkenya' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/missculturekenya' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/misscultureglobalkenya' }
  ]

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 decorative-pattern opacity-5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-2 mb-6 group cursor-pointer">
                <div className="relative">
                  <Globe className="h-8 w-8 text-red-400 group-hover:text-red-500 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-red-400 rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                </div>
                <span className="text-xl sm:text-2xl font-bold">
                  Miss Culture Global Kenya
                </span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md text-sm sm:text-base">
                Embodying the spirit of Kenya and celebrating global culture through 
                heritage, unity, and international understanding.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center group-hover:bg-red-500/30 transition-colors duration-300">
                    <Mail className="w-5 h-5 text-red-400" />
                  </div>
                  <span className="text-gray-300 text-sm sm:text-base">info@misscultureglobalkenya.com</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center group-hover:bg-green-500/30 transition-colors duration-300">
                    <Phone className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-gray-300 text-sm sm:text-base">+254 700 000 000</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors duration-300">
                    <MapPin className="w-5 h-5 text-yellow-400" />
                  </div>
                  <span className="text-gray-300 text-sm sm:text-base">Nairobi, Kenya</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* About Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-base sm:text-lg font-semibold mb-6">About</h3>
              <ul className="space-y-3">
                {footerLinks.about.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-red-400 transition-colors duration-200 text-sm sm:text-base"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Explore Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-base sm:text-lg font-semibold mb-6">Explore</h3>
              <ul className="space-y-3">
                {footerLinks.explore.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-red-400 transition-all duration-200 text-sm sm:text-base relative inline-block group"
                    >
                      <span className="relative z-10">{link.name}</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-green-400 group-hover:w-full transition-all duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Connect Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-base sm:text-lg font-semibold mb-6">Connect</h3>
              <ul className="space-y-3">
                {footerLinks.connect.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-red-400 transition-all duration-200 text-sm sm:text-base relative inline-block group"
                    >
                      <span className="relative z-10">{link.name}</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-green-400 group-hover:w-full transition-all duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-xs sm:text-sm mb-4 md:mb-0 text-center md:text-left">
              © {currentYear} Miss Culture Global Kenya. All rights reserved.
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end space-x-3 sm:space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-colored-red transform hover:-translate-y-1"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
