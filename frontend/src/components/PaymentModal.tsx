'use client'

import { motion } from 'framer-motion'
import { Smartphone, X, CheckCircle, ArrowLeft, Building2, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface TicketCategory {
  name: string
  price: string
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

const PaymentModal = ({ isOpen, onClose, event, ticketQuantities, totalPrice, totalTickets }: PaymentModalProps) => {
  const [currentStep, setCurrentStep] = useState<'summary' | 'paybill' | 'success'>('summary')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
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

  const handleClose = () => {
    setCurrentStep('summary')
    setCopiedField(null)
    onClose()
  }

  if (!isOpen || !event) return null

  const totalAmount = totalPrice === 0 ? 'Free' : `KSh ${totalPrice.toLocaleString()}`

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
                onClick={() => setCurrentStep('summary')}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {currentStep === 'summary' ? 'Complete Your Purchase' : currentStep === 'paybill' ? 'M-Pesa Paybill' : 'Payment Confirmed'}
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

              {/* Payment Method - only M-Pesa Paybill */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">M-Pesa (Paybill)</h4>
                    <p className="text-xs text-gray-500">Pay via M-Pesa to our business till number</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600 ml-auto flex-shrink-0" />
                </div>
              </div>

              <button
                onClick={() => setCurrentStep('paybill')}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-semibold text-base transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {currentStep === 'paybill' && (
            <div className="p-5 space-y-5">
              {/* Paybill Instructions */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  M-Pesa Paybill Instructions
                </h3>
                <ol className="text-sm text-green-800 space-y-2 list-decimal list-inside">
                  <li>Go to <strong>M-Pesa</strong> on your phone</li>
                  <li>Select <strong>Lipa na M-Pesa</strong></li>
                  <li>Select <strong>Paybill</strong></li>
                  <li>Enter the Paybill details below</li>
                  <li>Enter your phone number as the account number</li>
                  <li>Enter the amount: <strong className="text-red-600">{totalAmount}</strong></li>
                  <li>Confirm and enter your M-Pesa PIN</li>
                </ol>
              </div>

              {/* Paybill Details Card */}
              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-900 text-white px-4 py-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  <span className="font-semibold">Payment Details</span>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Paybill Number</p>
                      <p className="text-lg font-bold text-gray-900 font-mono">542542</p>
                    </div>
                    <button
                      onClick={() => handleCopy('542542', 'paybill')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copiedField === 'paybill' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Account Number</p>
                      <p className="text-lg font-bold text-gray-900 font-mono">0310848627615</p>
                    </div>
                    <button
                      onClick={() => handleCopy('0310848627615', 'account')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copiedField === 'account' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Account Name</p>
                      <p className="text-lg font-bold text-gray-900">The Misscomm Events</p>
                    </div>
                    <button
                      onClick={() => handleCopy('The Misscomm Events', 'name')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copiedField === 'name' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                  <div className="px-4 py-3 bg-red-50">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Amount to Pay</p>
                    <p className="text-xl font-bold text-red-600">{totalAmount}</p>
                  </div>
                </div>
              </div>

              {/* Reference */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> After completing payment, send the M-Pesa confirmation message to <strong>info@misscultureglobalkenya.com</strong> or WhatsApp <strong>+254 721 706983</strong> to receive your ticket confirmation.
                </p>
              </div>

              <button
                onClick={() => setCurrentStep('success')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-semibold text-base transition-colors"
              >
                I&apos;ve Completed Payment
              </button>
            </div>
          )}

          {currentStep === 'success' && (
            <div className="p-6 text-center space-y-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
              >
                <CheckCircle className="w-12 h-12 text-green-600" />
              </motion.div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Submitted!</h3>
                <p className="text-gray-600">
                  Your M-Pesa payment is being processed. You will receive a confirmation once verified.
                </p>
              </div>

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
                  <span className="font-bold text-red-600">{totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Reference</span>
                  <span className="font-mono text-gray-900 font-medium">#MCGK-{Date.now().toString().slice(-6)}</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-semibold text-base transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default PaymentModal
