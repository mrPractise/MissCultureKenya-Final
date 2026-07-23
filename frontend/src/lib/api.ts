import axios from 'axios'

const rawBaseFromEnv = process.env.NEXT_PUBLIC_API_BASE_URL
const rawBase =
  rawBaseFromEnv ?? (process.env.NODE_ENV === 'production' ? 'https://api.misscultureglobalkenya.com' : 'http://localhost:8000')
let BASE = rawBase.replace(/\/+$/, "")
if (BASE.endsWith("/admin")) {
  BASE = BASE.slice(0, -"/admin".length)
}

const client = axios.create({
  baseURL: BASE,
  timeout: 30000,  // 30 seconds - allows for email operations
})

interface ApiError {
  message: string
  detail?: string
  errors?: Record<string, string[]>
  status?: number
  raw?: string
  code?: string
}

interface FinanceFilters {
  pin: string
  date_from?: string
  date_to?: string
  source?: 'all' | 'vote' | 'ticket' | 'contribution'
  event?: number | string | null
  phone?: string
  mpesa_code?: string
  status?: 'all' | 'successful' | 'pending' | 'failed' | 'cancelled' | 'reversed'
}

function extractError(err: any): ApiError {
  if (axios.isAxiosError(err)) {
    if (err.response) {
      const data = err.response.data
      const status = err.response.status

      // DRF returns { detail: "..." } or { field_name: ["error"] } or { error: "..." }
      if (data && typeof data === 'object') {
        const errors: Record<string, string[]> = {}
        let message = data.detail || data.message || data.error || data.title || ''

        for (const [key, value] of Object.entries(data)) {
          if (['detail', 'message', 'error', 'title', 'status'].includes(key)) continue
          if (Array.isArray(value)) {
            errors[key] = value.map(String)
          } else if (typeof value === 'string') {
            errors[key] = [value]
          } else if (value !== null && value !== undefined) {
            errors[key] = [String(value)]
          }
        }

        if (!message && Object.keys(errors).length > 0) {
          message = Object.entries(errors).map(([k, v]) => `${k}: ${v.join(', ')}`).join('; ')
        }

        return {
          message: message || `Request failed (HTTP ${status})`,
          errors: Object.keys(errors).length ? errors : undefined,
          detail: data.detail,
          status,
          raw: JSON.stringify(data),
        }
      }

      // Non-JSON response (e.g. HTML error page)
      const dataStr = String(data || '')
      const looksLikeHtml = /<!doctype html|<html[\s>]/i.test(dataStr)
      return {
        message: looksLikeHtml
          ? `Server error (HTTP ${status}). The backend returned an HTML error page. Check backend logs and migrations.`
          : (dataStr.slice(0, 200) || `Request failed (HTTP ${status})`),
        status,
        raw: dataStr.slice(0, 500),
      }
    }

    // Request was made but no response received (network/CORS)
    return {
      message: err.message || 'Network error — server did not respond. Check that the backend is running.',
      code: err.code,
    }
  }

  // Non-Axios error
  return {
    message: err?.message || String(err) || 'An unexpected error occurred.',
  }
}

async function handle(promise: Promise<any>) {
  try {
    const res = await promise
    return res.data
  } catch (err) {
    const apiErr = extractError(err)
    throw apiErr
  }
}

