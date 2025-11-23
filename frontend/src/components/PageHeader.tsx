'use client'

import { motion } from 'framer-motion'

interface PageHeaderProps {
  title: string
  subtitle: string
  backgroundImage: string
}

const PageHeader = ({ title, subtitle, backgroundImage }: PageHeaderProps) => {
  return (
    <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
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
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl tracking-tight">
            {title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-red-500 mx-auto mb-8 rounded-full" />
          <p className="text-lg sm:text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto px-4 drop-shadow-lg font-light leading-relaxed">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default PageHeader
