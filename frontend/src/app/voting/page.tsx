'use client'

import { motion } from 'framer-motion'
import { Calendar, Trophy, ChevronRight, Star, Music, Palette, PartyPopper } from 'lucide-react'
import Link from 'next/link'
import { useSiteSettings } from '@/lib/useSiteSettings'

const votingCategories = [
  {
    id: 'main-pageant',
    title: 'Main Pageant',
    subtitle: 'Miss Culture Global Kenya Finalists',
    description: 'Adults (18–28) competing for the ambassador crown. Your vote determines who carries Kenya forward.',
    icon: Trophy,
    color: 'bg-red-600',
    lightColor: 'bg-red-50',
    textColor: 'text-red-600',
    borderColor: 'border-red-200'
  },
  {
    id: 'teen-pageant',
    title: 'Teen Pageant',
    subtitle: 'Junior Cultural Ambassadors',
    description: 'Teens (13–17) showcasing heritage, talent, and leadership. Vote for the next generation.',
    icon: Star,
    color: 'bg-purple-600',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200'
  },
  {
    id: 'dance-competition',
    title: 'Dance Competition',
    subtitle: 'Traditional & Contemporary Dance',
    description: 'Solo and group performances celebrating Kenyan movement and rhythm. Vote for your favorite.',
    icon: PartyPopper,
    color: 'bg-green-600',
    lightColor: 'bg-green-50',
    textColor: 'text-green-600',
    borderColor: 'border-green-200'
  },
  {
    id: 'music-talent',
    title: 'Music Talent',
    subtitle: 'Vocal & Instrumental Performances',
    description: 'Artists singing in Swahili, English, or ethnic languages — carrying culture through sound.',
    icon: Music,
    color: 'bg-blue-600',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200'
  },
  {
    id: 'fashion-showcase',
    title: 'Fashion Showcase',
    subtitle: 'Designer Spotlight',
    description: 'Kenyan fashion designers blending tradition with contemporary style. Vote for the best collection.',
    icon: Palette,
    color: 'bg-yellow-600',
    lightColor: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    borderColor: 'border-yellow-200'
  }
]

const VotingPage = () => {
  const settings = useSiteSettings()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[55vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            className="w-full h-full"
          >
            <div className="absolute inset-0 bg-black/60 z-10" />
            <div
              className="w-full h-full bg-cover bg-center"
              style={settings.voting_hero_image_url ? { backgroundImage: `url(${settings.voting_hero_image_url})` } : undefined}
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
            <p className="text-sm sm:text-base uppercase tracking-[0.3em] text-yellow-400 mb-4 font-semibold">Your Voice Shapes the Stage</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl tracking-tight">
              Vote <span className="text-red-600">Now</span>
            </h1>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-8 rounded-full" />
            <p className="text-lg sm:text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto px-4 drop-shadow-lg font-light leading-relaxed">
              Cast your vote for pageant contestants, dancers, musicians, and fashion designers competing to represent Kenya's cultural future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Voting Categories Explainer */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 decorative-pattern opacity-[0.03]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Are You <span className="text-red-600">Voting For</span>?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Five competition categories, each showcasing a different dimension of Kenya&apos;s cultural excellence.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {votingCategories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="p-5 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-all duration-300 text-center group"
              >
                <div className={`w-12 h-12 ${cat.lightColor} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <cat.icon className={`w-6 h-6 ${cat.textColor}`} />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{cat.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{cat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Voting Coming Soon */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Trophy className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Voting Coming Soon</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Voting events and participants will be available here once they are set up by the admin team. 
              Stay tuned — your voice will shape who represents Kenya&apos;s cultural future on the global stage.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors"
              >
                <Calendar className="w-4 h-4" />
                View Upcoming Events
              </Link>
              <a
                href="https://instagram.com/misscultureglobalkenya"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold text-sm transition-colors"
              >
                Follow for Updates
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default VotingPage
