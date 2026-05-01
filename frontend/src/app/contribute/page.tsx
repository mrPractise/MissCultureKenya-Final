'use client'

import { motion } from 'framer-motion'
import { Smartphone, Check, Palette, GraduationCap, Globe2, Home, Building2, Copy } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useSiteSettings } from '@/lib/useSiteSettings'

const impactAreas = [
  {
    title: 'Cultural Preservation',
    description: 'Funding traditional craftspeople, documenting oral histories, and archiving endangered art forms before they disappear.',
    icon: Palette,
    impact: '500+ artisans supported'
  },
  {
    title: 'Youth Empowerment',
    description: 'Scholarships, leadership training, mentorship programs — preparing the next generation of cultural ambassadors.',
    icon: GraduationCap,
    impact: '1,000+ youth reached'
  },
  {
    title: 'Global Outreach',
    description: 'Ambassador travel, international conference attendance, cross-border cultural exchange — taking Kenya to the world.',
    icon: Globe2,
    impact: '50+ countries reached'
  },
  {
    title: 'Community Development',
    description: 'Grassroots programs, artisan markets, school outreach — direct impact in local communities across Kenya.',
    icon: Home,
    impact: '100+ communities impacted'
  }
]

const ContributePage = () => {
  const settings = useSiteSettings()
  const [amount, setAmount] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setShowSuccess(true)
      setTimeout(() => { setShowSuccess(false); setAmount(''); setPhoneNumber('') }, 5000)
    }, 2000)
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
            style={settings.contribute_hero_image_url ? { backgroundImage: `url(${settings.contribute_hero_image_url})` } : undefined}
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
            <p className="text-sm sm:text-base uppercase tracking-[0.3em] text-green-400 mb-4 font-semibold">Give to Culture, Empower a Generation</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
              Every <span className="text-red-600">Shilling</span> Counts
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
              Your contribution preserves Kenya&apos;s heritage, funds youth programs, supports artisans, and amplifies our global voice.
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
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Every donation channel has a direct, measurable impact. Here&apos;s exactly what your contribution funds.</p>
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Make a Contribution</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Secure, fast, and every shilling goes directly to our programs.</p>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-8 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-green-100/50 animate-pulse" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h3>
                  <p className="text-green-700 text-lg">Your support means the world to us and helps continue our mission.</p>
                </div>
              </motion.div>
            )}

            {/* M-Pesa Paybill Form */}
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleContribute}
              className="space-y-6"
            >
              <div>
                <label htmlFor="mpesa-amount" className="block text-sm font-medium text-gray-700 mb-2">Contribution Amount (KES)</label>
                <div className="relative group">
                  <input type="number" id="mpesa-amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg transition-all duration-300 group-hover:bg-white" required />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                    <span className="text-gray-500 font-medium">KES</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="mpesa-phone" className="block text-sm font-medium text-gray-700 mb-2">M-Pesa Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none border-r border-gray-200 pr-4">
                    <span className="text-gray-500 font-medium">+254</span>
                  </div>
                  <input type="tel" id="mpesa-phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="700 000 000" className="w-full pl-24 px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg transition-all duration-300 group-hover:bg-white" required />
                </div>
              </div>

              {/* Paybill Details */}
              <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Pay via M-Pesa Paybill
                </h4>
                <ol className="text-xs text-green-700 space-y-1.5 list-decimal list-inside mb-4">
                  <li>Go to <strong>M-Pesa</strong> → <strong>Lipa na M-Pesa</strong> → <strong>Paybill</strong></li>
                  <li>Enter Paybill and Account Number below</li>
                  <li>Enter the amount and your M-Pesa PIN to confirm</li>
                </ol>
                <div className="bg-white rounded-xl overflow-hidden border border-green-200">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-green-100">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Paybill</p>
                      <p className="text-base font-bold text-gray-900 font-mono">542542</p>
                    </div>
                    <button type="button" onClick={() => handleCopy('542542', 'paybill')} className="p-1.5 hover:bg-green-50 rounded-lg transition-colors">
                      {copiedField === 'paybill' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-green-100">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Account No.</p>
                      <p className="text-base font-bold text-gray-900 font-mono">0310848627615</p>
                    </div>
                    <button type="button" onClick={() => handleCopy('0310848627615', 'account')} className="p-1.5 hover:bg-green-50 rounded-lg transition-colors">
                      {copiedField === 'account' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
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
                  <strong>Note:</strong> After completing payment, send the M-Pesa confirmation to <strong>info@misscultureglobalkenya.com</strong> or WhatsApp <strong>+254 721 706983</strong> for your receipt.
                </p>
              </div>

              <button type="submit" disabled={isProcessing} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3">
                {isProcessing ? (
                  <><svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Processing...</span></>
                ) : (
                  <><Smartphone className="w-5 h-5" /><span>Contribute via M-Pesa</span></>
                )}
              </button>
            </motion.form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default ContributePage
