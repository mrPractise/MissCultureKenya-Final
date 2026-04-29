'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, Users, ExternalLink, ArrowRight, Camera, Heart, Sparkles, Handshake, Quote, Ticket } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import EventDetailsModal from '@/components/EventDetailsModal'
import ContactModal from '@/components/ContactModal'
import apiClient from '@/lib/api'
import { useSiteSettings } from '@/lib/useSiteSettings'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
}
const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

const EVENT_CATEGORIES = [
  { key: 'All', label: 'All Events', desc: 'Browse everything' },
  { key: 'Pageant', label: 'Pageant Events', desc: 'Competition nights, crowning ceremonies, cultural walks' },
  { key: 'Workshop', label: 'Cultural Workshops', desc: 'Hands-on sessions in crafts, fashion, storytelling' },
  { key: 'Conference', label: 'Conferences', desc: 'Diplomatic & cultural forums for professionals' },
  { key: 'Fashion', label: 'Fashion Shows', desc: 'Runway showcases celebrating Kenyan designers' },
  { key: 'Community', label: 'Community Events', desc: 'Grassroots gatherings, school outreaches, artisan markets' },
]

const TESTIMONIALS = [
  {
    quote: "The pageant night was electric. I have never felt prouder to be Kenyan — the energy, the culture, the community. I am bringing everyone next year.",
    name: 'Akinyi O.',
    event: 'Heritage Gala 2024',
  },
  {
    quote: "As a sponsor, the ROI exceeded our expectations. The audience engagement was phenomenal, and the cultural authenticity resonated deeply with our brand values.",
    name: 'James M.',
    event: 'Cultural Conference 2024',
  },
  {
    quote: "My daughter attended the youth workshop and came home transformed — proud of her heritage for the first time. That is worth more than any ticket price.",
    name: 'Wanjiku N.',
    event: 'Youth Empowerment Workshop',
  },
]

