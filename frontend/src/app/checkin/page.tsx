'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Lock, Search, RefreshCw, LogOut, Loader2, AlertCircle, CheckCircle, ArrowUp, ArrowDown, Ticket as TicketIcon, Calendar, MapPin, ChevronRight, ArrowLeft } from 'lucide-react'
import apiClient from '@/lib/api'
import type { ApiError } from '@/lib/api'

interface CheckinEvent {
  id: number
  title: string
  start_date: string
  venue_name: string
  city: string
}

interface CheckinTicket {
  id: number
  ticket_code: string
  full_name: string
  phone: string
  email: string
  event_title: string
  ticket_category_name: string
  is_used: boolean
  issued_at: string
}

type SortKey = 'full_name' | 'ticket_code' | 'phone' | 'ticket_category_name' | 'is_used'

const SESSION_KEY = 'mcgk_checkin_session'

export default function CheckinPage() {
  // Flow: 'events' -> pick event -> 'pin' -> unlock -> 'tickets'
  const [step, setStep] = useState<'events' | 'pin' | 'tickets'>('events')
  const [events, setEvents] = useState<CheckinEvent[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<CheckinEvent | null>(null)

  const [pin, setPin] = useState('')
  const [tickets, setTickets] = useState<CheckinTicket[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('full_name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [savingId, setSavingId] = useState<number | null>(null)

  const loadEvents = useCallback(async () => {
    setEventsLoading(true)
    try {
      const data = await apiClient.checkinEvents()
      setEvents(Array.isArray(data?.events) ? data.events : [])
    } catch {
      setEvents([])
    } finally {
      setEventsLoading(false)
    }
  }, [])

  const loadTickets = useCallback(async (event: CheckinEvent, usePin: string) => {
    setLoading(true)
    setError('')
    try {
      const data = await apiClient.checkinList({ event: event.id, pin: usePin })
      setTickets(Array.isArray(data?.tickets) ? data.tickets : [])
      setStep('tickets')
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ event, pin: usePin }))
    } catch (err) {
      const apiErr = err as ApiError
      setStep('pin')
      setError(apiErr.message || 'Could not load tickets. Check your PIN.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Restore a saved session, otherwise load the events list
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed?.event && parsed?.pin) {
          setSelectedEvent(parsed.event)
          setPin(parsed.pin)
          loadTickets(parsed.event, parsed.pin)
          return
        }
      } catch { /* ignore */ }
    }
    loadEvents()
  }, [loadEvents, loadTickets])

  const handleSelectEvent = (event: CheckinEvent) => {
    setSelectedEvent(event)
    setPin('')
    setError('')
    setStep('pin')
  }

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEvent) return
    if (!pin.trim()) {
      setError('Enter the check-in PIN')
      return
    }
    loadTickets(selectedEvent, pin.trim())
  }

  const handleBackToEvents = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setStep('events')
    setSelectedEvent(null)
    setTickets([])
    setPin('')
    setSearch('')
    setError('')
    loadEvents()
  }

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const handleToggleUsed = async (ticket: CheckinTicket) => {
    if (!selectedEvent) return
    const newValue = !ticket.is_used
    // Optimistic update
    setTickets((prev) => prev.map((t) => (t.id === ticket.id ? { ...t, is_used: newValue } : t)))
    setSavingId(ticket.id)
    try {
      await apiClient.checkinToggle({ event: selectedEvent.id, pin, ticket_id: ticket.id, is_used: newValue })
    } catch (err) {
      // Revert on failure
      setTickets((prev) => prev.map((t) => (t.id === ticket.id ? { ...t, is_used: ticket.is_used } : t)))
      const apiErr = err as ApiError
      setError(apiErr.message || 'Failed to update check-in status.')
    } finally {
      setSavingId(null)
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = tickets
    if (q) {
      list = tickets.filter((t) =>
        [t.full_name, t.ticket_code, t.phone, t.email, t.ticket_category_name]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      )
    }
    const sorted = [...list].sort((a, b) => {
      let av: string | number
      let bv: string | number
      if (sortKey === 'is_used') {
        av = a.is_used ? 1 : 0
        bv = b.is_used ? 1 : 0
      } else {
        av = String(a[sortKey] || '').toLowerCase()
        bv = String(b[sortKey] || '').toLowerCase()
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [tickets, search, sortKey, sortDir])

  const checkedInCount = useMemo(() => tickets.filter((t) => t.is_used).length, [tickets])

  const formatDate = (iso: string) => {
    if (!iso) return ''
    try {
      return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch {
      return ''
    }
  }

  const SortHeader = ({ label, k }: { label: string; k: SortKey }) => (
    <th className="px-3 py-2.5 text-left font-semibold text-gray-600 whitespace-nowrap">
      <button type="button" onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 hover:text-gray-900">
        {label}
        {sortKey === k && (sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
      </button>
    </th>
  )

  // ── Step 1: pick an event ─────────────────────────────────────────────────
  if (step === 'events') {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TicketIcon className="w-7 h-7 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Gate Check-In</h1>
            <p className="text-sm text-gray-500 mt-1">Select an event to check guests in</p>
          </div>

          {eventsLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500">
              <p className="font-medium text-gray-700">No events available for check-in.</p>
              <p className="text-sm mt-1">Set a Check-in PIN on an event in the admin to enable it here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => handleSelectEvent(ev)}
                  className="w-full text-left bg-white border border-gray-200 rounded-2xl p-4 hover:border-green-300 hover:bg-green-50/50 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{ev.title}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                      {ev.start_date && (
                        <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(ev.start_date)}</span>
                      )}
                      {(ev.venue_name || ev.city) && (
                        <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {[ev.venue_name, ev.city].filter(Boolean).join(', ')}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Step 2: enter the event's PIN ─────────────────────────────────────────
  if (step === 'pin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <form onSubmit={handleUnlock} className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <button type="button" onClick={handleBackToEvents} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4">
            <ArrowLeft className="w-4 h-4" /> All events
          </button>
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-green-600" />
          </div>
          <h1 className="text-lg font-bold text-gray-900 text-center">{selectedEvent?.title}</h1>
          <p className="text-sm text-gray-500 text-center mt-1 mb-6">Enter the check-in PIN for this event</p>

          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError('') }}
            placeholder="PIN"
            autoFocus
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-lg tracking-widest focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />

          {error && (
            <div className="flex items-start gap-2 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            Unlock
          </button>
        </form>
      </div>
    )
  }

  // ── Step 3: check-in table ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <button onClick={handleBackToEvents} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-1">
              <ArrowLeft className="w-4 h-4" /> All events
            </button>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TicketIcon className="w-5 h-5 text-green-600" /> {selectedEvent?.title}
            </h1>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-green-700">{checkedInCount}</span> of{' '}
              <span className="font-semibold text-gray-900">{tickets.length}</span> checked in
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => selectedEvent && loadTickets(selectedEvent, pin)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Refresh
            </button>
            <button
              onClick={handleBackToEvents}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4" /> Lock
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, ticket code or phone..."
            className="w-full pl-9 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2.5 text-left font-semibold text-gray-600 w-12">✓</th>
                  <SortHeader label="Name" k="full_name" />
                  <SortHeader label="Ticket Code" k="ticket_code" />
                  <SortHeader label="Phone" k="phone" />
                  <SortHeader label="Category" k="ticket_category_name" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => savingId === null && handleToggleUsed(t)}
                    className={`cursor-pointer transition-colors ${
                      t.is_used ? 'bg-gray-50 text-gray-400 line-through' : 'hover:bg-green-50/50 text-gray-800'
                    }`}
                  >
                    <td className="px-3 py-3 no-underline">
                      <input
                        type="checkbox"
                        checked={t.is_used}
                        onChange={() => handleToggleUsed(t)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-3 font-medium">{t.full_name || '—'}</td>
                    <td className="px-3 py-3 font-mono">{t.ticket_code}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{t.phone || '—'}</td>
                    <td className="px-3 py-3">{t.ticket_category_name}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-10 text-center text-gray-400">
                      {tickets.length === 0 ? 'No tickets issued yet.' : 'No tickets match your search.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Tap a row (or the checkbox) to check a guest in. Checked-in guests are crossed out, never deleted.
        </p>
      </div>
    </div>
  )
}
