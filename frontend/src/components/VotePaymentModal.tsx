'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Phone, AlertCircle, Loader2, Smartphone, CheckCircle } from 'lucide-react'
import MpesaLogo from '@/components/MpesaLogo'
import apiClient from '@/lib/api'
import type { ApiError } from '@/lib/api'

interface VotePaymentModalProps {
  isOpen: boolean
  onClose: () => void
  event: {
    id: number
    title: string
    vote_price: number
  }
  contestant: {
    id: number
    name: string
    contestant_number: number
    photo_url?: string | null
  }
}

const VotePaymentModal = ({ isOpen, onClose, event, contestant }: VotePaymentModalProps) => {
  const [step, setStep] = useState<1 | 2>(1)
  const [amount, setAmount] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Load saved phone
  useEffect(() => {
    const saved = localStorage.getItem('mcgk_user_info')
    if (saved) {
      try {
        const { phone } = JSON.parse(saved)
        if (phone) setPhone(phone)
      } catch (e) {}
    }
  }, [isOpen])

  // Save phone on change
  useEffect(() => {
    if (phone) {
      const saved = localStorage.getItem('mcgk_user_info')
      let info = {}
      if (saved) {
        try { info = JSON.parse(saved) } catch (e) {}
      }
      localStorage.setItem('mcgk_user_info', JSON.stringify({ ...info, phone }))
    }
  }, [phone])

  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [checkoutId, setCheckoutId] = useState('')
  const [paymentId, setPaymentId] = useState<number | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'successful' | 'failed'>('pending')
  const pollingInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (step === 2 && paymentId && paymentStatus === 'pending') {
      startPolling()
    } else if (step !== 2 || paymentStatus !== 'pending') {
      stopPolling()
    }
    return () => stopPolling()
  }, [step, paymentId, paymentStatus])

  const startPolling = () => {
    if (pollingInterval.current) return
    pollingInterval.current = setInterval(checkStatus, 3000)
  }

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current)
      pollingInterval.current = null
    }
  }

  const checkStatus = async () => {
    if (!paymentId) return
    try {
      const data = await apiClient.getPaymentStatus(paymentId)
      if (data.status === 'successful') {
        setPaymentStatus('successful')
        stopPolling()
      } else if (data.status === 'failed' || data.status === 'cancelled') {
        setPaymentStatus('failed')
        setError(data.stk_response?.callback?.result_desc || 'Payment failed or was cancelled.')
        stopPolling()
      }
    } catch (err) {
      console.error('Polling error', err)
    }
  }

  const votePrice = event.vote_price || 10
  const amountNum = parseFloat(amount) || 0
  const voteCount = Math.floor(amountNum / votePrice)
  const remaining = amountNum - (voteCount * votePrice)

  const handleSubmit = async () => {
    if (!amount || amountNum < votePrice) {
      setError(`Minimum amount is KES ${votePrice}`)
      return
    }
    if (!phone || phone.length < 9) {
      setError('Please enter a valid phone number')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const result = await apiClient.initiateVotePayment(event.id, {
        phone_number: phone.startsWith('0') ? phone : `0${phone}`,
        amount: amountNum,
        contestant_id: contestant.id,
      })

      if (result.success && result.redirect_url) {
        setCheckoutId(result.order_tracking_id || '')
        setPaymentId(result.payment_id || null)
        setSuccessMessage(result.message)
        window.location.href = result.redirect_url
      } else {
        setError(result.error || 'Failed to open checkout. Please try again.')
      }
    } catch (err) {
      const apiErr = err as ApiError
      setError(apiErr.message || 'Failed to initiate payment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setAmount('')
    setPhone('')
    setError('')
    setSuccessMessage('')
    setCheckoutId('')
    setPaymentId(null)
    setPaymentStatus('pending')
    setAgreedToTerms(false)
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
            {/* Step 1: Amount & Phone */}
            {step === 1 && (
              <div className="space-y-4">
                {/* Vote Price Info */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <MpesaLogo size="sm" />
                    <div>
                      <p className="text-sm font-bold text-green-800">M-Pesa Till: 4766976</p>
                      <p className="text-xs text-green-600">The Misscomm Events</p>
                    </div>
                  </div>
                  <p className="text-sm text-green-800 font-medium">
                    1 vote = KES {votePrice.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Enter your phone number and amount, then continue to secure checkout.
                  </p>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Amount (KES)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">KES</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => { setAmount(e.target.value); setError('') }}
                      placeholder="100"
                      min={votePrice}
                      className="w-full pl-14 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold"
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
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 flex items-start gap-3">
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      id="vote-terms-agreement"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                    />
                  </div>
                  <label htmlFor="vote-terms-agreement" className="text-xs text-gray-600 leading-tight cursor-pointer">
                    I agree to the <a href="/terms" target="_blank" className="text-green-600 font-bold hover:underline">Terms & Conditions</a> and <a href="/privacy" target="_blank" className="text-green-600 font-bold hover:underline">Privacy Policy</a>.
                  </label>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting || !phone || phone.length < 9 || !amount || !agreedToTerms}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Opening Checkout...
                    </>
                  ) : (
                    <>
                      <MpesaLogo size="sm" />
                      Pay KES {amountNum.toLocaleString()} with M-Pesa
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Step 2: Payment Processing */}
            {step === 2 && (
              <div className="space-y-4 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                    paymentStatus === 'successful' ? 'bg-green-100' : 
                    paymentStatus === 'failed' ? 'bg-red-100' : 'bg-blue-100'
                  }`}
                >
                  {paymentStatus === 'successful' ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : paymentStatus === 'failed' ? (
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  ) : (
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  )}
                </motion.div>

                <h3 className="text-xl font-bold text-gray-900">
                  {paymentStatus === 'successful' ? 'Votes Confirmed!' : 
                   paymentStatus === 'failed' ? 'Payment Failed' : 'Waiting for Payment...'}
                </h3>
                <p className="text-sm text-gray-600">
                  {paymentStatus === 'successful' ? `Thank you for supporting ${contestant.name}! Your votes have been counted.` :
                   paymentStatus === 'failed' ? (error || 'The payment could not be completed.') :
                   `We are waiting for payment confirmation (+254${phone}).`}
                </p>

                {paymentStatus === 'pending' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left space-y-2">
                    <p className="text-sm text-blue-800 font-medium">What to do next:</p>
                    <ol className="text-sm text-blue-700 space-y-1.5 list-decimal list-inside">
                      <li>Complete payment on the checkout page</li>
                      <li>Use M-Pesa when prompted</li>
                      <li>Keep this window open to confirm your votes</li>
                    </ol>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-3 text-left">
                  <p className="text-xs text-gray-500">Amount: <span className="font-semibold text-gray-700">KES {amountNum.toLocaleString()}</span></p>
                  <p className="text-xs text-gray-500">Expected Votes: <span className="font-semibold text-gray-700">{voteCount}</span></p>
                  {checkoutId && paymentStatus === 'pending' && (
                    <p className="text-xs text-gray-400 mt-1">Ref: {checkoutId.slice(-8)}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  {paymentStatus === 'failed' && (
                    <button
                      onClick={() => { setStep(1); setPaymentStatus('pending'); setError('') }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
                    >
                      Try Again
                    </button>
                  )}
                  <button
                    onClick={handleClose}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                      paymentStatus === 'successful' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    {paymentStatus === 'successful' ? 'Close' : 'Done'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default VotePaymentModal
