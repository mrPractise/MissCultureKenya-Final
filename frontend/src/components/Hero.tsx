'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, Play } from 'lucide-react'
import { useRef } from 'react'

const Hero = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-red-900/90 via-black/80 to-green-900/90">
          <div className="w-full h-full bg-cover bg-center bg-no-repeat mix-blend-overlay" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1920&h=1080&fit=crop)' }} />
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-500/20 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-green-500/20 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-red-500/20 rounded-full blur-[80px] animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6 inline-block"
          >
            <span className="px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-sm font-medium tracking-wider uppercase text-yellow-400">
              Welcome to Miss Culture Global Kenya
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight drop-shadow-2xl tracking-tight">
            Embodying the Spirit of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-green-500 mt-2 pb-2">Kenya</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto px-4 drop-shadow-lg font-light leading-relaxed">
            Celebrating Global Culture through Kenya's Rich Heritage, Unity, and Diversity
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(220, 38, 38, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center space-x-3 shadow-colored-red overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Play size={24} className="fill-current" />
              <span className="relative z-10">Watch My Journey</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="group border-2 border-white/30 backdrop-blur-md bg-white/5 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:border-white/60"
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
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer"
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