const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [pastEvents, setPastEvents] = useState<any[]>([])
  const [eventCategories, setEventCategories] = useState<string[]>(['All'])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const settings = useSiteSettings()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const upcomingData = await apiClient.getUpcomingEvents()
        setUpcomingEvents(Array.isArray(upcomingData) ? upcomingData : [])

        const pastData = await apiClient.getPastEvents()
        setPastEvents(Array.isArray(pastData) ? pastData : [])

        const categoriesData = await apiClient.getEventCategories()
        const categories = Array.isArray(categoriesData)
          ? categoriesData
          : (categoriesData.results || [])
        const categoryNames = ['All', ...categories.map((cat: any) => cat.name || cat.title)]
        setEventCategories(categoryNames)
      } catch (err) {
        console.error('Error fetching events:', err)
        setError('Failed to load events.')
        setUpcomingEvents([])
        setPastEvents([])
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const defaultUpcomingEvents = [
    {
      id: 1,
      title: 'Cultural Heritage Gala — Nairobi',
      date: '2025-06-14',
      time: '7:00 PM',
      venue: 'Kenyatta International Centre',
      location: 'Nairobi, Kenya',
      description: 'An evening of traditional performances, artisan showcases, and cultural exhibitions celebrating Kenya\'s diverse heritage. The flagship event of the year.',
      image: '',
      category: 'Pageant',
      capacity: 500,
      price: 'From KES 2,500',
      organizer: 'Miss Culture Global Kenya',
      contactEmail: 'info@misscultureglobalkenya.com',
      contactPhone: '+254 721 706983',
      ticketCategories: [
        { name: 'General Admission', price: 'KSh 2,500', description: 'Access to all performances and exhibitions', available: 350, total: 400 },
        { name: 'VIP Experience', price: 'KSh 5,000', description: 'Premium seating, meet & greet, and exclusive access', available: 47, total: 100 },
      ],
      audience: 'General Public',
      votingEnabled: false,
      currentVotes: 0,
    },
    {
      id: 2,
      title: 'Traditional Dance & Craft Workshop',
      date: '2025-07-22',
      time: '2:00 PM',
      venue: 'Alliance Fran\u00e7aise',
      location: 'Nairobi, Kenya',
      description: 'Hands-on sessions in traditional Kenyan dances, beadwork, and oral storytelling. Not just watching — participating.',
      image: '',
      category: 'Workshop',
      capacity: 50,
      price: 'KSh 1,500',
      organizer: 'Miss Culture Global Kenya',
      contactEmail: 'info@misscultureglobalkenya.com',
      contactPhone: '+254 721 706983',
      ticketCategories: [
        { name: 'Adult', price: 'KSh 1,500', description: 'Full workshop participation with materials', available: 35, total: 40 },
        { name: 'Student', price: 'KSh 800', description: 'Discounted rate for students with valid ID', available: 10, total: 10 },
      ],
      audience: 'Families & Youth',
      votingEnabled: false,
      currentVotes: 0,
    },
    {
      id: 3,
      title: 'Cultural Diplomacy Forum',
      date: '2025-08-10',
      time: '9:00 AM',
      venue: 'KICC Convention Centre',
      location: 'Nairobi, Kenya',
      description: 'Where heritage meets policy. A diplomatic forum connecting cultural leaders, business executives, and international exchange programmes.',
      image: '',
      category: 'Conference',
      capacity: 200,
      price: 'From KSh 5,000',
      organizer: 'Miss Culture Global Kenya',
      contactEmail: 'info@misscultureglobalkenya.com',
      contactPhone: '+254 721 706983',
      ticketCategories: [
        { name: 'Professional', price: 'KSh 5,000', description: 'Full conference access, lunch, and networking', available: 120, total: 150 },
        { name: 'Student', price: 'KSh 2,000', description: 'Student rate with valid ID, access to all sessions', available: 30, total: 50 },
      ],
      audience: 'Professionals & Institutions',
      votingEnabled: false,
      currentVotes: 0,
    },
  ]

  const defaultPastEvents = [
    {
      id: 4,
      title: 'UNESCO Cultural Exchange Programme',
      date: '2024-01-20',
      venue: 'UNESCO Headquarters',
      location: 'Paris, France',
      description: 'Representing Kenya at the international cultural exchange programme.',
      image: '',
      category: 'International',
    },
    {
      id: 5,
      title: 'Community Outreach — Kibera',
      date: '2024-01-10',
      venue: 'Kibera Community Centre',
      location: 'Nairobi, Kenya',
      description: 'Engaging with local communities to promote cultural awareness and education.',
      image: '',
      category: 'Community',
    },
  ]

  const transformEvent = (event: any) => {
    if (event.title && event.date && event.venue && !event.start_date) return event
    return {
      id: event.id,
      title: event.title || event.name,
      date: event.start_date || event.date,
      time: event.start_time || event.time || '10:00 AM',
      venue: event.venue_name || event.venue,
      location: `${event.city || ''}, ${event.country || 'Kenya'}`.trim().replace(/^,\s*/, ''),
      description: event.description,
      image: event.featured_image_url || event.featured_image || event.image || '',
      category: event.event_type || event.category || 'Event',
      capacity: event.capacity || 0,
      price: event.price || 'Free',
      organizer: event.organizer || 'Miss Culture Global Kenya',
      contactEmail: event.contact_email || 'info@misscultureglobalkenya.com',
      contactPhone: event.contact_phone || '+254 721 706983',
      ticketCategories: event.ticket_categories || [],
      audience: event.audience || 'General Public',
      votingEnabled: event.voting_enabled || false,
      currentVotes: event.current_votes || 0,
    }
  }

  const displayUpcomingEvents = upcomingEvents.length > 0
    ? upcomingEvents.map(transformEvent)
    : defaultUpcomingEvents

  const displayPastEvents = pastEvents.length > 0
    ? pastEvents.map(transformEvent)
    : defaultPastEvents

  const filteredEvents = activeCategory === 'All'
    ? displayUpcomingEvents
    : displayUpcomingEvents.filter((e: any) => e.category === activeCategory)

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return {
      day: d.toLocaleDateString('en-US', { day: '2-digit' }),
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      full: d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    }
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ===================== 1. HERO ===================== */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            className="w-full h-full"
          >
            <div className="absolute inset-0 bg-black/60 z-10" />
            <div
              className="w-full h-full bg-cover bg-center"
              style={settings.events_hero_image_url ? { backgroundImage: `url(${settings.events_hero_image_url})` } : undefined}
            />
          </motion.div>
        </div>

        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-white/30 bg-white/10 text-white text-xs sm:text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
              Events & Appearances
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-2xl tracking-tight">
              Where Culture Comes <span className="text-red-500">Alive</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto px-4 drop-shadow-lg font-light leading-relaxed">
              From pageant nights to cultural workshops, from diplomatic conferences to fashion showcases — 
              every event is an invitation to experience Kenya&apos;s heritage, not just read about it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===================== 2. EVENT CATEGORIES ===================== */}
      <div className="py-14 sm:py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-green-700 font-semibold tracking-wider uppercase text-sm mb-3">
              <Calendar className="w-4 h-4" /> What Kind of Event Are You Looking For?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Event Categories</h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {eventCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 text-sm ${
                  activeCategory === category
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {EVENT_CATEGORIES.filter(c => c.key !== 'All').map((cat, idx) => (
              <motion.button
                key={cat.key}
                {...stagger}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => setActiveCategory(cat.key === 'All' ? 'All' : cat.key)}
                className={`p-4 rounded-xl text-center transition-all duration-300 border ${
                  activeCategory === cat.key
                    ? 'bg-green-900 text-white border-green-900 shadow-lg'
                    : 'bg-white text-gray-700 border-gray-100 hover:border-green-200 hover:shadow-md'
                }`}
              >
                <div className={`font-bold text-sm mb-1 ${activeCategory === cat.key ? 'text-yellow-400' : 'text-gray-900'}`}>
                  {cat.label}
                </div>
                <div className={`text-xs leading-snug ${activeCategory === cat.key ? 'text-green-100' : 'text-gray-500'}`}>
                  {cat.desc}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ===================== 3. UPCOMING EVENTS ===================== */}
      <div className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-green-600" />
              Upcoming <span className="text-green-600">Events</span>
            </h2>
            <p className="text-gray-600 mt-2">Secure your spot — these events fill up fast.</p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No upcoming events in this category. Check back soon or browse all events.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEvents.map((event: any, index: number) => {
                const dateInfo = formatDate(event.date)
                const seatsLeft = event.ticketCategories
                  ? event.ticketCategories.reduce((sum: number, t: any) => sum + (t.available || 0), 0)
                  : event.capacity
                const isLowSeats = seatsLeft < 50

                return (
                  <motion.div
                    key={event.id}
                    {...stagger}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100 flex flex-col sm:flex-row"
                    onClick={() => handleEventClick(event)}
                  >
                    {/* Date badge */}
                    <div className="sm:w-28 flex-shrink-0 bg-green-900 text-white flex flex-col items-center justify-center p-4 sm:p-6">
                      <span className="text-3xl sm:text-4xl font-bold">{dateInfo.day}</span>
                      <span className="text-sm font-semibold text-green-300 uppercase">{dateInfo.month}</span>
                    </div>

                    <div className="flex-1 p-6 flex flex-col">
                      {/* Category + Audience tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide">
                          {event.category}
                        </span>
                        {event.audience && (
                          <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-medium">
                            {event.audience}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
                        {event.description}
                      </p>

                      {/* Details row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.venue}</span>
                        <span className="flex items-center gap-1"><Ticket className="w-3 h-3" />{event.price}</span>
                      </div>

                      {/* Seats + CTA */}
                      <div className="flex items-center justify-between">
                        {isLowSeats && (
                          <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Only {seatsLeft} seats left
                          </span>
                        )}
                        {!isLowSeats && <span />}
                        <span className="inline-flex items-center gap-1 text-green-600 font-semibold text-sm group-hover:gap-2 transition-all">
                          Get Tickets <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ===================== 4. URGENCY & SOCIAL PROOF ===================== */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Scarcity */}
          <motion.div {...fadeInUp} className="bg-red-50 border border-red-100 rounded-2xl p-8 sm:p-10 text-center mb-10">
            <Sparkles className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Seats Are Filling Fast</h3>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Only limited tickets remaining for the Heritage Gala. Secure yours before they are gone — 
              this event sells out every year.
            </p>
          </motion.div>

          {/* Social Proof / Testimonials */}
          <motion.div {...fadeInUp} className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-green-700 font-semibold tracking-wider uppercase text-sm mb-3">
              <Quote className="w-4 h-4" /> What Past Attendees Say
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Is It Worth Attending?</h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {TESTIMONIALS.map((t, idx) => (
              <motion.div
                key={t.name}
                {...stagger}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100"
              >
                <Quote className="w-6 h-6 text-green-300 mb-4" />
                <p className="text-gray-700 leading-relaxed mb-4 text-sm italic">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.event}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Past Events */}
          {displayPastEvents.length > 0 && (
            <>
              <motion.div {...fadeInUp} className="text-center mb-10">
                <span className="inline-flex items-center gap-2 text-gray-500 font-semibold tracking-wider uppercase text-sm mb-3">
                  <Camera className="w-4 h-4" /> Missed It? See What Happened
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Past Events</h3>
                <p className="text-gray-600 mt-2">Every past event lives in the gallery — photos, videos, and highlights from the stage to the sidelines.</p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                {displayPastEvents.map((event: any, index: number) => (
                  <motion.div
                    key={event.id}
                    {...stagger}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="bg-white rounded-2xl shadow-md overflow-hidden group border border-gray-100 flex flex-col sm:flex-row hover:shadow-lg transition-shadow"
                  >
                    <div className="sm:w-2/5 h-40 sm:h-auto overflow-hidden relative">
                      {event.image ? (
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="bg-black/60 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-xs font-bold uppercase">
                          {event.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 sm:w-3/5 flex flex-col justify-center">
                      <h4 className="font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">{event.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(event.date).toLocaleDateString('en-US')}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.venue}</span>
                      </div>
                      <Link href="/gallery" className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 font-semibold text-sm group/btn">
                        View Photos <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* No-ticket CTA */}
          <motion.div {...fadeInUp} className="mt-12 bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
            <h4 className="text-xl font-bold text-gray-900 mb-2">Can&apos;t make it in person?</h4>
            <p className="text-gray-600 mb-4">
              Follow us on Instagram and YouTube for live coverage — and sign up to be first to know about the next event.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://instagram.com/misscultureglobalkenya"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-colors"
              >
                Follow on Instagram
              </a>
              <a
                href="https://youtube.com/misscultureglobalkenya"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-colors"
              >
                Subscribe on YouTube
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===================== 5. BRIDGE CTAs ===================== */}
      <div className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full border border-red-200 bg-red-50 text-red-600 text-xs sm:text-sm font-bold tracking-widest uppercase mb-6">
              Where Do I Go Next
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Take the Next Step</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/partnership">
              <motion.div
                {...stagger}
                transition={{ duration: 0.5, delay: 0 }}
                className="group bg-green-900 rounded-2xl p-8 sm:p-10 text-white relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer h-full"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 border border-white/20 group-hover:bg-white/20 transition-colors">
                    <Handshake className="w-7 h-7 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3">Partner or Sponsor</h3>
                  <p className="text-green-100 leading-relaxed mb-6">
                    Put your brand in front of a live cultural audience. Event sponsorship packages available for every budget.
                  </p>
                  <span className="inline-flex items-center gap-2 text-yellow-400 font-semibold group-hover:gap-3 transition-all">
                    View partnership tiers <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </motion.div>
            </Link>

            <Link href="/gallery">
              <motion.div
                {...stagger}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="group bg-red-600 rounded-2xl p-8 sm:p-10 text-white relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer h-full"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 border border-white/20 group-hover:bg-white/20 transition-colors">
                    <Camera className="w-7 h-7 text-yellow-300" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3">See the Gallery</h3>
                  <p className="text-red-100 leading-relaxed mb-6">
                    Every past event lives in the gallery — photos, videos, and highlights from the stage to the sidelines.
                  </p>
                  <span className="inline-flex items-center gap-2 text-yellow-300 font-semibold group-hover:gap-3 transition-all">
                    Browse gallery <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EventDetailsModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        event={selectedEvent}
      />
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        type="event"
      />
    </div>
  )
}

export default EventsPage
