'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Plus, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const shouldUseSolidNav = true // Always use solid nav as per user request to avoid overlap

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Kenya', href: '/kenya' },
    { name: 'Ambassador', href: '/ambassador' },
    { name: 'Events', href: '/events' },
    { name: 'Gallery', href: '/gallery' },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-elegant py-1' 
            : 'bg-white border-b border-gray-100 py-2'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center group py-1" aria-label="Miss Culture Global Kenya home">
              <div className="relative h-12 w-28 sm:h-14 sm:w-32 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/official-logo.png"
                  alt="Miss Culture Global Kenya logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 120px, 140px"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-1 2xl:space-x-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 group overflow-hidden ${
                      isActive ? 'text-red-600 bg-red-50' : 'text-gray-700 hover:text-red-600'
                    }`}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {!isActive && (
                      <span className="absolute inset-0 bg-red-600/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Mobile Menu Toggle - Visible on smaller screens */}
            <div className="xl:hidden">
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
        className="xl:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-red-600 text-white rounded-full shadow-lg shadow-red-600/30 flex items-center justify-center"
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-[70] overflow-y-auto border-l border-white/20"
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
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          className={`block px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-lg ${isActive
                            ? 'text-red-600 bg-red-50 border-l-4 border-red-600'
                            : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                            }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Social Links or Contact Info could go here */}
                <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                  <a
                    href="https://misscultureglobal.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-red-50 rounded-xl text-gray-600 hover:text-red-600 font-medium text-sm transition-all duration-200"
                  >
                    <Globe className="w-5 h-5" />
                    <span>Miss Culture Global (Parent Organisation)</span>
                  </a>
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
