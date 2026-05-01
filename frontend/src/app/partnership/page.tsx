'use client'

import { motion } from 'framer-motion'
import { Eye, Heart, Globe, Camera, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import apiClient from '@/lib/api'
import { useSiteSettings } from '@/lib/useSiteSettings'

const valuePropositions = [
  {
    title: 'Targeted Visibility',
    description: 'Your brand in front of culturally-engaged audiences — live events (500-1000+ attendees), social media (10K+ followers), and international forums.',
    icon: Eye,
    impact: 'Massive Demographic Reach'
  },
  {
    title: 'Authentic CSR Alignment',
    description: 'Support youth empowerment, heritage preservation, and artisan uplift — real impact you can feature in your sustainability reports.',
    icon: Heart,
    impact: 'Meaningful CSR Impact'
  },
  {
    title: 'Cross-Border Networking',
    description: 'Connect with Kenya\'s franchise of a global movement spanning 50+ nations — diplomatic and business doors open through cultural partnership.',
    icon: Globe,
    impact: 'Global Connections'
  },
  {
    title: 'Content & Storytelling Rights',
    description: 'Behind-the-scenes access, co-branded content, and story angles for your marketing — culture sells, and you get exclusive angles.',
    icon: Camera,
    impact: 'Exclusive Content'
  }
]

const PartnershipPage = () => {
  const [sponsors, setSponsors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const settings = useSiteSettings()

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getPartners()
        const partnersData = Array.isArray(response) ? response : (response.results || [])
        setSponsors(partnersData.map((partner: any) => ({
          name: partner.name,
          logo: partner.logo_url || partner.logo || '',
          description: partner.description || `Supporting ${partner.partner_type || 'our mission'}`,
          since: partner.since || 'Partner'
        })))
      } catch (err) {
        console.error('Error fetching partners:', err)
        setSponsors([])
      } finally {
        setLoading(false)
      }
    }
    fetchPartners()
  }, [])

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
              style={settings.partnership_hero_image_url ? { backgroundImage: `url(${settings.partnership_hero_image_url})` } : undefined}
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
            <p className="text-sm sm:text-base uppercase tracking-[0.3em] text-yellow-400 mb-4 font-semibold">Brand Value Proposition</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl tracking-tight">
              Partner with <span className="text-red-600">Heritage</span>
            </h1>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-8 rounded-full" />
            <p className="text-lg sm:text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto px-4 drop-shadow-lg font-light leading-relaxed">
              Align your brand with Kenya&apos;s cultural diplomacy movement — gaining visibility across 50+ countries, meaningful CSR impact, and association with beauty that serves a higher purpose.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Partner — Value Propositions */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 decorative-pattern opacity-[0.03]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Partner With <span className="text-red-600">Us</span></h2>
              <div className="w-20 h-1 bg-green-500 mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {valuePropositions.map((area, index) => (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center group border border-gray-100 hover:border-green-100 transform hover:-translate-y-2"
                >
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-100 transition-colors duration-300">
                    <area.icon className="w-10 h-10 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors duration-300">{area.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{area.description}</p>
                  <div className="inline-block bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                    {area.impact}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Current Sponsors */}
      <section className="py-20 bg-green-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Our Valued <span className="text-red-600">Partners</span>
              </h2>
              <p className="text-xl text-green-100 max-w-3xl mx-auto font-light leading-relaxed">
                These brands have already chosen to align with heritage, purpose, and global reach. Join them.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <p className="mt-4 text-green-100">Loading partners...</p>
                </div>
              ) : sponsors.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-green-100">No partners available. Add partners in Django admin.</p>
                </div>
              ) : (
                sponsors.map((sponsor, index) => (
                  <motion.div
                    key={sponsor.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-6 hover:bg-white/20 transition-all duration-300 group cursor-pointer text-center"
                    title={sponsor.since || sponsor.description}
                  >
                    <div className="mb-4 h-28 flex items-center justify-center bg-white rounded-xl p-5 group-hover:scale-105 transition-transform duration-300">
                      {sponsor.logo ? (
                        <img src={sponsor.logo} alt={sponsor.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="text-gray-500 font-semibold text-sm text-center">{sponsor.name}</span>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">{sponsor.name}</h4>
                    <p className="text-xs text-green-100 opacity-60 group-hover:opacity-100 transition-opacity duration-300">{sponsor.since || sponsor.description}</p>
                  </motion.div>
                ))
              )}
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-red-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Become a Partner <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

export default PartnershipPage
