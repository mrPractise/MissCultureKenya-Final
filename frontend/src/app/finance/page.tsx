'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Lock, Loader2, AlertCircle, Search, Download, RefreshCw, LogOut,
  ArrowUp, ArrowDown, Wallet, Vote, Ticket as TicketIcon, HeartHandshake, TrendingUp,
} from 'lucide-react'
import apiClient from '@/lib/api'
import type { ApiError } from '@/lib/api'

interface FinanceTxn {
  id: string
  source: 'vote' | 'ticket' | 'contribution'
  date: string
  name: string
  phone: string
  mpesa_code: string
  amount: number
  status: string
  event_title: string
  reference: string
}

interface EventOption {
  id: number
  title: string
}

interface Totals {
  vote: number
  ticket: number
  contribution: number
  grand: number
}

type SortKey = 'date' | 'source' | 'name' | 'phone' | 'mpesa_code' | 'amount' | 'status'

interface Filters {
  date_from: string
  date_to: string
  source: 'all' | 'vote' | 'ticket' | 'contribution'
  event: string
  phone: string
  mpesa_code: string
  status: 'all' | 'successful' | 'pending' | 'failed' | 'cancelled' | 'reversed'
}

const SESSION_KEY = 'mcgk_finance_session'

const EMPTY_FILTERS: Filters = {
  date_from: '',
  date_to: '',
  source: 'all',
  event: '',
  phone: '',
  mpesa_code: '',
  status: 'successful',
}

const SOURCE_META: Record<string, { label: string; badge: string }> = {
  vote: { label: 'Voting', badge: 'bg-green-100 text-green-700' },
  ticket: { label: 'Ticketing', badge: 'bg-blue-100 text-blue-700' },
  contribution: { label: 'Contribution', badge: 'bg-purple-100 text-purple-700' },
}

const STATUS_BADGE: Record<string, string> = {
  successful: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-600',
  cancelled: 'bg-gray-100 text-gray-500',
  reversed: 'bg-orange-100 text-orange-700',
}

const fmtMoney = (n: number) =>
  `KES ${Number(n || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString('en-KE', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return iso
  }
}

const FinancePage = () => {
  const [step, setStep] = useState<'pin' | 'dash'>('pin')
  const [pin, setPin] = useState('')

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [totals, setTotals] = useState<Totals>({ vote: 0, ticket: 0, contribution: 0, grand: 0 })
  const [events, setEvents] = useState<EventOption[]>([])
  const [transactions, setTransactions] = useState<FinanceTxn[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)

  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const runReport = useCallback(async (usePin: string, useFilters: Filters) => {
    setLoading(true)
    setError('')
    try {
      const payload = {
        pin: usePin,
        date_from: useFilters.date_from || undefined,
        date_to: useFilters.date_to || undefined,
        source: useFilters.source,
        event: useFilters.event || undefined,
        phone: useFilters.phone || undefined,
        mpesa_code: useFilters.mpesa_code || undefined,
        status: useFilters.status,
      }
      const data = await apiClient.financeReport(payload)
      setTotals(data?.totals || { vote: 0, ticket: 0, contribution: 0, grand: 0 })
      setEvents(Array.isArray(data?.events) ? data.events : [])
      setTransactions(Array.isArray(data?.transactions) ? data.transactions : [])
      setStep('dash')
      sessionStorage.setItem(SESSION_KEY, usePin)
    } catch (err) {
      const apiErr = err as ApiError
      setError(apiErr.message || 'Failed to load finance report')
      if (apiErr.status === 401 || apiErr.status === 503) {
        setStep('pin')
        sessionStorage.removeItem(SESSION_KEY)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Restore a saved session on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY)
    if (saved) {
      setPin(saved)
      runReport(saved, EMPTY_FILTERS)
    }
  }, [runReport])

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pin.trim()) {
      setError('Enter the finance PIN.')
      return
    }
    runReport(pin.trim(), filters)
  }

  const handleApply = () => runReport(pin, filters)

  const handleLock = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setPin('')
    setTransactions([])
    setTotals({ vote: 0, ticket: 0, contribution: 0, grand: 0 })
    setFilters(EMPTY_FILTERS)
    setSearch('')
    setStep('pin')
  }

  const handleDownload = async () => {
    setDownloading(true)
    setError('')
    try {
      await apiClient.downloadFinanceStatement({
        pin,
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,
        source: filters.source,
        event: filters.event || undefined,
        phone: filters.phone || undefined,
        mpesa_code: filters.mpesa_code || undefined,
        status: filters.status,
      })
    } catch (err) {
      setError((err as ApiError).message || 'Failed to download statement')
    } finally {
      setDownloading(false)
    }
  }

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'amount' || key === 'date' ? 'desc' : 'asc')
    }
  }

  const filtered = useMemo(() => {
    let rows = transactions
    const q = search.trim().toLowerCase()
    if (q) {
      rows = rows.filter((r) =>
        [r.name, r.phone, r.mpesa_code, r.event_title, r.reference]
          .some((v) => (v || '').toLowerCase().includes(q))
      )
    }
    const sorted = [...rows].sort((a, b) => {
      let av: string | number = a[sortKey]
      let bv: string | number = b[sortKey]
      if (sortKey === 'amount') {
        av = a.amount; bv = b.amount
      } else if (sortKey === 'date') {
        av = new Date(a.date).getTime(); bv = new Date(b.date).getTime()
      } else {
        av = String(av || '').toLowerCase(); bv = String(bv || '').toLowerCase()
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [transactions, search, sortKey, sortDir])

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUp className="w-3 h-3 opacity-20" />
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
  }

  // ── PIN gate ───────────────────────────────────────────────────────────────
  if (step === 'pin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Wallet className="w-7 h-7 text-green-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 text-center mb-1">Finance Dashboard</h1>
            <p className="text-sm text-gray-500 text-center mb-6">Enter the finance PIN to view revenue.</p>
            <form onSubmit={handleUnlock}>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="PIN"
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-900"
                />
              </div>
              {error && (
                <div className="mt-3 flex items-start gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Unlock
              </button>
            </form>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            Set the PIN in Django admin → Events - Finance Settings.
          </p>
        </div>
      </div>
    )
  }

  // ── Dashboard ────────────────────────────────────────────────────────────────
  const summaryCards = [
    { key: 'vote', label: 'Voting', value: totals.vote, icon: Vote, color: 'text-green-600 bg-green-50' },
    { key: 'ticket', label: 'Ticketing', value: totals.ticket, icon: TicketIcon, color: 'text-blue-600 bg-blue-50' },
    { key: 'contribution', label: 'Contributions', value: totals.contribution, icon: HeartHandshake, color: 'text-purple-600 bg-purple-50' },
    { key: 'grand', label: 'Grand Total', value: totals.grand, icon: TrendingUp, color: 'text-white bg-green-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 leading-tight">Finance Dashboard</h1>
              <p className="text-xs text-gray-500">Revenue across voting, ticketing &amp; contributions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={downloading || loading}
              className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              PDF
            </button>
            <button
              onClick={handleLock}
              className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm font-medium px-3 py-2"
            >
              <LogOut className="w-4 h-4" />
              Lock
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {summaryCards.map((c) => {
            const Icon = c.icon
            const isGrand = c.key === 'grand'
            return (
              <div
                key={c.key}
                className={`rounded-2xl border p-4 ${isGrand ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-100'}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-3 ${isGrand ? 'bg-white/20' : c.color}`}>
                  <Icon className={`w-5 h-5 ${isGrand ? 'text-white' : ''}`} />
                </div>
                <p className={`text-xs font-medium ${isGrand ? 'text-green-50' : 'text-gray-500'}`}>{c.label}</p>
                <p className={`text-lg font-bold mt-0.5 ${isGrand ? 'text-white' : 'text-gray-900'}`}>{fmtMoney(c.value)}</p>
              </div>
            )
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) => setFilters((f) => ({ ...f, date_from: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => setFilters((f) => ({ ...f, date_to: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Source</label>
              <select
                value={filters.source}
                onChange={(e) => setFilters((f) => ({ ...f, source: e.target.value as Filters['source'] }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="all">All sources</option>
                <option value="vote">Voting</option>
                <option value="ticket">Ticketing</option>
                <option value="contribution">Contributions</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as Filters['status'] }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="successful">Successful</option>
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
                <option value="reversed">Reversed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Event</label>
              <select
                value={filters.event}
                onChange={(e) => setFilters((f) => ({ ...f, event: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="">All events</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
              <input
                type="text"
                value={filters.phone}
                onChange={(e) => setFilters((f) => ({ ...f, phone: e.target.value }))}
                placeholder="07..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">M-Pesa Code</label>
              <input
                type="text"
                value={filters.mpesa_code}
                onChange={(e) => setFilters((f) => ({ ...f, mpesa_code: e.target.value.toUpperCase() }))}
                placeholder="e.g. TXABC123"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleApply}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-black disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Search + count */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, code..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <p className="text-sm text-gray-500 flex-shrink-0">{filtered.length} transaction{filtered.length === 1 ? '' : 's'}</p>
        </div>

        {/* Transactions table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  {([
                    ['date', 'Date'],
                    ['source', 'Source'],
                    ['name', 'Name'],
                    ['phone', 'Phone'],
                    ['mpesa_code', 'M-Pesa Code'],
                    ['status', 'Status'],
                    ['amount', 'Amount'],
                  ] as [SortKey, string][]).map(([key, label]) => (
                    <th
                      key={key}
                      onClick={() => toggleSort(key)}
                      className={`px-4 py-3 font-semibold cursor-pointer select-none whitespace-nowrap ${key === 'amount' ? 'text-right' : 'text-left'}`}
                    >
                      <span className={`inline-flex items-center gap-1 ${key === 'amount' ? 'justify-end' : ''}`}>
                        {label} <SortIcon column={key} />
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3 font-semibold text-left whitespace-nowrap">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading transactions...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                      No transactions match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => {
                    const meta = SOURCE_META[r.source] || { label: r.source, badge: 'bg-gray-100 text-gray-600' }
                    return (
                      <tr key={r.id} className="hover:bg-gray-50/60">
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{fmtDate(r.date)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${meta.badge}`}>{meta.label}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-900 font-medium">{r.name || '—'}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.phone || '—'}</td>
                        <td className="px-4 py-3 text-gray-600 font-mono text-xs">{r.mpesa_code || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_BADGE[r.status] || 'bg-gray-100 text-gray-600'}`}>{r.status}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">{fmtMoney(r.amount)}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {r.reference}{r.event_title ? ` — ${r.event_title}` : ''}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Summary totals count successful payments only. Use the filters above, then download a PDF statement of the current view.
        </p>
      </div>
    </div>
  )
}

export default FinancePage
