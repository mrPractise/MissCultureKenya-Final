'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube, ExternalLink } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    about: [
      { name: 'Kenya', href: '/kenya' },
      { name: 'The Ambassador', href: '/ambassador' },
      { name: 'About Us', href: '/about' }
    ],
    explore: [
      { name: 'Gallery', href: '/gallery' },
      { name: 'Events', href: '/events' },
      { name: 'Voting', href: '/voting' },
      { name: 'Partnership', href: '/partnership' },
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
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 decorative-pattern opacity-5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/10 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="mb-6">
                <div className="inline-flex rounded-2xl bg-white/95 p-2 shadow-lg ring-1 ring-white/20">
                  <Image
                    src="/official-logo.png"
                    alt="Miss Culture Global Kenya logo"
                    width={180}
                    height={180}
                    className="h-auto w-[120px] sm:w-[140px]"
                  />
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md text-sm sm:text-base leading-relaxed">
                Embodying the Beauty of Purpose and the Power of Heritage — transforming cultural heritage into a global asset for socio-economic empowerment and international diplomacy.
              </p>

              {/* Franchise Link */}
              <a
                href="https://misscultureglobal.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-700 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-yellow-400 text-xs sm:text-sm transition-all duration-300 mb-8 group"
              >
                <span>A Franchise of</span>
                <span className="font-semibold">Miss Culture Global</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4 group">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-red-500/20 transition-colors duration-300 border border-white/10 group-hover:border-red-500/30">
                    <Mail className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
                  </div>
                  <span className="text-gray-300 text-sm sm:text-base group-hover:text-white transition-colors">info@misscultureglobalkenya.com</span>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-green-500/20 transition-colors duration-300 border border-white/10 group-hover:border-green-500/30">
                    <Phone className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                  </div>
                  <span className="text-gray-300 text-sm sm:text-base group-hover:text-white transition-colors">+254 721 706983</span>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors duration-300 border border-white/10 group-hover:border-yellow-500/30">
                    <MapPin className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                  </div>
                  <span className="text-gray-300 text-sm sm:text-base group-hover:text-white transition-colors">Nairobi, Kenya</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {[
            { title: 'About', links: footerLinks.about, delay: 0.1 },
            { title: 'Explore', links: footerLinks.explore, delay: 0.2 },
            { title: 'Connect', links: footerLinks.connect, delay: 0.3 }
          ].map((section, idx) => (
            <div key={section.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: section.delay }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
                  {section.title}
                  <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-red-600" />
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-all duration-200 text-sm sm:text-base relative inline-block group leading-relaxed"
                      >
                        <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-200 inline-block">{link.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Social Media & Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-white/10 mt-16 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} Miss Culture Global Kenya. A franchise of <a href="https://misscultureglobal.org/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">Miss Culture Global</a>. All rights reserved.
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-red-500/30 transform hover:-translate-y-1 group"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
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
