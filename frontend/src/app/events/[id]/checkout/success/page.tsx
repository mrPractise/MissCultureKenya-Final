'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CheckCircle, Ticket, Loader2, AlertCircle, Copy, Check } from 'lucide-react'
import apiClient from '@/lib/api'

type CheckoutDraft = {
  eventId: number
  totalTickets: number
  totalAmount: number
  mpesa_code?: string
  payment_id?: number
  checkout_request_id?: string
}

const storageKey = (eventId: number) => `checkout:event:${eventId}`

export default function EventCheckoutSuccessPage() {
  const params = useParams()
  const eventId = Number(params?.id)
  const [draft, setDraft] = useState<CheckoutDraft | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'successful' | 'failed'>('pending')
  const [issuedTickets, setIssuedTickets] = useState<any[]>([])
  const [error, setError] = useState('')
  const pollingInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!eventId || !Number.isFinite(eventId)) return
    try {
      const raw = sessionStorage.getItem(storageKey(eventId))
      if (!raw) return
      const parsed = JSON.parse(raw) as CheckoutDraft
      setDraft(parsed)
      
      if (parsed.payment_id) {
        startPolling(parsed.payment_id)
      }
    } catch {
      sessionStorage.removeItem(storageKey(eventId))
    }
    return () => stopPolling()
  }, [eventId])

  const startPolling = (paymentId: number) => {
    if (pollingInterval.current) return
    pollingInterval.current = setInterval(() => checkStatus(paymentId), 3000)
  }

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current)
      pollingInterval.current = null
    }
  }

  const checkStatus = async (paymentId: number) => {
    try {
      const data = await apiClient.getPaymentStatus(paymentId)
      if (data.status === 'successful') {
        setPaymentStatus('successful')
        // Fetch tickets
        try {
          const ticketData = await apiClient.get('/api/events/tickets/', { payment: paymentId })
          const tickets = Array.isArray(ticketData) ? ticketData : (ticketData?.results || [])
          setIssuedTickets(tickets)
        } catch (e) {
          console.error('Failed to fetch tickets', e)
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`border rounded-2xl p-8 text-center ${
          paymentStatus === 'successful' ? 'bg-green-50 border-green-200' : 
          paymentStatus === 'failed' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
        }`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
            paymentStatus === 'successful' ? 'bg-green-100' : 
            paymentStatus === 'failed' ? 'bg-red-100' : 'bg-blue-100'
          }`}>
            {paymentStatus === 'successful' ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : paymentStatus === 'failed' ? (
              <AlertCircle className="w-10 h-10 text-red-600" />
            ) : (
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            )}
          </div>
          
          <h1 className={`mt-4 text-2xl font-bold ${
            paymentStatus === 'successful' ? 'text-green-900' : 
            paymentStatus === 'failed' ? 'text-red-900' : 'text-blue-900'
          }`}>
            {paymentStatus === 'successful' ? 'Payment Successful!' : 
             paymentStatus === 'failed' ? 'Payment Failed' : 'Confirming Payment'}
          </h1>
          
          <p className={`mt-2 text-sm ${
            paymentStatus === 'successful' ? 'text-green-800' : 
            paymentStatus === 'failed' ? 'text-red-800' : 'text-blue-800'
          }`}>
            {paymentStatus === 'successful' ? 'Your tickets have been issued. You can view them below.' :
             paymentStatus === 'failed' ? (error || 'The payment could not be completed. Please try again.') :
             'We are waiting for IntaSend confirmation. Your ticket(s) will be issued automatically after payment confirmation.'}
          </p>

          {paymentStatus === 'successful' && issuedTickets.length > 0 && (
            <div className="mt-6 space-y-3">
              <div className="bg-white border border-green-200 rounded-xl p-4 text-left">
                <p className="text-xs text-green-600 font-bold uppercase mb-2">Your Ticket Codes</p>
                <div className="grid grid-cols-1 gap-2">
                  {issuedTickets.map((t, i) => (
                    <div key={i} className="flex items-center justify-between bg-green-50/30 p-3 rounded-lg border border-green-100">
                      <div>
                        <p className="font-mono font-bold text-green-700 text-lg tracking-wider">{t.ticket_code}</p>
                        <p className="text-[10px] text-gray-500 uppercase">{t.ticket_category_name}</p>
                      </div>
                      <Link 
                        href={`/events/${eventId}/ticket/${t.ticket_code}`}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        title="View Ticket"
                      >
                        <Ticket className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {draft && (
            <div className={`mt-6 bg-white border rounded-xl p-4 text-left ${
              paymentStatus === 'successful' ? 'border-green-200' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Tickets</span>
                <span className="font-semibold text-gray-900">{draft.totalTickets}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-500">Amount</span>
                <span className="font-semibold text-gray-900">{draft.totalAmount === 0 ? 'Free' : `KES ${draft.totalAmount.toLocaleString()}`}</span>
              </div>
              {draft.checkout_request_id && paymentStatus === 'pending' && (
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-500">Reference</span>
                  <span className="font-mono font-semibold text-gray-900">{draft.checkout_request_id.slice(-8)}</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/events/${eventId}`}
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors"
            >
              <Ticket className="w-4 h-4" /> Back to Event
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-semibold transition-colors"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
