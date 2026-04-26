'use client'

import { motion } from 'framer-motion'
import { CreditCard, Smartphone, Shield, X, CheckCircle, ArrowLeft } from 'lucide-react'
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState<'method' | 'details' | 'success'>('method')

  const paymentMethods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      description: 'Pay with your M-Pesa mobile money',
      icon: Smartphone,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay with Visa, Mastercard, or other cards',
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'visa',
      name: 'Visa',
      description: 'Pay securely with Visa',
      icon: Shield,
      color: 'text-blue-800',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    }
  ]

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsProcessing(false)
    setIsSuccess(true)
    setCurrentStep('success')
  }

  const handleClose = () => {
    setCurrentStep('method')
    setSelectedPaymentMethod('')
    setIsProcessing(false)
    setIsSuccess(false)
    onClose()
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

  if (!isOpen || !event) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-white w-full h-full overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-4">
            {currentStep !== 'method' && (
              <button
                onClick={() => setCurrentStep('method')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Complete Your Purchase</h2>
              <p className="text-gray-600">{event.title}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 'method' && (
            <div className="max-w-2xl mx-auto">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {getSelectedTickets().map((ticket, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-gray-900">{ticket?.name}</span>
                        <span className="text-gray-600 ml-2">x{ticket?.quantity}</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {ticket?.price === 'Free' ? 'Free' : `KSh ${(parseInt(ticket?.price?.replace(/[^\d]/g, '') || '0') * ticket?.quantity).toLocaleString()}`}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total ({totalTickets} tickets):</span>
                      <span className="text-red-600">
                        {totalPrice === 0 ? 'Free' : `KSh ${totalPrice.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Choose Payment Method</h3>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                        selectedPaymentMethod === method.id
                          ? `${method.borderColor} ${method.bgColor}`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${method.bgColor} rounded-full flex items-center justify-center`}>
                          <method.icon className={`w-6 h-6 ${method.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{method.name}</h4>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedPaymentMethod === method.id
                            ? 'border-red-500 bg-red-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedPaymentMethod === method.id && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Continue Button */}
              <div className="mt-8">
                <button
                  onClick={() => setCurrentStep('details')}
                  disabled={!selectedPaymentMethod}
                  className={`w-full px-6 py-4 rounded-lg font-semibold text-lg transition-colors duration-300 ${
                    selectedPaymentMethod
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {currentStep === 'details' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Details</h3>
                <div className="space-y-4">
                  {selectedPaymentMethod === 'mpesa' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+254 721 706983"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-800">
                          <strong>M-Pesa Instructions:</strong><br />
                          1. You will receive a push notification on your phone<br />
                          2. Enter your M-Pesa PIN when prompted<br />
                          3. Confirm the payment amount: <strong>KSh {totalPrice.toLocaleString()}</strong>
                        </p>
                      </div>
                    </div>
                  )}

                  {(selectedPaymentMethod === 'card' || selectedPaymentMethod === 'visa') && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentStep('method')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300"
                >
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : `Pay KSh ${totalPrice.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}

          {currentStep === 'success' && (
            <div className="max-w-md mx-auto text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-green-600" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h3>
              <p className="text-gray-600 mb-6">
                Your tickets have been confirmed. You will receive an email confirmation shortly.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Order Reference:</p>
                <p className="font-mono text-lg font-bold text-gray-900">#MCGK-{Date.now().toString().slice(-6)}</p>
              </div>
              
              <button
                onClick={handleClose}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default PaymentModal
