'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, Play, ExternalLink } from 'lucide-react'
import { useRef } from 'react'
import { useSiteSettings } from '@/lib/useSiteSettings'

const Hero = () => {
  const ref = useRef(null)
  const settings = useSiteSettings()
  const heroImage = settings.home_hero_image_url || '/hero-bg.png'
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <section ref={ref} className="relative min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row items-stretch overflow-hidden bg-black">
      {/* Background Image Container */}
      <motion.div 
        style={{ y, opacity }} 
        className="absolute inset-0 lg:relative lg:inset-auto lg:w-1/2 lg:order-2 z-0"
      >
        <div className="w-full h-full relative">
          {heroImage ? (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center lg:bg-[center_top] bg-no-repeat transition-opacity duration-1000" 
                style={{ backgroundImage: `url(${heroImage})`, opacity: 1.0 }} 
              />
              {/* Mobile Overlay */}
              <div className="absolute inset-0 bg-black/40 lg:hidden" />
              {/* Desktop subtle fade to merge with left side if needed, or keep it clean */}
              <div className="absolute inset-y-0 left-0 w-32 bg-black/20 hidden lg:block" />
            </>
          ) : (
            <div className="w-full h-full bg-black" />
          )}
        </div>
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 flex-1 flex items-center justify-center lg:justify-start lg:order-1 px-4 sm:px-6 lg:px-8 xl:pl-24 pt-12 pb-12 sm:pt-16 sm:pb-16 lg:py-0">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl lg:max-w-xl xl:max-w-2xl text-center lg:text-left"
        >
          {/* Franchise Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-5 flex justify-center lg:justify-start"
          >
            <a
              href="https://misscultureglobal.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-400/40 bg-yellow-400/10 backdrop-blur-sm text-xs sm:text-sm font-medium tracking-wide text-yellow-300 hover:bg-yellow-400/20 hover:border-yellow-400/60 transition-all duration-300 group"
            >
              <span>A Franchise of</span>
              <span className="font-semibold">Miss Culture Global</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6 inline-block"
          >
            <span className="px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-sm font-medium tracking-wider uppercase text-red-400">
              Welcome to Miss Culture Global Kenya
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-6 sm:mb-8 leading-tight drop-shadow-2xl tracking-tight text-white">
            Embodying the Spirit of
            <span className="block text-red-600 mt-2 pb-2 filter drop-shadow-[0_0_20px_rgba(220,38,38,0.3)]">Kenya</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl mb-8 sm:mb-10 text-gray-200 max-w-3xl lg:mx-0 mx-auto px-2 sm:px-0 drop-shadow-lg font-light leading-relaxed">
            Celebrating <span className="text-white font-medium">Global Culture</span> through The Beauty of Purpose and The Power of Heritage
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start items-center">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(220, 38, 38, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-red-600 hover:bg-red-700 text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 flex items-center space-x-3 shadow-colored-red overflow-hidden border border-white/20"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Play size={24} className="fill-current" />
              <span className="relative z-10">Watch My Journey</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="group border-2 border-white/30 backdrop-blur-md bg-white/5 text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:border-white/60"
            >
              <span className="group-hover:text-yellow-400 transition-colors">Explore Our Culture</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer lg:left-1/4"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
          <ChevronDown size={32} />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
