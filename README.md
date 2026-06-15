# Miss Culture Global Kenya

Official digital platform for Miss Culture Global Kenya — a movement showcasing Kenya's heritage through pageants, community programs, and global partnerships.

The site is a full-stack web application. A Next.js frontend serves the public website, gallery, events, voting, and contributions. A Django REST API powers content management, ticketing, voting, and payments. Administrators update most content through Django Admin without touching code.

---

**Main website**

The homepage presents the organization through a hero section, impact statistics, mission and vision, cultural impact highlights, core values, ambassador spotlight, support blocks, and social links. Content is loaded from the API and page-specific settings managed in the backend.

**Kenya** (`/kenya`) — Regions, communities, and cultural heritage content. Includes a unified view of Kenya's diversity drawn from the `discover` API endpoint.

**Ambassador** (`/ambassador`) — Profile, story, and media for the cultural ambassador.

**About** (`/about`) — Organization background, leadership team, and committee members.

**Partnership** (`/partnership`) — Partner and sponsor information with a dedicated contact flow.

**Contact** (`/contact`) — Contact form that submits to the backend and triggers email notifications via Resend.

**FAQ** (`/faq`) — Frequently asked questions managed through page settings.

**Terms and Privacy** (`/terms`, `/privacy`) — Legal pages with content editable from the admin.

---

**Gallery** (`/gallery`)

Photo and video gallery with collections, category filters (official photoshoots, cultural events, behind the scenes, community work, and more), and a lightbox for full-size viewing. Images are stored on Cloudinary. Gallery layout and hero content are configurable in Django Admin.

---

**Events** (`/events`)

Event listing with upcoming, past, and featured events. Each event includes dates, venue, location coordinates, descriptions, media, and optional external registration or ticket URLs.

**Event detail** (`/events/[id]`) — Full event information, ticket categories, and links to checkout or registration.

**Ticketing**

- Ticket categories with configurable pricing per event
- Free ticket registration for events with no charge
- Paid tickets through PesaPal checkout (M-Pesa and card)
- Unique ticket codes in the format `PREFIX-RAND4#YY` (e.g. `FOS-WER3#26`)
- PDF ticket generation and email delivery after successful payment
- Ticket lookup by code at `/events/[id]/ticket/[ticketCode]`
- Gate scanning support via an `is_used` flag on each ticket

**Checkout flow** — `/events/[id]/checkout`, payment redirect, and success confirmation pages.

---

**Voting** (`/voting`)

Public voting for pageant and cultural events when voting is enabled on an event.

- Events can be set to draft, active, voting open, voting closed, or archived
- Configurable vote price, voting window, and result visibility (full live totals, rankings only, hidden, or no public updates)
- Contestant profiles with public pages at `/voting/[eventSlug]/[contestantSlug]`
- Paid votes through PesaPal; vote count is calculated from payment amount and vote price on the backend
- Live results endpoint for real-time standings
- Vote verification by phone number, per event or across all events
- Immutable vote transaction records and audit logging for admin actions

---

**Contributions** (`/contribute`)

Public donation page for supporting cultural preservation, youth leadership, global ambassadorship, and community development. Donors initiate payment through PesaPal; the backend handles IPN callbacks and redirects back to the frontend.

---

**Content management**

Most visual and textual content is managed in Django Admin:

| Public page | Admin area |
|---|---|
| Home | Main → Home Page Settings, Events (featured) |
| Kenya | Main → Regions, Communities, Heritage, Kenya Page Settings |
| Ambassador | Main → Ambassador, Ambassador Page Settings |
| About | Main → Team Members, About Page Settings |
| Gallery | Gallery → Photos, Videos, Collections |
| Events | Events → Events, Categories, Ticket Categories |
| Voting | Events → Events (voting config), Contestants |
| Contact, FAQ, Contribute, Legal | Respective Page Settings under Main |

Site-wide logos and shared assets live in Site Settings. Page-specific settings expose hero images, copy, and layout content through dedicated API endpoints under `/api/main/settings/`.

---

**Payments and notifications**

