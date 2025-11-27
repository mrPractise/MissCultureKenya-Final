'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, Users, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import EventDetailsModal from '@/components/EventDetailsModal'
import ContactModal from '@/components/ContactModal'

const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  const upcomingEvents = [
    {
      id: 1,
      title: 'Cultural Heritage Festival 2024',
      date: '2024-03-15',
      time: '10:00 AM',
      venue: 'Nairobi National Museum',
      location: 'Nairobi, Kenya',
      description: 'A celebration of Kenya\'s diverse cultural heritage featuring traditional performances, artisan showcases, and cultural exhibitions.',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop',
      category: 'Cultural Event',
      capacity: 500,
      price: 'Free',
      organizer: 'Miss Culture Global Kenya',
      contactEmail: 'events@misscultureglobalkenya.com',
      contactPhone: '+254 700 000 000',
      ticketCategories: [
        {
          name: 'General Admission',
          price: 'Free',
          description: 'Access to all festival activities and performances',
          available: 450,
          total: 500
        },
        {
          name: 'VIP Experience',
          price: 'KSh 2,000',
          description: 'Premium seating, meet & greet, and exclusive access',
          available: 30,
          total: 50
        }
      ],
      votingEnabled: true,
      currentVotes: 127
    },
    {
      id: 2,
      title: 'International Women\'s Day Conference',
      date: '2024-03-08',
      time: '9:00 AM',
      venue: 'KICC Convention Centre',
      location: 'Nairobi, Kenya',
      description: 'Empowering women through cultural exchange and leadership development in the global community.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      category: 'Conference',
      capacity: 200,
      price: 'KSh 2,000',
      organizer: 'Women in Leadership Kenya',
      contactEmail: 'conference@wilkenya.org',
      contactPhone: '+254 700 000 001',
      ticketCategories: [
        {
          name: 'Early Bird',
          price: 'KSh 1,500',
          description: 'Limited time offer - includes lunch and materials',
          available: 50,
          total: 50
        },
        {
          name: 'Regular',
          price: 'KSh 2,000',
          description: 'Standard conference access with lunch',
          available: 120,
          total: 150
        },
        {
          name: 'Student',
          price: 'KSh 1,000',
          description: 'Discounted rate for students with valid ID',
          available: 30,
          total: 30
        }
      ],
      votingEnabled: true,
      currentVotes: 89
    },
    {
      id: 3,
      title: 'Traditional Dance Workshop',
      date: '2024-03-22',
      time: '2:00 PM',
      venue: 'Alliance Française',
      location: 'Nairobi, Kenya',
      description: 'Learn traditional Kenyan dances from master instructors and experience the rhythm of our culture.',
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&h=400&fit=crop',
      category: 'Workshop',
      capacity: 50,
      price: 'KSh 1,500',
      organizer: 'Alliance Française Nairobi',
      contactEmail: 'cultural@alliancefr.co.ke',
      contactPhone: '+254 700 000 002',
      ticketCategories: [
        {
          name: 'Adult',
          price: 'KSh 1,500',
          description: 'Full workshop participation with materials',
          available: 35,
          total: 40
        },
        {
          name: 'Child (Under 16)',
          price: 'KSh 800',
          description: 'Special rate for children under 16',
          available: 10,
          total: 10
        }
      ],
      votingEnabled: false,
      currentVotes: 0
    }
  ]

  const pastEvents = [
    {
      id: 4,
      title: 'UNESCO Cultural Exchange Program',
      date: '2024-01-20',
      venue: 'UNESCO Headquarters',
      location: 'Paris, France',
      description: 'Representing Kenya at the international cultural exchange program.',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop',
      category: 'International'
    },
    {
      id: 5,
      title: 'Community Outreach Program',
      date: '2024-01-10',
      venue: 'Kibera Community Centre',
      location: 'Nairobi, Kenya',
      description: 'Engaging with local communities to promote cultural awareness and education.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      category: 'Community'
    }
  ]

  const eventCategories = ['All', 'Cultural Event', 'Conference', 'Workshop', 'International', 'Community']

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
  }

  const handleContactClick = () => {
    setIsContactModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            className="w-full h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10" />
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1920&h=600&fit=crop)' }}
            />
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl tracking-tight">
              Events & <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">Appearances</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto mb-8 rounded-full" />
            <p className="text-lg sm:text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto px-4 drop-shadow-lg font-light leading-relaxed">
              Join Susan at cultural events, conferences, and community engagements as she represents Kenya on the global stage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events Content */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 decorative-pattern opacity-[0.03]" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-16"
          >
            {eventCategories.map((category) => (
              <button
                key={category}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base transform hover:-translate-y-1 ${category === 'All'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 shadow-md hover:shadow-lg border border-gray-100'
                  }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
              Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Events</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group cursor-pointer transform hover:-translate-y-2 border border-gray-100 flex flex-col h-full"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-md text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                        {event.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                        {event.price}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors duration-300">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed flex-grow">
                      {event.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="w-4 h-4 mr-3 text-green-500" />
                        <span className="font-medium">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Clock className="w-4 h-4 mr-3 text-green-500" />
                        <span className="font-medium">{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 mr-3 text-green-500" />
                        <span className="font-medium">{event.venue}, {event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Users className="w-4 h-4 mr-3 text-green-500" />
                        <span className="font-medium">Capacity: {event.capacity}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEventClick(event)
                      }}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                    >
                      Get Tickets
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Past Events */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
              Past <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-900">Events</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {pastEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1 border border-gray-100 flex flex-col md:flex-row"
                >
                  <div className="relative md:w-2/5 h-48 md:h-auto overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 md:w-3/5 flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{event.venue}, {event.location}</span>
                      </div>
                    </div>

                    <Link href="/gallery" className="flex items-center text-green-600 hover:text-green-700 font-bold text-sm uppercase tracking-wide transition-colors duration-200 group/btn">
                      <span>View Photos</span>
                      <ExternalLink className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

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
