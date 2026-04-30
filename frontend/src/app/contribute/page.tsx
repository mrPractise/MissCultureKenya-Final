'use client'

import { motion } from 'framer-motion'
import { CreditCard, Smartphone, Check, Palette, GraduationCap, Globe2, Home, Shield } from 'lucide-react'
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
  const [activeTab, setActiveTab] = useState<'mpesa' | 'visa'>('mpesa')
  const [amount, setAmount] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const suggestedAmounts = [500, 1000, 5000, 10000]

  const handleMpesaPayment = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setShowSuccess(true)
      setTimeout(() => { setShowSuccess(false); setAmount(''); setPhoneNumber('') }, 5000)
    }, 2000)
  }

  const handleVisaPayment = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setShowSuccess(true)
      setTimeout(() => { setShowSuccess(false); setAmount(''); setCardNumber(''); setExpiryDate(''); setCvv(''); setCardholderName('') }, 5000)
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
          {/* Payment Form */}
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

              {/* Suggested Amounts */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">Choose an amount</label>
                <div className="grid grid-cols-4 gap-3">
                  {suggestedAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt.toString())}
                      className={`py-3 rounded-xl font-bold text-sm transition-all duration-200 ${amount === amt.toString()
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-green-300 hover:bg-green-50'
                      }`}
                    >
                      KES {amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Tabs */}
              <div className="flex justify-center mb-8">
                <div className="bg-gray-100 p-1.5 rounded-2xl inline-flex">
                  <button
                    onClick={() => setActiveTab('mpesa')}
                    className={`py-3 px-8 text-lg font-medium rounded-xl transition-all duration-300 ${activeTab === 'mpesa' ? 'bg-white text-green-700 shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5" />
                      M-Pesa
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('visa')}
                    className={`py-3 px-8 text-lg font-medium rounded-xl transition-all duration-300 ${activeTab === 'visa' ? 'bg-white text-green-700 shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Card
                    </div>
                  </button>
                </div>
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

              {/* M-Pesa Payment Form */}
              {activeTab === 'mpesa' && (
                <motion.form
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleMpesaPayment}
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

                  <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                      <Smartphone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-green-900 mb-1 text-sm">Fast, local, trusted</h4>
                      <p className="text-green-700 text-xs leading-relaxed">After submitting, you&apos;ll receive a prompt on your phone to complete the payment via M-Pesa. Ensure your phone is unlocked.</p>
                    </div>
                  </div>

                  <button type="submit" disabled={isProcessing} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3">
                    {isProcessing ? (
                      <><svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Processing...</span></>
                    ) : (
                      <><span>Contribute via M-Pesa</span></>
                    )}
                  </button>
                </motion.form>
              )}

              {/* Visa/Mastercard Payment Form */}
              {activeTab === 'visa' && (
                <motion.form
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleVisaPayment}
                  className="space-y-6"
                >
                  <div>
                    <label htmlFor="card-amount" className="block text-sm font-medium text-gray-700 mb-2">Contribution Amount (KES)</label>
                    <div className="relative group">
                      <input type="number" id="card-amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg transition-all duration-300 group-hover:bg-white" required />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                        <span className="text-gray-500 font-medium">KES</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <div className="relative group">
                      <CreditCard className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                      <input type="text" id="card-number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" className="w-full pl-16 px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg transition-all duration-300 group-hover:bg-white" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="card-expiry" className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input type="text" id="card-expiry" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} placeholder="MM/YY" className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg transition-all duration-300 hover:bg-white" required />
                    </div>
                    <div>
                      <label htmlFor="card-cvv" className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input type="text" id="card-cvv" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg transition-all duration-300 hover:bg-white" required />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="card-name" className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                    <input type="text" id="card-name" value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} placeholder="John Doe" className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg transition-all duration-300 hover:bg-white" required />
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
                    <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900 mb-1 text-sm">Visa / Mastercard / Amex</h4>
                      <p className="text-blue-700 text-xs leading-relaxed">Secure checkout powered by Stripe/Flutterwave. Your payment information is encrypted and protected.</p>
                    </div>
                  </div>

                  <button type="submit" disabled={isProcessing} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3">
                    {isProcessing ? (
                      <><svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Processing...</span></>
                    ) : (
                      <><span>Contribute via Card</span></>
                    )}
                  </button>
                </motion.form>
              )}
            </motion.div>
        </div>
      </section>
    </div>
  )
}

export default ContributePage