const apiClient = {
  getEvents(params = {}) {
    return handle(client.get('/api/events/events/', { params }))
  },
  getUpcomingEvents(params = {}) {
    return handle(client.get('/api/events/events/upcoming/', { params }))
  },
  getPastEvents(params = {}) {
    return handle(client.get('/api/events/events/past/', { params }))
  },
  getEventCategories(params = {}) {
    return handle(client.get('/api/events/categories/', { params }))
  },
  getEvent(id: number | string) {
    return handle(client.get(`/api/events/events/${id}/`))
  },
  getPhotos(params = {}) {
    return handle(client.get('/api/gallery/photos/', { params }))
  },
  getPhotoCollections(params = {}) {
    return handle(client.get('/api/gallery/collections/', { params }))
  },
  getVideos(params = {}) {
    return handle(client.get('/api/gallery/videos/', { params }))
  },
  getPartners(params = {}) {
    return handle(client.get('/api/main/partners/', { params }))
  },
  getAmbassador(params = {}) {
    return handle(client.get('/api/main/ambassador/', { params }))
  },
  getDiscoverKenya(params = {}) {
    return handle(client.get('/api/main/discover/', { params }))
  },
  // Generic GET
  get(path: string, params = {}) {
    return handle(client.get(path, { params }))
  },
  // Site settings (logos only)
  getSiteSettings() {
    return handle(client.get('/api/main/settings/'))
  },
  // Page-specific settings APIs
  getHomePageSettings() {
    return handle(client.get('/api/main/settings/home/'))
  },
  getKenyaPageSettings() {
    return handle(client.get('/api/main/settings/kenya/'))
  },
  getAmbassadorPageSettings() {
    return handle(client.get('/api/main/settings/ambassador/'))
  },
  getEventsPageSettings() {
    return handle(client.get('/api/main/settings/events/'))
  },
  getGalleryPageSettings() {
    return handle(client.get('/api/main/settings/gallery/'))
  },
  getPartnershipPageSettings() {
    return handle(client.get('/api/main/settings/partnership/'))
  },
  getAboutPageSettings() {
    return handle(client.get('/api/main/settings/about/'))
  },
  getVotingPageSettings() {
    return handle(client.get('/api/main/settings/voting/'))
  },
  getContactPageSettings() {
    return handle(client.get('/api/main/settings/contact/'))
  },
  getFAQPageSettings() {
    return handle(client.get('/api/main/settings/faq/'))
  },
  getContributePageSettings() {
    return handle(client.get('/api/main/settings/contribute/'))
  },
  getPrivacyPageSettings() {
    return handle(client.get('/api/main/settings/privacy/'))
  },
  getTermsPageSettings() {
    return handle(client.get('/api/main/settings/terms/'))
  },
  // Contact form
  sendContactMessage(data: { name: string; email: string; phone?: string; subject?: string; message: string; type?: string }) {
    return handle(client.post('/api/main/contact/', data))
  },
  // Team members (leadership + committee)
  getTeamMembers(params = {}) {
    return handle(client.get('/api/main/team/', { params }))
  },

  // ── Ticketing & Voting API ───────────────────────────────────────────────

  // Events with voting enabled
  getVotingEvents(params = {}) {
    return handle(client.get('/api/events/events/voting_events/', { params }))
  },

  // Contestants for a specific event
  getEventContestants(eventId: number | string, params = {}) {
    return handle(client.get('/api/events/contestants/', { params: { event: eventId, ...params } }))
  },

  // Single contestant
  getContestant(contestantId: number | string) {
    return handle(client.get(`/api/events/contestants/${contestantId}/`))
  },

  // Public contestant page data
  getContestantPublicPage(contestantId: number | string) {
    return handle(client.get(`/api/events/contestants/${contestantId}/public_page/`))
  },

  // Live results for an event
  getLiveResults(eventId: number | string) {
    return handle(client.get(`/api/events/events/${eventId}/live_results/`))
  },

  // Verify votes by phone number (event-specific)
  verifyVotesByEvent(eventId: number | string, phone: string) {
    return handle(client.get(`/api/events/events/${eventId}/vote_verify/`, { params: { phone } }))
  },

  // Verify votes by phone number (across all events)
  verifyVotesByPhone(phone: string) {
    return handle(client.get('/api/events/verify-votes/', { params: { phone } }))
  },

  // Register free ticket for an event
  registerFreeTicket(eventId: number | string, data: { full_name: string; email: string; phone?: string; ticket_category?: number }) {
    return handle(client.post(`/api/events/events/${eventId}/register_ticket/`, data))
  },

  // Create a pending payment (for votes or tickets)
  createPayment(data: {
    event: number
    phone_number: string
    mpesa_code?: string
    amount: number
    status: string
    payment_type: string
    contestant?: number
    ticket_category?: number
    ticket_quantity?: number
    ticket_breakdown?: Record<string, number>
    full_name?: string
    email?: string
  }) {
    return handle(client.post('/api/events/payments/', data))
  },

  // Initiate M-Pesa STK Push for voting
  initiateVotePayment(eventId: number | string, data: { phone_number: string; amount: number; contestant_id: number }) {
    return handle(client.post(`/api/events/events/${eventId}/initiate_vote_payment/`, data))
  },

  // Initiate M-Pesa STK Push for ticket purchase
  initiateTicketPayment(eventId: number | string, data: { phone_number: string; full_name: string; email: string; ticket_breakdown: Record<string, number> }) {
    return handle(client.post(`/api/events/events/${eventId}/initiate_ticket_payment/`, data))
  },

  // Gate check-in: list events that have check-in enabled
  checkinEvents() {
    return handle(client.get('/api/events/checkin/events/'))
  },

  // Gate check-in: PIN-protected list of tickets for one event
  checkinList(data: { event: number | string; pin: string; search?: string }) {
    return handle(client.post('/api/events/checkin/list/', data))
  },

  // Gate check-in: mark a ticket used/unused (never deletes)
  checkinToggle(data: { event: number | string; pin: string; ticket_id?: number; ticket_code?: string; is_used: boolean }) {
    return handle(client.post('/api/events/checkin/toggle/', data))
  },

  // Finance dashboard: PIN-protected revenue report (voting, ticketing, contributions)
  financeReport(data: FinanceFilters) {
    return handle(client.post('/api/events/finance/report/', data))
  },

  // Finance dashboard: download the filtered statement as a PDF (POST → blob, keeps PIN out of the URL)
  async downloadFinanceStatement(data: FinanceFilters) {
    const res = await fetch(`${BASE}/api/events/finance/statement-pdf/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      let message = `Failed to generate statement (HTTP ${res.status})`
      try {
        const body = await res.json()
        message = body.error || body.detail || message
      } catch { /* non-JSON error */ }
      throw { message, status: res.status } as ApiError
    }
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `statement-${new Date().toISOString().slice(0, 10)}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  },


  // Initiate M-Pesa STK Push for public contributions
  // Returns { success, checkout_request_id, merchant_request_id, contribution_id, message }
  initiateContributionPayment(data: { full_name: string; email: string; phone_number?: string; amount: number }) {
    return handle(client.post('/api/events/contributions/initiate/', data))
  },

  // Contribution status check (for polling the STK flow)
  getContributionStatus(contributionId: number | string) {
    return handle(client.get(`/api/events/contributions/${contributionId}/`))
  },

  // Ticket categories for an event
  getTicketCategories(eventId: number | string, params = {}) {
    return handle(client.get('/api/events/ticket-categories/', { params: { event: eventId, ...params } }))
  },

  // Ticket lookup by code
  getTicketByCode(code: string) {
    return handle(client.get('/api/events/ticket-lookup/', { params: { code } }))
  },

  // Full URL to download a ticket PDF by code (browser downloads it directly).
  ticketPdfUrl(code: string) {
    return `${BASE}/api/events/ticket-pdf/?code=${encodeURIComponent(code)}`
  },

  // Single ticket by ID
  getTicket(ticketId: number | string) {
    return handle(client.get(`/api/events/tickets/${ticketId}/`))
  },

  // Payment status check
  getPaymentStatus(paymentId: number | string) {
    return handle(client.get(`/api/events/payments/${paymentId}/`))
  },
}

export default apiClient
export type { ApiError }

// Trigger a browser download of a ticket PDF by code. The backend responds with
// Content-Disposition: attachment, so the browser downloads the file (and shows
// its own download notification) instead of navigating away.
export function downloadTicketPdf(code: string) {
  if (typeof document === 'undefined' || !code) return
  const a = document.createElement('a')
  a.href = apiClient.ticketPdfUrl(code)
  a.rel = 'noopener'
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// Download a list of ticket codes, staggered so browsers don't block the batch.
export function downloadTickets(codes: string[]) {
  codes.filter(Boolean).forEach((code, i) => {
    setTimeout(() => downloadTicketPdf(code), i * 700)
  })
}
