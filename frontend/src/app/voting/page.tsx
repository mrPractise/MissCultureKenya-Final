'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Trophy, Search, Vote, Phone, ChevronRight, ChevronDown, AlertCircle, Loader2, Check, X, Share2 } from 'lucide-react'
import Link from 'next/link'
import apiClient from '@/lib/api'
import type { ApiError } from '@/lib/api'
import VotePaymentModal from '@/components/VotePaymentModal'

interface Contestant {
  id: number
  name: string
  bio: string
  photo_url: string | null
  contestant_number: number
  slug: string
  vote_count: number | null
  event_title: string
  event_slug: string
}

interface VotingEvent {
  id: number
  title: string
  slug: string
  start_date: string
  venue_name: string
  featured_image_url: string | null
  voting_enabled: boolean
  vote_price: number
  is_voting_active: boolean
  result_visibility: string
  contestant_count: number
  paybill_number: string
  account_number: string
  account_name: string
  payment_method: string
  till_number: string
}

interface VoteRecord {
  event_title: string
  contestant_name: string
  vote_count: number
  amount: string
  mpesa_code: string
  status: string
  created_at: string
}

const VotingPage = () => {
  const [events, setEvents] = useState<VotingEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<VotingEvent | null>(null)
  const [contestants, setContestants] = useState<Contestant[]>([])
  const [loading, setLoading] = useState(true)
  const [contestantsLoading, setContestantsLoading] = useState(false)
  const [error, setError] = useState('')

  // Vote modal state
  const [voteModalOpen, setVoteModalOpen] = useState(false)
  const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null)

  // Verify votes state
  const [verifyPhone, setVerifyPhone] = useState('')
  const [voteRecords, setVoteRecords] = useState<VoteRecord[]>([])
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyError, setVerifyError] = useState('')
  const [showVerify, setShowVerify] = useState(false)

  // Fetch voting events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiClient.getVotingEvents()
        const results = Array.isArray(data) ? data : (data?.results || [])
        setEvents(results)
        if (results.length > 0) {
          setSelectedEvent(results[0])
        }
      } catch (err) {
        const apiErr = err as ApiError
        setError(apiErr.message || 'Failed to load voting events')
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  // Fetch contestants when event changes
  useEffect(() => {
    if (!selectedEvent) return
    const fetchContestants = async () => {
      setContestantsLoading(true)
      try {
        const data = await apiClient.getEventContestants(selectedEvent.id)
        const results = Array.isArray(data) ? data : (data?.results || [])
        setContestants(results)
      } catch (err) {
        const apiErr = err as ApiError
        setError(apiErr.message || 'Failed to load contestants')
      } finally {
        setContestantsLoading(false)
      }
    }
    fetchContestants()
  }, [selectedEvent])

  const handleVoteClick = useCallback((contestant: Contestant) => {
    if (!selectedEvent) return
    setSelectedContestant(contestant)
    setVoteModalOpen(true)
  }, [selectedEvent])

  const handleVerifyVotes = async () => {
    if (!verifyPhone || verifyPhone.length < 9) {
      setVerifyError('Please enter a valid phone number')
      return
    }
    setVerifyLoading(true)
    setVerifyError('')
    try {
      const data = await apiClient.verifyVotesByPhone(verifyPhone)
      setVoteRecords(data?.votes || [])
    } catch (err) {
      const apiErr = err as ApiError
      setVerifyError(apiErr.message || 'Failed to verify votes')
    } finally {
      setVerifyLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-KE', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading voting events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-900">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-sm uppercase tracking-[0.3em] text-green-300 mb-3 font-semibold">Your Voice Shapes the Stage</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              Vote <span className="text-red-500">Now</span>
            </h1>
            <div className="w-20 h-1 bg-red-500 mx-auto mb-6 rounded-full" />
            <p className="text-lg text-gray-200 max-w-2xl mx-auto font-light">
              Cast your vote for contestants competing to represent Kenya&apos;s cultural future.
              Every vote is backed by a verified payment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* No Events Message */}
      {events.length === 0 && !loading && (
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Voting Coming Soon</h2>
            <p className="text-lg text-gray-600 mb-8">
              Voting events and participants will be available here once they are set up by the admin team.
              Stay tuned — your voice will shape who represents Kenya&apos;s cultural future.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors"
            >
              <Calendar className="w-4 h-4" />
              View Upcoming Events
            </Link>
          </div>
        </section>
      )}

      {/* Events with Voting */}
      {events.length > 0 && (
        <>
          {/* Event Selector */}
          <section className="py-8 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {events.map((evt) => (
                  <button
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                      selectedEvent?.id === evt.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {evt.title}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Selected Event Info */}
          {selectedEvent && (
            <section className="py-8 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <div className="bg-gradient-to-r from-green-50 to-white rounded-2xl border border-green-100 p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedEvent.title}</h2>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(selectedEvent.start_date)}
                        </span>
                        <span>{selectedEvent.venue_name}</span>
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                          {selectedEvent.contestant_count} Contestants
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-700">KES {selectedEvent.vote_price}</p>
                        <p className="text-xs text-gray-500">per vote</p>
                      </div>
                      {selectedEvent.is_voting_active ? (
                        <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          Voting Open
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full text-sm font-semibold">
                          Voting Closed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Contestants Grid */}
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4">
              {contestantsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
                </div>
              ) : contestants.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500">No contestants found for this event.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {contestants.map((contestant, index) => (
                    <motion.div
                      key={contestant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden group"
                    >
                      {/* Photo */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                        {contestant.photo_url ? (
                          <img
                            src={contestant.photo_url}
                            alt={contestant.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
                            <span className="text-4xl font-bold text-green-300">#{contestant.contestant_number}</span>
                          </div>
                        )}
                        {/* Number Badge */}
                        <div className="absolute top-3 left-3 bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                          {contestant.contestant_number}
                        </div>
                        {/* Vote count if visible */}
                        {contestant.vote_count !== null && contestant.vote_count !== undefined && (
                          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {contestant.vote_count.toLocaleString()} votes
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-1">{contestant.name}</h3>
                        {contestant.bio && (
                          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{contestant.bio}</p>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVoteClick(contestant)}
                            disabled={!selectedEvent?.is_voting_active}
                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Vote className="w-3.5 h-3.5" />
                            Vote
                          </button>
                          <Link
                            href={`/voting/${selectedEvent?.slug}/${contestant.slug}`}
                            className="px-3 py-2.5 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Vote Verification */}
          <section className="py-16 bg-white">
            <div className="max-w-2xl mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Votes</h2>
                <p className="text-gray-600">Enter your phone number to check your vote history</p>
              </div>

              <button
                onClick={() => setShowVerify(!showVerify)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <span className="flex items-center gap-2 text-gray-700 font-medium">
                  <Phone className="w-4 h-4" />
                  Check Vote Status
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showVerify ? 'rotate-180' : ''}`} />
              </button>

              {showVerify && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 space-y-4"
                >
                  <div className="flex gap-2">
                    <div className="flex flex-1">
                      <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl text-sm text-gray-600 font-medium">
                        +254
                      </span>
                      <input
                        type="tel"
                        value={verifyPhone}
                        onChange={(e) => { setVerifyPhone(e.target.value.replace(/\D/g, '')); setVerifyError('') }}
                        placeholder="712345678"
                        maxLength={9}
                        className="flex-1 px-3 py-3 border border-gray-300 rounded-r-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <button
                      onClick={handleVerifyVotes}
                      disabled={verifyLoading}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-1.5"
                    >
                      {verifyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      Search
                    </button>
                  </div>

                  {verifyError && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-700">{verifyError}</p>
                    </div>
                  )}

                  {voteRecords.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-700">{voteRecords.length} vote transaction(s) found</p>
                      {voteRecords.map((record, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">{record.contestant_name}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              record.status === 'successful' ? 'bg-green-100 text-green-700' :
                              record.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              record.status === 'reversed' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {record.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                            <span>Event: {record.event_title}</span>
                            <span>Votes: {record.vote_count}</span>
                            <span>Amount: KES {parseFloat(record.amount).toLocaleString()}</span>
                            <span>Code: {record.mpesa_code}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {voteRecords.length === 0 && verifyPhone && !verifyLoading && !verifyError && (
                    <p className="text-sm text-gray-500 text-center py-4">No vote records found for this phone number.</p>
                  )}
                </motion.div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Error State */}
      {error && (
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-800">Error loading voting data</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Vote Payment Modal */}
      {selectedEvent && selectedContestant && (
        <VotePaymentModal
          isOpen={voteModalOpen}
          onClose={() => setVoteModalOpen(false)}
          event={{
            id: selectedEvent.id,
            title: selectedEvent.title,
            vote_price: selectedEvent.vote_price,
          }}
          contestant={{
            id: selectedContestant.id,
            name: selectedContestant.name,
            contestant_number: selectedContestant.contestant_number,
            photo_url: selectedContestant.photo_url,
          }}
        />
      )}
    </div>
  )
}

export default VotingPage
