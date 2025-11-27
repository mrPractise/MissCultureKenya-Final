'use client'

import { useState, useEffect } from 'react'
import Hero from '@/components/Hero'
import Highlights from '@/components/Highlights'
import BlogFeed from '@/components/BlogFeed'
import FollowCTA from '@/components/FollowCTA'
import EventDetailsModal from '@/components/EventDetailsModal'
import apiClient from '@/lib/api'

export default function Home() {
  const [showEventModal, setShowEventModal] = useState(false)
  const [upcomingEvent, setUpcomingEvent] = useState<any>(null)

  // Fetch upcoming event from API
  useEffect(() => {
    const fetchUpcomingEvent = async () => {
      try {
        const events = await apiClient.getUpcomingEvents()
        const eventsArray = Array.isArray(events) ? events : []
        if (eventsArray.length > 0) {
          const event = eventsArray[0]
          // Transform API event to component format
          setUpcomingEvent({
            id: event.id,
            title: event.title || event.name,
            date: event.start_date || event.date,
            time: event.start_time || event.time || '10:00 AM',
            venue: event.venue_name || event.venue,
            location: `${event.city || ''}, ${event.country || 'Kenya'}`.trim().replace(/^,\s*/, ''),
            description: event.description,
            image: event.featured_image || event.image,
            category: event.event_type || event.category || 'Event',
            capacity: event.capacity || 0,
            price: event.price || 'Free',
            organizer: event.organizer || 'Miss Culture Global Kenya',
            contactEmail: event.contact_email || 'events@misscultureglobalkenya.com',
            contactPhone: event.contact_phone || '+254 700 000 000',
            ticketCategories: event.ticket_categories || [],
            votingEnabled: event.voting_enabled || false,
            currentVotes: event.current_votes || 0
          })
        } else {
          // Fallback event if no events from API
          setUpcomingEvent({
    id: 1,
    title: 'Cultural Heritage Festival 2024',
    date: '2024-03-15',
    time: '10:00 AM',
    venue: 'Nairobi National Museum',
    location: 'Nairobi, Kenya',
    description: 'Join us for a celebration of Kenya\'s diverse cultural heritage featuring traditional performances, artisan showcases, and cultural exhibitions. This is a must-attend event for everyone passionate about Kenyan culture!',
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
          })
        }
      } catch (err) {
        console.error('Error fetching upcoming event:', err)
        // Use fallback event
        setUpcomingEvent({
          id: 1,
          title: 'Cultural Heritage Festival 2024',
          date: '2024-03-15',
          time: '10:00 AM',
          venue: 'Nairobi National Museum',
          location: 'Nairobi, Kenya',
          description: 'Join us for a celebration of Kenya\'s diverse cultural heritage featuring traditional performances, artisan showcases, and cultural exhibitions. This is a must-attend event for everyone passionate about Kenyan culture!',
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
        })
      }
    }

    fetchUpcomingEvent()
  }, [])

  // Show event modal after 2 seconds on initial page load (only if event exists)
  useEffect(() => {
    if (upcomingEvent) {
      const timer = setTimeout(() => {
        setShowEventModal(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [upcomingEvent])

  return (
    <div className="min-h-screen">
      <Hero />
      <Highlights />
      <BlogFeed />
      <FollowCTA />
      
      {/* Upcoming Event Modal */}
      {upcomingEvent && (
        <EventDetailsModal
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
          event={upcomingEvent}
        />
      )}
    </div>
  )
}