- **PesaPal** — Primary payment gateway for tickets, votes, and contributions
- **Email** — Resend for contact messages, ticket delivery, and transactional email
- **Telegram** — Optional payment alerts when `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are configured
- **Cloudinary** — Image and media storage for gallery, events, and site settings

---

**Privacy and client storage**

The frontend shows a cookie consent banner. Consent is stored in `localStorage` under `mcgk_cookie_consent`. Checkout convenience data (phone, name, email) may be stored locally under `mcgk_user_info`. Site settings are cached client-side and fetched with SWR for deduplication and revalidation.

---

**Technical stack**

Frontend: Next.js (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Axios, SWR.

Backend: Django 5.2, Django REST Framework, PostgreSQL in production (SQLite for local development), Cloudinary, PesaPal integration, Gunicorn, WhiteNoise.

---

**Project structure**

```
MissCultureKenya-Final-main/
├── frontend/          Next.js application
│   └── src/
│       ├── app/       Pages and routes
│       ├── components/
│       └── lib/       API client and settings hooks
├── backend/           Django application
│   ├── missculture/   Project settings
│   ├── main/          Site content, settings, contact
│   ├── gallery/       Photos, videos, collections
│   └── events/        Events, tickets, voting, payments
└── README.md
```

---

**Getting started**

Prerequisites: Node.js 18+, Python 3.8+, Git.

Backend:

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Admin: `http://localhost:8000/admin/`  
API: `http://localhost:8000/api/`

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Site: `http://localhost:3000`

Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000` in `frontend/.env.local` so the frontend talks to the local backend.

---

**Environment variables**

Backend (`.env` in `backend/`):

| Variable | Purpose |
|---|---|
| `SECRET_KEY` | Django secret key |
| `DEBUG` | `True` for local development |
| `ALLOWED_HOSTS` | Comma-separated hostnames |
| `DATABASE_URL` | PostgreSQL connection string (optional locally) |
| `CORS_ALLOWED_ORIGINS` | Frontend origin(s), e.g. `http://localhost:3000` |
| `CSRF_TRUSTED_ORIGINS` | Same as CORS for form submissions |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Media storage |
| `PESAPAL_CONSUMER_KEY`, `PESAPAL_CONSUMER_SECRET` | Payment gateway |
| `PESAPAL_IPN_ID`, `PESAPAL_CALLBACK_URL`, `PESAPAL_IPN_URL` | PesaPal callbacks |
| `FRONTEND_URL` | Frontend base URL for payment redirects |
| `RESEND_API_KEY`, `DEFAULT_FROM_EMAIL`, `ADMIN_EMAIL` | Email delivery |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Optional payment notifications |

Frontend (`frontend/.env.local`):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Backend URL, e.g. `http://localhost:8000` |

---

**API overview**

Main (`/api/main/`):

- `GET /settings/` — Site-wide settings and logos
- `GET /settings/{page}/` — Page-specific settings (home, kenya, ambassador, events, gallery, etc.)
- `GET /ambassador/`, `/communities/`, `/heritage/`, `/regions/`, `/achievements/`, `/partners/`, `/team/`
- `GET /discover/` — Combined Kenya content
- `POST /contact/` — Contact form submission

Gallery (`/api/gallery/`):

- `GET /collections/`, `/photos/`, `/videos/`, `/settings/`

Events (`/api/events/`):

- `GET /events/`, `/events/upcoming/`, `/events/past/`, `/events/featured/`, `/events/voting_events/`
- `GET /events/{id}/live_results/` — Voting standings
- `POST /events/{id}/register_ticket/` — Free ticket registration
- `POST /events/{id}/initiate_ticket_payment/` — Paid ticket checkout
- `POST /events/{id}/initiate_vote_payment/` — Vote checkout
- `GET /contestants/`, `/ticket-categories/`
- `GET /verify-votes/?phone=` — Vote lookup by phone
- `GET /ticket-lookup/?code=` — Ticket lookup by code
- `POST /contributions/initiate/` — Donation checkout

---

**Deployment**

The backend includes a `railway.json` config that runs migrations, ensures a superuser, collects static files, and starts Gunicorn. The frontend builds with `npm run build` and runs with `npm start`. Typical setup places the Next.js app on Vercel (or similar) and the Django API on Railway (or similar), with PostgreSQL, Cloudinary, and PesaPal configured in production environment variables.

Production domains are intended to serve the main site, gallery, and events from the same codebase with path-based routing.

---

**License**

Proprietary and confidential. All rights reserved.
