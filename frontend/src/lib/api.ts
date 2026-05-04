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
  raw?: string
  code?: string
}

function extractError(err: any): ApiError {
  // Defensive: log the raw error structure for debugging
  try {
    console.error('Raw error:', JSON.stringify({
      isAxiosError: axios.isAxiosError(err),
      hasResponse: !!err?.response,
      status: err?.response?.status,
      dataType: typeof err?.response?.data,
      data: err?.response?.data,
      requestStatus: err?.request?.status,
      message: err?.message,
      code: err?.code,
    }, null, 2))
  } catch {
    // ignore stringify failures
  }

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
      return {
        message: dataStr.slice(0, 200) || `Request failed (HTTP ${status})`,
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

  // Initiate Daraja STK Push for voting
  initiateVotePayment(eventId: number | string, data: { phone_number: string; amount: number; contestant_id: number }) {
    return handle(client.post(`/api/events/events/${eventId}/initiate_vote_payment/`, data))
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
