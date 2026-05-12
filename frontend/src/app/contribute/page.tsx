'use client'

import { motion } from 'framer-motion'
import { Check, Palette, GraduationCap, Globe2, Home, Building2, Copy } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useContributePageSettings } from '@/lib/usePageSettings'

const impactAreas = [
  {
    title: 'Cultural Preservation',
    description: 'Documenting and promoting diverse Kenyan traditions while integrating them into the modern creative economy — fashion, arts, and digital media.',
    icon: Palette,
    impact: 'Heritage & Innovation'
  },
  {
    title: 'Youth & Female Leadership',
    description: 'A rigorous mentorship ecosystem for young women and youth — entrepreneurship, public speaking, etiquette, and community project management.',
    icon: GraduationCap,
    impact: 'Mentorship Ecosystem'
  },
  {
    title: 'Global Ambassadorship',
    description: 'Equipping titleholders with the diplomacy and communication skills to represent Kenya on international stages and attract foreign investment.',
    icon: Globe2,
    impact: 'Cultural Diplomacy'
  },
  {
    title: 'Community Development',
    description: "Partnering with the travel industry to highlight Kenya's \u201CHidden Gems\u201D — promoting eco-tourism, community-based travel, and tangible impact in local communities.",
    icon: Home,
    impact: 'Sustainable Tourism'
  }
]

const ContributePage = () => {
  const { settings } = useContributePageSettings()
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[55vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/70 z-10" />
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            className="w-full h-full bg-cover bg-center"
            style={settings.hero_image_url ? { backgroundImage: `url(${settings.hero_image_url})` } : undefined}
          />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl animate-pulse-glow z-10" />
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl animate-pulse-glow delay-1000 z-10" />

        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm sm:text-base uppercase tracking-[0.3em] text-green-400 mb-4 font-semibold">Support Our Mission</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
              {settings.page_title || "Contribute"}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
              {settings.page_subtitle || "Support our mission"}
            </p>
            <div className="mt-8 flex justify-center">
              <div className="h-1 w-24 bg-red-600 rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Where Donations Go */}
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Where Your <span className="text-red-600">Money</span> Goes</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Every shilling is channeled into programs that directly advance our four strategic objectives — from cultural preservation to community development.</p>
              <div className="h-1 w-20 bg-green-500 mx-auto rounded-full mt-4" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {impactAreas.map((area, index) => (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl shadow-elegant hover:shadow-elegant-lg transition-all duration-300 p-8 text-center group border border-gray-100 hover:border-green-100"
                >
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-100 transition-colors duration-300">
                    <area.icon className="w-10 h-10 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{area.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed text-sm">{area.description}</p>
                  <div className="inline-block px-4 py-1 bg-green-50 text-green-700 rounded-full font-semibold text-sm">
                    {area.impact}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Payment */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute top-20 right-10 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-green-600" />

            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Make a Contribution</h2>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">Secure, fast, and every shilling goes directly to our programs.</p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Payment Details */}
              <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Payment Details
                </h4>
                <div className="bg-white rounded-xl overflow-hidden border border-green-200">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-green-100">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Till Number</p>
                      <p className="text-base font-bold text-gray-900 font-mono">542542</p>
                    </div>
                    <button type="button" onClick={() => handleCopy('542542', 'till')} className="p-1.5 hover:bg-green-50 rounded-lg transition-colors">
                      {copiedField === 'till' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                  <div className="px-4 py-2.5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Account Name</p>
                    <p className="text-base font-bold text-gray-900">The Misscomm Events</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> After completing payment, send the confirmation to <strong>info@misscultureglobalkenya.com</strong> or WhatsApp <strong>+254 721 706983</strong> for your receipt.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default ContributePage
