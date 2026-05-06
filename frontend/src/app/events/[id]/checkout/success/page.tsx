'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CheckCircle, Ticket } from 'lucide-react'

type CheckoutDraft = {
  eventId: number
  totalTickets: number
  totalAmount: number
  mpesa_code?: string
  payment_id?: number
}

const storageKey = (eventId: number) => `checkout:event:${eventId}`

export default function EventCheckoutSuccessPage() {
  const params = useParams()
  const eventId = Number(params?.id)
  const [draft, setDraft] = useState<CheckoutDraft | null>(null)

  useEffect(() => {
    if (!eventId || !Number.isFinite(eventId)) return
    try {
      const raw = sessionStorage.getItem(storageKey(eventId))
      if (!raw) return
      const parsed = JSON.parse(raw) as CheckoutDraft
      setDraft(parsed)
    } catch {
      sessionStorage.removeItem(storageKey(eventId))
    }
  }, [eventId])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-green-900">Payment Submitted</h1>
          <p className="mt-2 text-sm text-green-800">
            Your payment has been submitted for verification. Your ticket(s) will be issued after confirmation.
          </p>

          {draft && (
            <div className="mt-6 bg-white border border-green-200 rounded-xl p-4 text-left">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Tickets</span>
                <span className="font-semibold text-gray-900">{draft.totalTickets}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-500">Amount</span>
                <span className="font-semibold text-gray-900">{draft.totalAmount === 0 ? 'Free' : `KES ${draft.totalAmount.toLocaleString()}`}</span>
              </div>
              {draft.mpesa_code && (
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-500">M-Pesa Code</span>
                  <span className="font-mono font-bold text-gray-900">{draft.mpesa_code}</span>
                </div>
              )}
              {draft.payment_id && (
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-500">Payment ID</span>
                  <span className="font-semibold text-gray-900">#{draft.payment_id}</span>
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

