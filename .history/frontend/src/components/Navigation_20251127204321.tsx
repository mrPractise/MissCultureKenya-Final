'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Globe, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Our Kenya', href: '/our-kenya' },
    { name: 'Our Culture', href: '/our-culture' },
    { name: 'Global Stage', href: '/global-stage' },
    { name: 'The Ambassador', href: '/ambassador' },
    { name: 'Events', href: '/events' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'Voting', href: '/voting' },
    { name: 'Partnership', href: '/partnership' },
    { name: 'Contribute', href: '/contribute' },
    { name: 'Contact', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'About', href: '/about' },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-elegant border-b border-white/20'
          : 'bg-transparent py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Globe className={`h-8 w-8 transition-colors duration-300 ${scrolled ? 'text-red-600' : 'text-white group-hover:text-red-400'}`} />
                <div className="absolute inset-0 bg-red-600 rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
              </div>
              <span className={`text-lg sm:text-xl font-bold transition-colors duration-300 ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                Miss Culture Global Kenya
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 group overflow-hidden ${scrolled ? 'text-gray-700 hover:text-red-600' : 'text-white/90 hover:text-white'
                    }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  <span className={`absolute inset-0 bg-gradient-to-r from-red-600/10 to-green-600/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full ${!scrolled && 'bg-white/10'}`} />
                </Link>
              ))}

              {/* More Menu for remaining items could go here, but for now we'll rely on mobile menu or just hide less important ones on smaller desktop */}
            </div>

            {/* Mobile Menu Toggle - Visible on smaller screens */}
            <div className="lg:hidden">
              {/* This is handled by the floating button below for mobile, 
                  but we might want a standard hamburger for tablet/desktop if needed.
                  For now, keeping the design consistent with the floating button.
              */}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation - Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full shadow-lg shadow-red-600/30 flex items-center justify-center"
        aria-label="Toggle menu"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Plus size={28} strokeWidth={2.5} />
        </motion.div>
      </motion.button>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-50 overflow-y-auto border-l border-white/20"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-bold text-gray-900">Menu</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={24} className="text-gray-500" />
                  </button>
                </div>

                {/* Navigation items */}
                <div className="space-y-1">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className="block px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium text-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Social Links or Contact Info could go here */}
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <p className="text-sm text-gray-500 text-center">
                    © {new Date().getFullYear()} Miss Culture Global Kenya
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation
