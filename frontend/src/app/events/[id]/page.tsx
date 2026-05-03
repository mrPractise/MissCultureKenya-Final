'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, ExternalLink, Share2, ArrowLeft, Vote, Copy, Check, Ticket, AlertCircle, Loader2, Mail, Phone, User } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
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

const EventDetailPage = () => {
  const params = useParams()
  const eventId = params?.id as string
  const [event, setEvent] = useState<any>(null)
  const [rawData, setRawData] = useState<any>(null)
  const [ticketCategories, setTicketCategories] = useState<TicketCategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Ticket registration state
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
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

  const handleRegisterTicket = async () => {
    if (!regName || !regEmail) {
      setRegError('Name and email are required')
      return
    }
    setRegSubmitting(true)
    setRegError('')
    try {
      const result = await apiClient.registerFreeTicket(Number(eventId), {
        full_name: regName,
        email: regEmail,
        phone: regPhone ? `+254${regPhone}` : '',
        ticket_category: selectedCategory || undefined,
      })
      setRegSuccess(result)
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

  const isFreeEvent = ticketCategories.length > 0 && ticketCategories.every(tc => Number(tc.price) === 0)
  const hasPaidTickets = ticketCategories.some(tc => Number(tc.price) > 0)

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
            {event.voting_enabled && (
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

            {/* Ticket Categories */}
            {ticketCategories.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Tickets</h2>
                <div className="space-y-3">
                  {ticketCategories.map((tc) => (
                    <div
                      key={tc.id}
                      onClick={() => {
                        setSelectedCategory(tc.id)
                        setShowTicketForm(true)
                      }}
                      className={`p-4 border-2 rounded-xl flex justify-between items-center cursor-pointer transition-all ${
                        selectedCategory === tc.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                      }`}
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900">{tc.name}</h4>
                        {tc.description && <p className="text-xs text-gray-500">{tc.description}</p>}
                        <p className="text-xs text-gray-400 mt-1">{tc.available} of {tc.total} available</p>
                      </div>
                      <span className="text-lg font-bold text-green-700">
                        {Number(tc.price) === 0 ? 'Free' : `KES ${Number(tc.price).toLocaleString()}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Voting Section */}
            {event.voting_enabled && (
              <div className="bg-gradient-to-r from-red-50 to-green-50 rounded-xl p-5 border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <Vote className="w-5 h-5 text-red-600" />
                      Voting is Open
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      KES {event.vote_price} per vote | {event.contestant_count} contestants | {event.total_votes} votes cast
                    </p>
                  </div>
                  <Link
                    href="/voting"
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                  >
                    Vote Now
                  </Link>
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

                {isFreeEvent ? (
                  <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                    This is a free event. Fill in your details and your ticket will be generated immediately.
                  </p>
                ) : (
                  <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    This is a paid event. After registration, complete M-Pesa payment. Your ticket will be issued once payment is verified.
                  </p>
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
                    {isFreeEvent ? 'Get Free Ticket' : 'Register'}
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
                <h3 className="font-bold text-green-900 text-lg">Ticket Registered!</h3>
                {regSuccess.ticket_code && (
                  <div className="bg-white rounded-lg p-3 inline-block">
                    <p className="text-xs text-gray-500">Ticket Code</p>
                    <p className="text-xl font-bold font-mono text-green-700 tracking-widest">{regSuccess.ticket_code}</p>
                  </div>
                )}
                <p className="text-sm text-green-700">
                  {isFreeEvent
                    ? 'Your ticket is ready! Save your ticket code.'
                    : 'Complete M-Pesa payment. Your ticket will be issued once verified by admin.'}
                </p>
                {regSuccess.ticket_code && (
                  <Link
                    href={`/events/${eventId}/ticket/${regSuccess.ticket_code}`}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                  >
                    <Ticket className="w-4 h-4" /> View Ticket
                  </Link>
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
