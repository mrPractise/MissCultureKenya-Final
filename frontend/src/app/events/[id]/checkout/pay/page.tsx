'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Building2, Copy, Check, Loader2, Smartphone, Ticket } from 'lucide-react'
import apiClient from '@/lib/api'
import type { ApiError } from '@/lib/api'

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

export default function EventCheckoutPayPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = Number(params?.id)

  const [draft, setDraft] = useState<CheckoutDraft | null>(null)
  const [event, setEvent] = useState<any>(null)
  const [ticketCategories, setTicketCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [stkSent, setStkSent] = useState(false)
  const [checkoutId, setCheckoutId] = useState('')

  useEffect(() => {
    if (!eventId || !Number.isFinite(eventId)) return
    try {
      const raw = sessionStorage.getItem(storageKey(eventId))
      if (!raw) return
      const parsed = JSON.parse(raw) as CheckoutDraft
      if (!parsed?.items?.length) return
      setDraft(parsed)
    } catch {
      sessionStorage.removeItem(storageKey(eventId))
    }
  }, [eventId])

  useEffect(() => {
    const fetch = async () => {
      if (!eventId) return
      try {
        setLoading(true)
        const data = await apiClient.getEvent(eventId)
        setEvent({
          id: data.id,
          title: data.title || data.name,
          paybill_number: data.paybill_number || '542542',
          account_number: data.account_number || '0310848627615',
          account_name: data.account_name || 'The Misscomm Events',
          payment_method: data.payment_method || 'paybill',
        })

        try {
          const tcData = await apiClient.getTicketCategories(eventId)
          const tcResults = Array.isArray(tcData) ? tcData : (tcData?.results || [])
          setTicketCategories(tcResults)
        } catch {
          setTicketCategories([])
        }
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [eventId])

  const orderLines = useMemo(() => {
    if (!draft) return []
    const map = new Map<number, any>()
    for (const tc of ticketCategories) map.set(tc.id, tc)
    return draft.items.map((item) => {
      const tc = map.get(item.ticket_category_id)
      const name = tc?.name || `Category #${item.ticket_category_id}`
      const price = Number(tc?.price || 0)
      return { ...item, name, price, lineTotal: price * item.quantity }
    })
  }, [draft, ticketCategories])

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 1500)
  }

  const handleSendStk = async () => {
    if (!draft) return
    if (!draft.full_name || !draft.email) {
      setError('Missing buyer details. Go back to checkout.')
      return
    }
    if (!draft.phone) {
      setError('Phone is required for M-Pesa STK push. Go back to checkout.')
      return
    }
    const ticket_breakdown: Record<string, number> = {}
    for (const item of draft.items) ticket_breakdown[String(item.ticket_category_id)] = item.quantity

    setSubmitting(true)
    setError('')
    try {
      const result = await apiClient.initiateTicketPayment(draft.eventId, {
        phone_number: draft.phone,
        full_name: draft.full_name,
        email: draft.email,
        ticket_breakdown,
      })
      if (result?.success) {
        setStkSent(true)
        setCheckoutId(result.checkout_request_id || '')
        sessionStorage.setItem(storageKey(eventId), JSON.stringify({ ...draft, payment_id: result?.payment_id, checkout_request_id: result?.checkout_request_id }))
        router.push(`/events/${eventId}/checkout/success`)
      } else {
        setError(result?.error || 'Failed to initiate STK Push.')
      }
    } catch (err: any) {
      const apiErr = err as ApiError
      setError(apiErr?.message || 'Failed to initiate payment')
    } finally {
      setSubmitting(false)
    }
  }

  if (!draft) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href={`/events/${eventId || ''}`} className="inline-flex items-center gap-2 text-green-700 hover:text-green-600 font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Event
          </Link>
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
            <p className="mt-2 text-gray-600">
              Your checkout session is empty. Go back to the event and select your ticket quantities.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href={`/events/${eventId}/checkout`} className="inline-flex items-center gap-2 text-green-700 hover:text-green-600 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Checkout
        </Link>

        <div className="mt-6 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
            <p className="text-sm text-gray-600 mt-1">{event?.title || 'Event'} · {draft.totalTickets} ticket{draft.totalTickets > 1 ? 's' : ''}</p>
          </div>

          <div className="p-6 space-y-5 bg-gray-50">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-900 mb-3">Order Summary</p>
              <div className="space-y-2">
                {orderLines.map((l) => (
                  <div key={`${l.ticket_category_id}`} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{l.name} <span className="text-gray-400">x{l.quantity}</span></span>
                    <span className="font-semibold text-gray-900">{l.lineTotal === 0 ? 'Free' : `KES ${l.lineTotal.toLocaleString()}`}</span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-2 mt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">Total</span>
                  <span className="text-sm font-bold text-green-700">{draft.totalAmount === 0 ? 'Free' : `KES ${draft.totalAmount.toLocaleString()}`}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h2 className="font-semibold text-green-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Pay with M-Pesa (STK Push)
              </h2>
              <p className="mt-2 text-sm text-green-800">
                Tap the button below and an M-Pesa prompt will be sent to your phone. Enter your PIN to complete payment.
              </p>
              {draft.phone && (
                <p className="mt-2 text-xs text-green-700">
                  Phone: <span className="font-semibold">{draft.phone}</span>
                  {checkoutId ? <span className="text-green-600"> · Ref: {checkoutId.slice(-8)}</span> : null}
                </p>
              )}
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-900 text-white px-4 py-3 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span className="font-semibold">Payment Details</span>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Paybill</p>
                    <p className="text-lg font-bold text-gray-900 font-mono">{event?.paybill_number || '542542'}</p>
                  </div>
                  <button onClick={() => handleCopy(event?.paybill_number || '542542', 'paybill')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    {copiedField === 'paybill' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Account</p>
                    <p className="text-lg font-bold text-gray-900 font-mono">{event?.account_number || '0310848627615'}</p>
                  </div>
                  <button onClick={() => handleCopy(event?.account_number || '0310848627615', 'account')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    {copiedField === 'account' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Account Name</p>
                    <p className="text-lg font-bold text-gray-900">{event?.account_name || 'The Misscomm Events'}</p>
                  </div>
                  <button onClick={() => handleCopy(event?.account_name || 'The Misscomm Events', 'name')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    {copiedField === 'name' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          <div className="p-6 flex items-center justify-between gap-3">
            <Link
              href={`/events/${eventId}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
            >
              <Ticket className="w-4 h-4" /> Back to Event
            </Link>
            <button
              type="button"
              onClick={handleSendStk}
              disabled={submitting || loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white transition-colors"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {stkSent ? 'STK Sent' : 'Send M-Pesa Prompt'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
