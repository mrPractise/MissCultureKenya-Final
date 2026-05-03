'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check, Phone, DollarSign, User, AlertCircle, Loader2 } from 'lucide-react'
import apiClient from '@/lib/api'
import type { ApiError } from '@/lib/api'

interface VotePaymentModalProps {
  isOpen: boolean
  onClose: () => void
  event: {
    id: number
    title: string
    vote_price: number
    paybill_number: string
    account_number: string
    account_name: string
    payment_method: string
    till_number?: string
  }
  contestant: {
    id: number
    name: string
    contestant_number: number
    photo_url?: string | null
  }
}

const VotePaymentModal = ({ isOpen, onClose, event, contestant }: VotePaymentModalProps) => {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [amount, setAmount] = useState('')
  const [phone, setPhone] = useState('')
  const [mpesaCode, setMpesaCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<any>(null)

  const votePrice = event.vote_price || 10
  const amountNum = parseFloat(amount) || 0
  const voteCount = Math.floor(amountNum / votePrice)
  const remaining = amountNum - (voteCount * votePrice)

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    })
  }

  const handleSubmit = async () => {
    if (!amount || amountNum <= 0) {
      setError('Please enter a valid amount')
      return
    }
    if (!phone || phone.length < 9) {
      setError('Please enter a valid phone number')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const result = await apiClient.createPayment({
        event: event.id,
        phone_number: phone.startsWith('+254') ? phone : `+254${phone}`,
        mpesa_code: mpesaCode || '',
        amount: amountNum,
        status: 'pending',
        payment_type: 'vote',
      })
      setSuccessData(result)
      setStep(3)
    } catch (err) {
      const apiErr = err as ApiError
      setError(apiErr.message || 'Failed to submit payment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setAmount('')
    setPhone('')
    setMpesaCode('')
    setError('')
    setSuccessData(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="bg-green-600 text-white px-6 py-5 rounded-t-2xl">
            <p className="text-sm text-green-100 font-medium">Voting for</p>
            <h2 className="text-xl font-bold">{contestant.name}</h2>
            <p className="text-sm text-green-200">#{contestant.contestant_number} — {event.title}</p>
          </div>

          <div className="p-6">
            {/* Step Indicators */}
            <div className="flex items-center gap-2 mb-6">
              {[
                { num: 1, label: 'Amount' },
                { num: 2, label: 'Pay' },
                { num: 3, label: 'Done' },
              ].map((s, i) => (
                <div key={s.num} className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= s.num ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                  </div>
                  <span className={`text-xs font-medium ${step >= s.num ? 'text-green-700' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                  {i < 2 && <div className={`flex-1 h-0.5 ${step > s.num ? 'bg-green-600' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>

            {/* Step 1: Amount & Phone */}
            {step === 1 && (
              <div className="space-y-4">
                {/* Vote Price Info */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-800 font-medium">
                    1 vote = KES {votePrice.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Vote count is calculated from your payment amount (backend-verified)
                  </p>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Amount (KES)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => { setAmount(e.target.value); setError('') }}
                      placeholder="100"
                      min={votePrice}
                      className="w-full pl-9 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold"
                    />
                  </div>
                  {amountNum >= votePrice && (
                    <p className="mt-1.5 text-sm text-green-600 font-medium">
                      = {voteCount} vote{voteCount !== 1 ? 's' : ''}
                      {remaining > 0 && <span className="text-gray-400 font-normal"> (KES {remaining.toFixed(0)} remainder)</span>}
                    </p>
                  )}
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    M-Pesa Phone Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl text-sm text-gray-600 font-medium">
                      +254
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setError('') }}
                      placeholder="712345678"
                      maxLength={9}
                      className="flex-1 px-3 py-3 border border-gray-300 rounded-r-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                {/* M-Pesa Code (optional — can provide after payment) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    M-Pesa Code <span className="text-gray-400 font-normal">(if you have it)</span>
                  </label>
                  <input
                    type="text"
                    value={mpesaCode}
                    onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SHK4Y7R2TZ"
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 uppercase font-mono tracking-wider"
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (!amount || amountNum < votePrice) {
                      setError(`Minimum amount is KES ${votePrice}`)
                      return
                    }
                    if (!phone || phone.length < 9) {
                      setError('Please enter a valid phone number')
                      return
                    }
                    setStep(2)
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Paybill Instructions & Submit */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-800 font-medium mb-2">Complete M-Pesa Payment</p>
                  <p className="text-xs text-amber-700">
                    Send KES {amountNum.toLocaleString()} via M-Pesa, then submit your transaction below.
                    Your {voteCount} vote{voteCount !== 1 ? 's' : ''} will be confirmed once admin verifies payment.
                  </p>
                </div>

                {/* Paybill Details */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Payment Details</p>
                  </div>

                  {(event.payment_method === 'paybill' || event.payment_method === 'both') && (
                    <>
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Paybill Number</p>
                          <p className="text-lg font-bold text-gray-900 font-mono">{event.paybill_number}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(event.paybill_number, 'paybill')}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          {copiedField === 'paybill' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </button>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Account Number</p>
                          <p className="text-lg font-bold text-gray-900 font-mono">{event.account_number}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(event.account_number, 'account')}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          {copiedField === 'account' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </button>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Account Name</p>
                      <p className="text-sm font-bold text-gray-900">{event.account_name}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(event.account_name, 'name')}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {copiedField === 'name' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Contestant</span>
                    <span className="font-medium">#{contestant.contestant_number} {contestant.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-medium">KES {amountNum.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Votes</span>
                    <span className="font-bold text-green-700">{voteCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phone</span>
                    <span className="font-medium">+254{phone}</span>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Payment'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Payment Submitted</h3>
                <p className="text-sm text-gray-600">
                  Your payment of KES {amountNum.toLocaleString()} for {voteCount} vote{voteCount !== 1 ? 's' : ''} has been recorded.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
                  <p className="text-sm text-amber-800 font-medium">Next Steps</p>
                  <ul className="text-xs text-amber-700 mt-2 space-y-1">
                    <li>1. Complete your M-Pesa payment if you have not already</li>
                    <li>2. Admin will verify your payment</li>
                    <li>3. Your votes will be confirmed and counted</li>
                    <li>4. You can verify your votes using your phone number</li>
                  </ul>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default VotePaymentModal
