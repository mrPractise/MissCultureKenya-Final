'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Ticket, User, Mail, Phone } from 'lucide-react'

type CheckoutItem = {
  ticket_category_id: number
  quantity: number
}

type CheckoutDraft = {
  eventId: number
  items: CheckoutItem[]
  totalTickets: number
  totalAmount: number
  full_name?: string
  email?: string
  phone?: string
}

const storageKey = (eventId: number) => `checkout:event:${eventId}`

export default function EventCheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = Number(params?.id)

  const [draft, setDraft] = useState<CheckoutDraft | null>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!eventId || !Number.isFinite(eventId)) return
    try {
      const raw = sessionStorage.getItem(storageKey(eventId))
      if (!raw) return
      const parsed = JSON.parse(raw) as CheckoutDraft
      if (!parsed?.items?.length) return
      setDraft(parsed)
      setFullName(parsed.full_name || '')
      setEmail(parsed.email || '')
      setPhone((parsed.phone || '').replace(/^\+254/, ''))
    } catch {
      sessionStorage.removeItem(storageKey(eventId))
    }
  }, [eventId])

  const canContinue = useMemo(() => {
    return Boolean(draft && draft.items.length > 0 && fullName.trim() && email.trim())
  }, [draft, email, fullName])

  const handleContinue = () => {
    if (!draft) return
    if (!fullName.trim() || !email.trim()) {
      setError('Full name and email are required')
      return
    }
    const next: CheckoutDraft = {
      ...draft,
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone ? `+254${phone}` : '',
    }
    sessionStorage.setItem(storageKey(eventId), JSON.stringify(next))
    router.push(`/events/${eventId}/checkout/pay`)
  }

  if (!draft) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href={`/events/${eventId || ''}`} className="inline-flex items-center gap-2 text-green-700 hover:text-green-600 font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Event
          </Link>
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="mt-2 text-gray-600">
              Your checkout session is empty. Go back to the event and select your ticket quantities.
            </p>
            <Link
              href={`/events/${eventId || ''}`}
              className="mt-6 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors"
            >
              <Ticket className="w-4 h-4" /> Select Tickets
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href={`/events/${eventId}`} className="inline-flex items-center gap-2 text-green-700 hover:text-green-600 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Event
        </Link>

        <div className="mt-6 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-sm text-gray-600 mt-1">{draft.totalTickets} ticket{draft.totalTickets > 1 ? 's' : ''} · {draft.totalAmount === 0 ? 'Free' : `KES ${draft.totalAmount.toLocaleString()}`}</p>
          </div>

          <div className="p-6 space-y-4 bg-gray-50">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setError('') }}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl text-sm text-gray-600 font-medium">+254</span>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setError('') }}
                    placeholder="712345678"
                    maxLength={9}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-r-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          <div className="p-6 flex items-center justify-end gap-3">
            <Link
              href={`/events/${eventId}`}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white transition-colors"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

