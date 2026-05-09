'use client'

import { motion } from 'framer-motion'
import { Smartphone, X, CheckCircle, ArrowLeft, AlertCircle, Loader2, User, Mail, Ticket as TicketIcon, Wallet } from 'lucide-react'
import MpesaLogo from '@/components/MpesaLogo'
import { useState, useEffect, useRef } from 'react'
import apiClient from '@/lib/api'
import type { ApiError } from '@/lib/api'

interface TicketCategory {
  id: number
  name: string
  price: string
  price_value?: string | number
  description: string
  available: number
  total: number
}

interface Event {
  id: number
  title: string
  date: string
  time: string
  venue: string
  location: string
  description: string
  image: string
  category: string
  capacity: number
  price: string
  registrationUrl?: string
  organizer?: string
  contactEmail?: string
  contactPhone?: string
  ticketCategories?: TicketCategory[]
  votingEnabled?: boolean
}

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  event: Event | null
  ticketQuantities: {[key: string]: number}
  totalPrice: number
  totalTickets: number
}

type Step = 'summary' | 'pay' | 'processing'

const PaymentModal = ({ isOpen, onClose, event, ticketQuantities, totalPrice, totalTickets }: PaymentModalProps) => {
  const [currentStep, setCurrentStep] = useState<Step>('summary')
  const [phone, setPhone] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Load saved user info
  useEffect(() => {
    const saved = localStorage.getItem('mcgk_user_info')
    if (saved) {
      try {
        const { fullName, email, phone } = JSON.parse(saved)
        if (fullName) setFullName(fullName)
        if (email) setEmail(email)
        if (phone) setPhone(phone)
      } catch (e) {}
    }
  }, [isOpen])

  // Save user info on change
  useEffect(() => {
    if (fullName || email || phone) {
      localStorage.setItem('mcgk_user_info', JSON.stringify({ fullName, email, phone }))
    }
  }, [fullName, email, phone])

  const [error, setError] = useState('')
  const [checkoutId, setCheckoutId] = useState('')
  const [paymentId, setPaymentId] = useState<number | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'successful' | 'failed'>('pending')
  const [issuedTickets, setIssuedTickets] = useState<any[]>([])
  const pollingInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (currentStep === 'processing' && paymentId && paymentStatus === 'pending') {
      startPolling()
    } else if (currentStep !== 'processing' || paymentStatus !== 'pending') {
      stopPolling()
    }
    return () => stopPolling()
  }, [currentStep, paymentId, paymentStatus])

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
        // Fetch tickets for this payment
        try {
          const ticketData = await apiClient.get('/api/events/tickets/', { payment: paymentId })
          const tickets = Array.isArray(ticketData) ? ticketData : (ticketData?.results || [])
          setIssuedTickets(tickets)
        } catch (e) {
          console.error('Failed to fetch issued tickets', e)
        }
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

  const getSelectedTickets = () => {
    if (!event?.ticketCategories) return []
    return Object.entries(ticketQuantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([ticketName, quantity]) => {
        const ticket = event.ticketCategories?.find(t => t.name === ticketName)
        return { ...ticket, quantity }
      })
  }

  const buildTicketBreakdown = (): Record<string, number> => {
    if (!event?.ticketCategories) return {}
    const breakdown: Record<string, number> = {}
    Object.entries(ticketQuantities).forEach(([ticketName, quantity]) => {
      if (quantity <= 0) return
      const ticket = event.ticketCategories?.find(t => t.name === ticketName)
      if (ticket) {
        breakdown[String(ticket.id)] = quantity
      }
    })
    return breakdown
  }

  const handleSubmit = async () => {
    if (!event) return

    if (!fullName.trim()) {
      setError('Please enter your full name')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    if (!phone || phone.length < 9) {
      setError('Please enter a valid M-Pesa phone number')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const breakdown = buildTicketBreakdown()
      const result = await apiClient.initiateTicketPayment(event.id, {
        phone_number: phone.startsWith('0') ? phone : `0${phone}`,
        full_name: fullName.trim(),
        email: email.trim(),
        ticket_breakdown: breakdown,
      })

      if (result.success) {
        setCheckoutId(result.checkout_request_id || '')
        setPaymentId(result.payment_id || null)
        setCurrentStep('processing')
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
    setCurrentStep('summary')
    setPhone('')
    setFullName('')
    setEmail('')
    setError('')
    setCheckoutId('')
    setPaymentId(null)
    setPaymentStatus('pending')
    setIssuedTickets([])
    setAgreedToTerms(false)
    setSubmitting(false)
    onClose()
  }

  if (!isOpen || !event) return null

  const totalAmount = totalPrice === 0 ? 'Free' : `KSh ${totalPrice.toLocaleString()}`

  // Don't show STK Push for free tickets
  if (totalPrice === 0) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-white w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center space-x-3">
            {currentStep !== 'summary' && (
              <button
                onClick={() => { setCurrentStep('summary'); setError('') }}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {currentStep === 'summary' ? 'Complete Your Purchase' : currentStep === 'pay' ? 'Pay with M-Pesa' : 'M-Pesa Prompt Sent'}
              </h2>
              <p className="text-sm text-gray-500">{event.title}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Step 1: Summary */}
          {currentStep === 'summary' && (
            <div className="p-5 space-y-5">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Order Summary</h3>
                <div className="space-y-2">
                  {getSelectedTickets().map((ticket, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{ticket?.name} <span className="text-gray-400">x{ticket?.quantity}</span></span>
                      <span className="font-medium text-gray-900">
                        {ticket?.price === 'Free' ? 'Free' : `KSh ${(parseInt(ticket?.price?.replace(/[^\d]/g, '') || '0') * ticket?.quantity).toLocaleString()}`}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">{totalTickets} ticket{totalTickets > 1 ? 's' : ''}</span>
                      <span className="font-bold text-red-600 text-lg">{totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-4">
                  <MpesaLogo size="md" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">M-Pesa Till Number</h4>
                    <p className="text-sm font-bold text-green-700">4766976</p>
                    <p className="text-xs text-gray-500">The Misscomm Events</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">STK Push</p>
                    <CheckCircle className="w-5 h-5 text-green-600 inline-block" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep('pay')}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-semibold text-base transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Enter phone + name + email */}
          {currentStep === 'pay' && (
            <div className="p-5 space-y-4">
              {/* Info banner */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-green-800 font-medium">
                  Enter your details below. An M-Pesa prompt will be sent directly to your phone.
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Amount: <span className="font-bold">KSh {totalPrice.toLocaleString()}</span> for {totalTickets} ticket{totalTickets > 1 ? 's' : ''}
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); setError('') }}
                    placeholder="John Doe"
                    className="w-full pl-9 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                    placeholder="john@example.com"
                    className="w-full pl-9 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Your ticket confirmation will be sent here</p>
              </div>

              {/* Phone Number */}
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
                <p className="text-xs text-gray-500 mt-1">The M-Pesa prompt will be sent to this number</p>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Event</span>
                  <span className="font-medium text-gray-900">{event.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tickets</span>
                  <span className="font-medium text-gray-900">{totalTickets} ticket{totalTickets > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-bold text-red-600">KSh {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3">
                <div className="pt-1">
                  <input
                    type="checkbox"
                    id="terms-agreement"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                  />
                </div>
                <label htmlFor="terms-agreement" className="text-sm text-gray-600 leading-tight cursor-pointer">
                  I agree to the <a href="/terms" target="_blank" className="text-green-600 font-bold hover:underline">Terms & Conditions</a> and <a href="/privacy" target="_blank" className="text-green-600 font-bold hover:underline">Privacy Policy</a>.
                </label>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting || !phone || phone.length < 9 || !fullName || !email || !agreedToTerms}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending M-Pesa Prompt...
                  </>
                ) : (
                  <>
                    <MpesaLogo size="sm" />
                    Pay KSh {totalPrice.toLocaleString()} with M-Pesa
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 3: STK Push Sent / Processing */}
          {currentStep === 'processing' && (
            <div className="p-6 space-y-5 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                  paymentStatus === 'successful' ? 'bg-green-100' : 
                  paymentStatus === 'failed' ? 'bg-red-100' : 'bg-blue-100'
                }`}
              >
                {paymentStatus === 'successful' ? (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                ) : paymentStatus === 'failed' ? (
                  <AlertCircle className="w-10 h-10 text-red-600" />
                ) : (
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                )}
              </motion.div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {paymentStatus === 'successful' ? 'Payment Successful!' : 
                   paymentStatus === 'failed' ? 'Payment Failed' : 'Waiting for Payment...'}
                </h3>
                <p className="text-gray-600">
                  {paymentStatus === 'successful' ? 'Your tickets have been issued successfully.' :
                   paymentStatus === 'failed' ? (error || 'The payment could not be completed.') :
                   `A payment request has been sent to your phone (+254${phone}).`}
                </p>
              </div>

              {paymentStatus === 'pending' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left space-y-2">
                  <p className="text-sm text-blue-800 font-medium">What to do next:</p>
                  <ol className="text-sm text-blue-700 space-y-1.5 list-decimal list-inside">
                    <li>Check your phone for the M-Pesa prompt</li>
                    <li>Enter your M-Pesa PIN to authorize the payment</li>
                    <li>Keep this window open to receive your tickets</li>
                  </ol>
                </div>
              )}

              {paymentStatus === 'successful' && issuedTickets.length > 0 && (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left">
                    <p className="text-xs text-green-600 font-bold uppercase mb-2">Your Ticket Codes</p>
                    <div className="grid grid-cols-1 gap-2">
                      {issuedTickets.map((t, i) => (
                        <div key={i} className="flex items-center justify-between bg-white p-2 rounded-lg border border-green-100">
                          <span className="font-mono font-bold text-green-700">{t.ticket_code}</span>
                          <span className="text-[10px] text-gray-400">{t.ticket_category_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    A confirmation email has also been sent to <span className="font-medium">{email}</span>.
                  </p>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Event</span>
                  <span className="font-medium text-gray-900">{event.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tickets</span>
                  <span className="font-medium text-gray-900">{totalTickets} ticket{totalTickets > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-bold text-red-600">KSh {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                {paymentStatus === 'failed' && (
                  <button
                    onClick={() => { setCurrentStep('pay'); setPaymentStatus('pending'); setError('') }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3.5 rounded-xl font-semibold text-base transition-colors"
                  >
                    Try Again
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className={`flex-1 py-3.5 rounded-xl font-semibold text-base transition-colors ${
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
  )
}

export default PaymentModal
