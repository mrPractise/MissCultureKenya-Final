'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, ExternalLink, Share2, ArrowLeft } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import EventDetailsModal from '@/components/EventDetailsModal'
import apiClient from '@/lib/api'
import type { ApiError } from '@/lib/api'

const EventDetailPage = () => {
  const params = useParams()
  const eventId = params?.id as string
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)

  useEffect(() => {
    if (!eventId) return
    const fetchEvent = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getEvent(eventId)
        // Transform to match modal shape
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
          price: data.price || 'Free',
          organizer: data.organizer || 'Miss Culture Global Kenya',
          contactEmail: data.contact_email || 'info@misscultureglobalkenya.com',
          contactPhone: data.contact_phone || '+254 721 706983',
          ticketCategories: data.ticket_categories || [],
          audience: data.audience || 'General Public',
        }
        setEvent(transformed)
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

            {/* Tickets */}
            {event.ticketCategories && event.ticketCategories.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Tickets</h2>
                <div className="space-y-3">
                  {event.ticketCategories.map((ticket: any, i: number) => (
                    <div key={i} className="p-4 border-2 border-gray-200 rounded-xl flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-900">{ticket.name}</h4>
                        <p className="text-xs text-gray-500">{ticket.description}</p>
                      </div>
                      <span className="text-lg font-bold text-red-600">{ticket.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="flex items-center gap-3">
              <button onClick={handleShare} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors">
                <Share2 className="w-4 h-4" /> Share Event
              </button>
              <button onClick={() => setIsEventModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors">
                <ExternalLink className="w-4 h-4" /> Get Tickets
              </button>
            </div>
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
              <h3 className="font-semibold text-green-900 mb-2">Payment Info</h3>
              <p className="text-sm text-green-800 mb-2">Pay via M-Pesa Paybill:</p>
              <div className="space-y-1 text-sm font-mono">
                <p><span className="text-green-700 font-sans font-medium">Paybill:</span> 542542</p>
                <p><span className="text-green-700 font-sans font-medium">Account:</span> 0310848627615</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <EventDetailsModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        event={event}
      />
    </div>
  )
}

export default EventDetailPage
