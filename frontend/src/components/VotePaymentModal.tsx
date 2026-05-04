'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Phone, DollarSign, AlertCircle, Loader2, Smartphone } from 'lucide-react'
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
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [checkoutId, setCheckoutId] = useState('')

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

      if (result.success) {
        setCheckoutId(result.checkout_request_id)
        setSuccessMessage(result.message)
        setStep(2)
      } else {
        setError(result.error || 'Failed to initiate payment. Please try again.')
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
                  <p className="text-sm text-green-800 font-medium">
                    1 vote = KES {votePrice.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Enter your phone number and amount. An M-Pesa prompt will be sent to your phone.
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

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending M-Pesa Prompt...
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4" />
                      Pay with M-Pesa
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Step 2: STK Push Sent */}
            {step === 2 && (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Smartphone className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">M-Pesa Prompt Sent</h3>
                <p className="text-sm text-gray-600">
                  A payment request has been sent to your phone (+254{phone}).
                </p>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left space-y-2">
                  <p className="text-sm text-green-800 font-medium">What to do next:</p>
                  <ol className="text-sm text-green-700 space-y-1.5 list-decimal list-inside">
                    <li>Check your phone for the M-Pesa prompt</li>
                    <li>Enter your M-Pesa PIN to authorize the payment</li>
                    <li>Your votes will be confirmed automatically</li>
                  </ol>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-left">
                  <p className="text-xs text-gray-500">Amount: <span className="font-semibold text-gray-700">KES {amountNum.toLocaleString()}</span></p>
                  <p className="text-xs text-gray-500">Expected Votes: <span className="font-semibold text-gray-700">{voteCount}</span></p>
                  {checkoutId && (
                    <p className="text-xs text-gray-400 mt-1">Ref: {checkoutId.slice(-8)}</p>
                  )}
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
