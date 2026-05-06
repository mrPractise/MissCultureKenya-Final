'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, ExternalLink, Share2, ArrowLeft, Vote, Copy, Check, Ticket, AlertCircle, Loader2, Mail, Phone, User } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import apiClient from '@/lib/api'
import type { ApiError } from '@/lib/api'

interface TicketCategoryData {
  id: number
  name: string
  price: string
  description: string
  available: number
  total: number
  is_active: boolean
}

interface ContestantData {
  id: number
  name: string
  bio: string
  photo_url: string | null
  contestant_number: number
  slug: string
}

const EventDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const eventId = params?.id as string
  const [event, setEvent] = useState<any>(null)
  const [rawData, setRawData] = useState<any>(null)
  const [ticketCategories, setTicketCategories] = useState<TicketCategoryData[]>([])
  const [contestants, setContestants] = useState<ContestantData[]>([])
  const [contestantsLoading, setContestantsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Ticket registration state
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [ticketQuantities, setTicketQuantities] = useState<Record<number, number>>({})
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regMpesaCode, setRegMpesaCode] = useState('')
  const [regSubmitting, setRegSubmitting] = useState(false)
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState<any>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    if (!eventId) return
    const fetchEvent = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getEvent(eventId)
        setRawData(data)
        const transformed = {
          id: data.id,
          title: data.title || data.name,
          date: data.start_date || data.date,
          time: data.start_time || data.time || '10:00 AM',
          venue: data.venue_name || data.venue,
          location: `${data.city || ''}, ${data.country || 'Kenya'}`.trim().replace(/^,\s*/, ''),
          description: data.description,
          image: data.featured_image_url || data.featured_image || data.image || '',
          category: data.event_type || data.category || 'Event',
          capacity: data.capacity || 0,
          price: data.ticket_price ? `KES ${Number(data.ticket_price).toLocaleString()}` : 'Free',
          organizer: data.organizer || 'Miss Culture Global Kenya',
          contactEmail: data.contact_email || 'info@misscultureglobalkenya.com',
          contactPhone: data.contact_phone || '+254 721 706983',
          audience: data.audience || 'General Public',
          voting_enabled: data.voting_enabled || false,
          is_voting_active: data.is_voting_active || false,
          vote_price: data.vote_price || 10,
          event_status: data.event_status || 'draft',
          paybill_number: data.paybill_number || '542542',
          account_number: data.account_number || '0310848627615',
          account_name: data.account_name || 'The Misscomm Events',
          payment_method: data.payment_method || 'paybill',
          contestant_count: data.contestant_count || 0,
          total_votes: data.total_votes || 0,
          slug: data.slug || '',
        }
        setEvent(transformed)

        // Fetch ticket categories from API
        try {
          const tcData = await apiClient.getTicketCategories(data.id)
          const tcResults = Array.isArray(tcData) ? tcData : (tcData?.results || [])
          setTicketCategories(tcResults)
        } catch {
          // Ticket categories not available, that's OK
        }

        setContestantsLoading(true)
        try {
          const cData = await apiClient.getEventContestants(data.id, { is_active: true })
          const cResults = Array.isArray(cData) ? cData : (cData?.results || [])
          setContestants(cResults)
        } catch {
          setContestants([])
        } finally {
          setContestantsLoading(false)
        }
      } catch (err: any) {
        const apiErr = err as ApiError
        setError(apiErr?.message || 'Failed to load event. It may not exist or has been removed.')
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [eventId])

  const handleShare = useCallback(async () => {
    if (!event) return
    const eventUrl = `https://misscultureglobalkenya.com/events/${event.id}`
    const shareData = { title: event.title, text: `Check out ${event.title} — ${event.date} at ${event.venue}`, url: eventUrl }
    if (navigator.share) {
      try { await navigator.share(shareData) } catch {}
    } else {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`)
      alert('Link copied to clipboard!')
    }
  }, [event])

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    })
  }

  const selectedItems = ticketCategories
    .map((tc) => ({ tc, qty: ticketQuantities[tc.id] || 0 }))
    .filter((x) => x.qty > 0)

  const totalTickets = selectedItems.reduce((sum, x) => sum + x.qty, 0)
  const totalAmount = selectedItems.reduce((sum, x) => sum + (Number(x.tc.price) * x.qty), 0)
  const requiresPayment = totalAmount > 0

  const updateTicketQuantity = (ticketCategoryId: number, nextQty: number) => {
    const tc = ticketCategories.find((x) => x.id === ticketCategoryId)
    const maxAvail = Number(tc?.available || 0)
    const clamped = maxAvail > 0 ? Math.max(0, Math.min(nextQty, maxAvail)) : Math.max(0, nextQty)
    setTicketQuantities((prev) => ({ ...prev, [ticketCategoryId]: clamped }))
  }

  const startCheckout = () => {
    const numericEventId = Number(eventId)
    if (!numericEventId || !Number.isFinite(numericEventId)) return
    if (selectedItems.length === 0) {
      setRegError('Select at least one ticket category and quantity')
      return
    }
    const draft = {
      eventId: numericEventId,
      items: selectedItems.map((x) => ({ ticket_category_id: x.tc.id, quantity: x.qty })),
      totalTickets,
      totalAmount,
    }
    sessionStorage.setItem(`checkout:event:${numericEventId}`, JSON.stringify(draft))
    router.push(`/events/${numericEventId}/checkout`)
  }

  const handleRegisterTicket = async () => {
    if (!regName || !regEmail) {
      setRegError('Name and email are required')
      return
    }
    if (selectedItems.length === 0) {
      setRegError('Select at least one ticket category and quantity')
      return
    }

    for (const item of selectedItems) {
      const maxAvail = Number(item.tc.available || 0)
      if (maxAvail > 0 && item.qty > maxAvail) {
        setRegError(`Only ${maxAvail} ticket(s) available for "${item.tc.name}"`)
        return
      }
    }

    if (requiresPayment) {
      startCheckout()
      return
    }

    setRegSubmitting(true)
    setRegError('')
    try {
      if (requiresPayment) {
        const breakdown: Record<string, number> = {}
        for (const item of selectedItems) breakdown[String(item.tc.id)] = item.qty

        const payment = await apiClient.createPayment({
          event: Number(eventId),
          phone_number: `+254${regPhone}`,
          mpesa_code: regMpesaCode.trim().toUpperCase(),
          amount: totalAmount,
          status: 'pending',
          payment_type: 'ticket',
          ticket_breakdown: breakdown,
          ticket_quantity: totalTickets,
          full_name: regName,
          email: regEmail,
        })
        setRegSuccess({ payment_pending: true, payment })
      } else {
        const ticketCodes: string[] = []
        for (const item of selectedItems) {
          for (let i = 0; i < item.qty; i += 1) {
            const result = await apiClient.registerFreeTicket(Number(eventId), {
              full_name: regName,
              email: regEmail,
              phone: regPhone ? `+254${regPhone}` : '',
              ticket_category: item.tc.id,
            })
            if (result?.ticket_code) ticketCodes.push(result.ticket_code)
          }
        }
        setRegSuccess({ ticket_codes: ticketCodes })
      }
    } catch (err) {
      const apiErr = err as ApiError
      setRegError(apiErr.message || 'Failed to register ticket')
    } finally {
      setRegSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
          <p className="mt-4 text-gray-600">Loading event...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This event may have been removed or the link is incorrect.'}</p>
          <Link href="/events" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>
        </div>
      </div>
    )
  }

  const isVotingOpen = Boolean(event.voting_enabled && (event.is_voting_active || event.event_status === 'voting_open'))

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[350px] flex items-end overflow-hidden">
        {event.image ? (
          <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-green-800 to-green-900" />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <Link href="/events" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Events
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">{event.category}</span>
            {event.audience && <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">{event.audience}</span>}
            <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">{event.price}</span>
            {isVotingOpen && (
              <Link href="/voting" className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 hover:bg-red-700 transition-colors">
                <Vote className="w-3 h-3" /> Voting Open
              </Link>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">{event.title}</h1>
          <p className="text-gray-200 text-sm sm:text-base line-clamp-2 max-w-2xl">{event.description}</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Calendar, label: 'Date', value: new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
                { icon: Clock, label: 'Time', value: event.time },
                { icon: MapPin, label: 'Venue', value: event.venue },
                { icon: Users, label: 'Capacity', value: `${event.capacity} guests` },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-2 bg-green-50 rounded-xl px-3 py-3">
                  <item.icon className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-xs font-semibold text-gray-900 truncate">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">About This Event</h2>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>

            {(contestantsLoading || contestants.length > 0) && (
              <div>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <h2 className="text-xl font-bold text-gray-900">Participants</h2>
                  {!event.voting_enabled && (
                    <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      Voting not open yet
                    </span>
                  )}
                </div>
                {contestantsLoading ? (
                  <p className="text-sm text-gray-500">Loading participants...</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {contestants.map((c) => (
                      <div key={c.id} className="border border-gray-200 rounded-xl p-4 bg-white">
                        <div className="flex items-start gap-3">
                          {c.photo_url ? (
                            <img
                              src={c.photo_url}
                              alt={c.name}
                              className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                              <Users className="w-5 h-5 text-green-600" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-semibold text-gray-900 truncate">{c.name}</p>
                              <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full flex-shrink-0">
                                #{c.contestant_number}
                              </span>
                            </div>
                            {c.bio && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-3">{c.bio}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Ticket Categories */}
            {ticketCategories.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Tickets</h2>
                <div className="space-y-3">
                  {ticketCategories.map((tc) => (
                    <div
                      key={tc.id}
                      className="p-4 border-2 rounded-xl flex justify-between items-center transition-all border-gray-200 hover:border-green-300 hover:bg-green-50/50"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900">{tc.name}</h4>
                        {tc.description && <p className="text-xs text-gray-500">{tc.description}</p>}
                        <p className="text-xs text-gray-400 mt-1">{tc.available} of {tc.total} available</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-green-700 whitespace-nowrap">
                          {Number(tc.price) === 0 ? 'Free' : `KES ${Number(tc.price).toLocaleString()}`}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateTicketQuantity(tc.id, (ticketQuantities[tc.id] || 0) - 1)}
                            disabled={(ticketQuantities[tc.id] || 0) <= 0}
                            className="w-9 h-9 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-bold"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-900">
                            {ticketQuantities[tc.id] || 0}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateTicketQuantity(tc.id, (ticketQuantities[tc.id] || 0) + 1)}
                            disabled={Number(tc.available) > 0 && (ticketQuantities[tc.id] || 0) >= Number(tc.available)}
                            className="w-9 h-9 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {totalTickets > 0 && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{totalTickets} ticket{totalTickets > 1 ? 's' : ''} selected</p>
                      <p className="text-xs text-gray-600">
                        Total: {totalAmount === 0 ? 'Free' : `KES ${totalAmount.toLocaleString()}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setRegError('')
                        if (totalAmount > 0) {
                          startCheckout()
                          return
                        }
                        setShowTicketForm(true)
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                    >
                      {totalAmount > 0 ? 'Checkout' : 'Continue'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Voting Section */}
            {event.voting_enabled && (
              <div className="bg-gradient-to-r from-red-50 to-green-50 rounded-xl p-5 border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <Vote className="w-5 h-5 text-red-600" />
                      {isVotingOpen ? 'Voting is Open' : 'Voting is Closed'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      KES {event.vote_price} per vote | {event.contestant_count} contestants | {event.total_votes} votes cast
                    </p>
                    {!isVotingOpen && (
                      <p className="text-xs text-gray-500 mt-1">
                        Voting is enabled for this event, but it is not currently active.
                      </p>
                    )}
                  </div>
                  {isVotingOpen ? (
                    <Link
                      href="/voting"
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                    >
                      Vote Now
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="bg-gray-200 text-gray-500 px-5 py-2.5 rounded-xl font-semibold text-sm cursor-not-allowed"
                    >
                      Vote Closed
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="flex items-center gap-3">
              <button onClick={handleShare} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors">
                <Share2 className="w-4 h-4" /> Share Event
              </button>
              {ticketCategories.length === 0 && (
                <button onClick={() => setShowTicketForm(true)} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors">
                  <Ticket className="w-4 h-4" /> Register
                </button>
              )}
            </div>

            {/* Ticket Registration Form */}
            {showTicketForm && !regSuccess && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
                <h3 className="font-bold text-gray-900">Register for This Event</h3>

                {!requiresPayment ? (
                  <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                    This is a free event. Fill in your details and your ticket will be generated immediately.
                  </p>
                ) : (
                  <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    This is a paid ticket. Pay via M-Pesa, then enter your M-Pesa code below to submit for verification.
                  </p>
                )}

                {selectedItems.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Your Order</p>
                    <div className="space-y-1">
                      {selectedItems.map(({ tc, qty }) => (
                        <div key={tc.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{tc.name} <span className="text-gray-400">x{qty}</span></span>
                          <span className="font-semibold text-gray-900">
                            {Number(tc.price) === 0 ? 'Free' : `KES ${(Number(tc.price) * qty).toLocaleString()}`}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-gray-100 pt-2 mt-2 flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">Total</span>
                        <span className="text-sm font-bold text-green-700">{totalAmount === 0 ? 'Free' : `KES ${totalAmount.toLocaleString()}`}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => { setRegName(e.target.value); setRegError('') }}
                      placeholder="Your full name"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => { setRegEmail(e.target.value); setRegError('') }}
                      placeholder="your@email.com"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl text-sm text-gray-600 font-medium">+254</span>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="712345678"
                      maxLength={9}
                      className="flex-1 px-3 py-2.5 border border-gray-300 rounded-r-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                {requiresPayment && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Code *</label>
                    <input
                      type="text"
                      value={regMpesaCode}
                      onChange={(e) => { setRegMpesaCode(e.target.value); setRegError('') }}
                      placeholder="e.g. QWE12ABC3D"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter the transaction code from your M-Pesa message after paying.
                    </p>
                  </div>
                )}

                {regError && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{regError}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowTicketForm(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-xl font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRegisterTicket}
                    disabled={regSubmitting}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {regSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ticket className="w-4 h-4" />}
                    {!requiresPayment ? 'Get Ticket' : 'Submit Payment'}
                  </button>
                </div>
              </div>
            )}

            {/* Registration Success */}
            {regSuccess && (
              <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-green-900 text-lg">
                  {regSuccess?.ticket_code || regSuccess?.ticket_codes?.length ? 'Ticket Registered!' : 'Payment Submitted!'}
                </h3>
                {(regSuccess.ticket_code || regSuccess?.ticket_codes?.length) && (
                  <div className="bg-white rounded-lg p-3 inline-block text-left">
                    <p className="text-xs text-gray-500 mb-2">Ticket Code{regSuccess?.ticket_codes?.length > 1 ? 's' : ''}</p>
                    {regSuccess.ticket_code && (
                      <p className="text-xl font-bold font-mono text-green-700 tracking-widest">{regSuccess.ticket_code}</p>
                    )}
                    {Array.isArray(regSuccess.ticket_codes) && regSuccess.ticket_codes.length > 0 && (
                      <div className="space-y-1">
                        {regSuccess.ticket_codes.map((code: string) => (
                          <p key={code} className="text-sm font-bold font-mono text-green-700 tracking-widest">{code}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <p className="text-sm text-green-700">
                  {regSuccess?.ticket_code || regSuccess?.ticket_codes?.length
                    ? 'Your ticket is ready! Save your ticket code.'
                    : 'Your payment has been submitted for verification. Your ticket will be issued after confirmation.'}
                </p>
                {regSuccess.ticket_code && (
                  <Link
                    href={`/events/${eventId}/ticket/${regSuccess.ticket_code}`}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                  >
                    <Ticket className="w-4 h-4" /> View Ticket
                  </Link>
                )}
                {Array.isArray(regSuccess.ticket_codes) && regSuccess.ticket_codes.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {regSuccess.ticket_codes.map((code: string) => (
                      <Link
                        key={code}
                        href={`/events/${eventId}/ticket/${code}`}
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
                      >
                        <Ticket className="w-4 h-4" /> View {code}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Organizer Card */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Organizer</h3>
              <p className="text-gray-700 text-sm mb-2">{event.organizer}</p>
              {event.contactEmail && (
                <a href={`mailto:${event.contactEmail}`} className="text-green-700 hover:text-green-600 text-sm underline underline-offset-2 block mb-1">{event.contactEmail}</a>
              )}
              {event.contactPhone && (
                <a href={`tel:${event.contactPhone}`} className="text-green-700 hover:text-green-600 text-sm underline underline-offset-2 block">{event.contactPhone}</a>
              )}
            </div>

            {/* Payment Info */}
            <div className="bg-green-50 rounded-xl p-5 border border-green-100">
              <h3 className="font-semibold text-green-900 mb-3">Payment Info</h3>
              <p className="text-sm text-green-800 mb-3">Pay via M-Pesa Paybill:</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-green-600 uppercase tracking-wider font-medium">Paybill</p>
                    <p className="text-lg font-bold text-gray-900 font-mono">{event.paybill_number}</p>
                  </div>
                  <button onClick={() => handleCopy(event.paybill_number, 'paybill')} className="p-1.5 rounded-lg hover:bg-green-100 transition-colors">
                    {copiedField === 'paybill' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-green-500" />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-green-600 uppercase tracking-wider font-medium">Account</p>
                    <p className="text-sm font-bold text-gray-900 font-mono">{event.account_number}</p>
                  </div>
                  <button onClick={() => handleCopy(event.account_number, 'account')} className="p-1.5 rounded-lg hover:bg-green-100 transition-colors">
                    {copiedField === 'account' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-green-500" />}
                  </button>
                </div>
                <p className="text-xs text-green-700 pt-1">{event.account_name}</p>
              </div>
            </div>

            {/* Event Status */}
            {event.event_status && (
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">Event Status</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  event.event_status === 'voting_open' ? 'bg-red-100 text-red-700' :
                  event.event_status === 'active' ? 'bg-green-100 text-green-700' :
                  event.event_status === 'draft' ? 'bg-gray-100 text-gray-600' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {event.event_status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default EventDetailPage
