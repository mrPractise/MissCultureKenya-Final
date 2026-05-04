import axios from 'axios'

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

const client = axios.create({
  baseURL: BASE,
  timeout: 10000,
})

interface ApiError {
  message: string
  detail?: string
  errors?: Record<string, string[]>
  status?: number
}

function extractError(err: any): ApiError {
  if (axios.isAxiosError(err) && err.response) {
    const data = err.response.data
    const status = err.response.status
    // DRF returns { detail: "..." } or { field_name: ["error"] }
    if (typeof data === 'object' && data !== null) {
      const errors: Record<string, string[]> = {}
      let message = data.detail || data.message || data.error || ''
      for (const [key, value] of Object.entries(data)) {
        if (key === 'detail' || key === 'message' || key === 'error') continue
        if (Array.isArray(value)) {
          errors[key] = value.map(String)
        } else if (typeof value === 'string') {
          errors[key] = [value]
        }
      }
      if (!message && Object.keys(errors).length > 0) {
        message = Object.entries(errors).map(([k, v]) => `${k}: ${v.join(', ')}`).join('; ')
      }
      return { message: message || `Request failed (HTTP ${status})`, errors: Object.keys(errors).length ? errors : undefined, detail: data.detail, status }
    }
    return { message: String(data) || `Request failed (HTTP ${status})`, status }
  }
  return { message: err?.message || 'Network error — please check your connection and try again.' }
}

async function handle(promise: Promise<any>) {
  try {
    const res = await promise
    return res.data
  } catch (err) {
    const apiErr = extractError(err)
    // Log for developer console debugging
    console.error('API Error:', apiErr)
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
  // Site settings (hero images per tab)
  getSiteSettings() {
    return handle(client.get('/api/main/settings/'))
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
  createPayment(data: { event: number; phone_number: string; mpesa_code: string; amount: number; status: string; payment_type: string }) {
    return handle(client.post('/api/events/payments/', data))
  },

  // Ticket categories for an event
  getTicketCategories(eventId: number | string, params = {}) {
    return handle(client.get('/api/events/ticket-categories/', { params: { event: eventId, ...params } }))
  },

  // Ticket lookup by code
  getTicketByCode(code: string) {
    return handle(client.get('/api/events/ticket-lookup/', { params: { code } }))
  },

  // Single ticket by ID
  getTicket(ticketId: number | string) {
    return handle(client.get(`/api/events/tickets/${ticketId}/`))
  },
}

export default apiClient
export type { ApiError }
