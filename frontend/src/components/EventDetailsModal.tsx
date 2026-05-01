'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, ExternalLink, Share2, X } from 'lucide-react'
import { useState, useCallback } from 'react'
import PaymentModal from './PaymentModal'

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
  currentVotes?: number
}

interface EventDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  event: Event | null
}

const EventDetailsModal = ({ isOpen, onClose, event }: EventDetailsModalProps) => {
  const [selectedTicketCategory, setSelectedTicketCategory] = useState<string | null>(null)
  const [ticketQuantities, setTicketQuantities] = useState<{[key: string]: number}>({})
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const handleShare = useCallback(async () => {
    if (!event) return
    const eventUrl = `https://misscultureglobalkenya.com/events/${event.id}`
    const shareData = {
      title: event.title,
      text: `Check out ${event.title} — ${event.date} at ${event.venue}`,
      url: eventUrl,
    }
    if (navigator.share) {
      try { await navigator.share(shareData) } catch {}
    } else {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`)
      alert('Link copied to clipboard!')
    }
  }, [event])

  if (!isOpen || !event) return null

  const updateQuantity = (ticketName: string, quantity: number) => {
    setTicketQuantities(prev => ({
      ...prev,
      [ticketName]: Math.max(0, Math.min(quantity, event?.ticketCategories?.find(t => t.name === ticketName)?.available || 0))
    }))
  }

  const getTotalTickets = () => {
    return Object.values(ticketQuantities).reduce((sum, qty) => sum + qty, 0)
  }

  const getTotalPrice = () => {
    if (!event?.ticketCategories) return 0
    
    return Object.entries(ticketQuantities).reduce((total, [ticketName, quantity]) => {
      const ticket = event.ticketCategories?.find(t => t.name === ticketName)
      if (!ticket || quantity === 0) return total
      
      // Extract numeric value from price string
      const priceValue = ticket.price === 'Free' ? 0 : parseInt(ticket.price.replace(/[^\d]/g, ''))
      return total + (priceValue * quantity)
    }, 0)
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-white w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col lg:flex-row rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Panel – Image (desktop) / Header (mobile) */}
        <div className="relative flex-shrink-0 lg:w-[45%] lg:max-h-full">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-40 sm:h-48 lg:h-full object-cover"
            />
          ) : (
            <div className="w-full h-40 sm:h-48 lg:h-full bg-gradient-to-br from-green-800 to-green-900 flex items-center justify-center">
              <Calendar className="w-16 h-16 text-green-400/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute top-3 left-3">
            <span className="bg-green-600 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">
              {event.category}
            </span>
          </div>
          <div className="absolute top-3 right-12 lg:right-auto lg:top-auto lg:bottom-3 lg:left-3">
            <span className="bg-white/90 text-gray-900 px-2.5 py-0.5 rounded-full text-xs font-semibold">
              {event.price}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-14 text-white lg:bottom-3 lg:left-3 lg:right-3">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-0.5 leading-tight">{event.title}</h2>
            <p className="text-gray-200 text-xs lg:text-sm line-clamp-2">{event.description}</p>
          </div>
        </div>

        {/* Right Panel – Details & Tickets */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Close Button */}
          <div className="flex items-center justify-between px-6 pt-5 pb-2 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Event Details</h3>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 lg:p-6">
            <div className="space-y-5">
              {/* Quick Info Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 bg-green-50 rounded-xl px-3 py-2.5">
                  <Calendar className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-xs font-semibold text-gray-900 truncate">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-green-50 rounded-xl px-3 py-2.5">
                  <Clock className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="text-xs font-semibold text-gray-900 truncate">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-green-50 rounded-xl px-3 py-2.5">
                  <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Venue</p>
                    <p className="text-xs font-semibold text-gray-900 truncate">{event.venue}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-green-50 rounded-xl px-3 py-2.5">
                  <Users className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Capacity</p>
                    <p className="text-xs font-semibold text-gray-900 truncate">{event.capacity} guests</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-1.5 text-sm">About This Event</h4>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 lg:line-clamp-3">{event.description}</p>
              </div>

              {/* Organizer & Contact – compact row */}
              {(event.organizer || event.contactEmail) && (
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
                  {event.organizer && (
                    <div>
                      <span className="text-gray-500">Organizer: </span>
                      <span className="font-medium text-gray-900">{event.organizer}</span>
                    </div>
                  )}
                  {event.contactEmail && (
                    <div>
                      <span className="text-gray-500">Contact: </span>
                      <a href={`mailto:${event.contactEmail}`} className="font-medium text-green-700 hover:text-green-600 underline underline-offset-2">{event.contactEmail}</a>
                      {event.contactPhone && (
                        <>
                          <span className="text-gray-400"> · </span>
                          <a href={`tel:${event.contactPhone}`} className="font-medium text-green-700 hover:text-green-600 underline underline-offset-2">{event.contactPhone}</a>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Ticket Categories */}
              {event.ticketCategories && event.ticketCategories.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2.5 text-sm">Tickets</h4>
                  <div className="space-y-2">
                    {event.ticketCategories.map((ticket, index) => (
                      <div
                        key={index}
                        className={`p-3 border-2 rounded-xl transition-all duration-200 ${
                          selectedTicketCategory === ticket.name
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-900 text-sm">{ticket.name}</h5>
                            <p className="text-xs text-gray-500">{ticket.description} · {ticket.available}/{ticket.total} left</p>
                          </div>
                          <p className="text-sm font-bold text-red-600 ml-3">{ticket.price}</p>
                        </div>
                        
                        {/* Quantity Selector */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(ticket.name, (ticketQuantities[ticket.name] || 0) - 1)}
                              disabled={(ticketQuantities[ticket.name] || 0) <= 0}
                              className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 text-xs"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold text-gray-900 text-sm">
                              {ticketQuantities[ticket.name] || 0}
                            </span>
                            <button
                              onClick={() => updateQuantity(ticket.name, (ticketQuantities[ticket.name] || 0) + 1)}
                              disabled={(ticketQuantities[ticket.name] || 0) >= ticket.available}
                              className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 text-xs"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => setSelectedTicketCategory(selectedTicketCategory === ticket.name ? null : ticket.name)}
                            className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors duration-200 ${
                              selectedTicketCategory === ticket.name
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {selectedTicketCategory === ticket.name ? 'Selected' : 'Select'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Total Summary */}
                  {getTotalTickets() > 0 && (
                    <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs text-gray-500">{getTotalTickets()} ticket{getTotalTickets() > 1 ? 's' : ''}</span>
                        </div>
                        <span className="text-base font-bold text-red-600">
                          {getTotalPrice() === 0 ? 'Free' : `KSh ${getTotalPrice().toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Action Bar */}
          <div className="flex-shrink-0 border-t border-gray-100 bg-white px-5 py-3 lg:px-6 lg:py-4">
            <div className="flex gap-3">
              <button 
                onClick={() => setIsPaymentModalOpen(true)}
                disabled={getTotalTickets() === 0}
                className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors duration-300 flex items-center justify-center space-x-2 ${
                  getTotalTickets() > 0 
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ExternalLink className="w-4 h-4" />
                <span>Get Tickets{getTotalTickets() > 0 ? ` (${getTotalTickets()})` : ''}</span>
              </button>

              <button 
                onClick={handleShare}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        event={event}
        ticketQuantities={ticketQuantities}
        totalPrice={getTotalPrice()}
        totalTickets={getTotalTickets()}
      />
    </div>
  )
}

export default EventDetailsModal
