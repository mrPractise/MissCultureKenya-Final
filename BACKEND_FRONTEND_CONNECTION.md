# Miss Culture Global Kenya - Backend & Frontend Connection Guide

## Overview

This document explains how the Django backend settings connect to the Next.js frontend, enabling dynamic content management through the Django Admin interface.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        DJANGO BACKEND                           │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  SiteSettings │───▶│  Serializer  │───▶│   API View   │      │
│  │    Model      │    │              │    │  (/api/main/)│      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         ▲                                                      │
│         │                                                      │
│  ┌──────────────┐                                              │
│  │  Django Admin │  (Admin manages all settings)                │
│  │   Interface   │                                              │
│  └──────────────┘                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ JSON API
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS FRONTEND                           │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   apiClient   │◀───│ useSiteSettings│──▶│  Components │      │
│  │   (lib/api)   │    │   (Hook)      │    │  (UI Display)│      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Backend Components

### 1. SiteSettings Model (`backend/main/models.py`)

The central configuration model that stores all site-wide settings.

#### Key Fields by Category:

| Category | Fields | Purpose |
|----------|--------|---------|
| **Logos** | `logo_kenya`, `logo_global`, `mpesa_logo` | Brand logos for navbar, footer, payments |
| **Home Page** | `home_hero_image`, `home_hero_video_url`, `home_upcoming_event_image`, `home_kenya_highlight_image`, `home_ambassador_highlight_image` | Hero images and highlights |
| **Kenya Page** | `kenya_hero_image`, `kenya_artisan_1-4_image` | Kenya cultural page images |
| **Ambassador** | `ambassador_hero_image`, `ambassador_profile_image`, `ambassador_video_url` | Ambassador showcase |
| **Events** | `events_hero_image` | Events page header |
| **Gallery** | `gallery_hero_image` | Gallery page header |
| **Voting** | `voting_hero_image`, `voting_event_1-4_image`, `voting_participant_1-6_image` | Voting page visuals |
| **Partnership** | `partnership_hero_image` | Partnership page header |
| **Contribute** | `contribute_hero_image` | Donation page header |
| **Contact** | `contact_hero_image` | Contact page header |
| **About** | `about_hero_image`, `about_mission_image`, `about_leader_1-3_image` | About page visuals |
| **Leadership** | `leader_1-3_name`, `leader_1-3_title`, `leader_1-3_bio` | Leadership team info |
| **Committee** | `committee_1-6_name`, `committee_1-6_role`, `committee_1-6_bio` | Committee members |

---

### 2. SiteSettingsSerializer (`backend/main/serializers.py`)

Transforms model data into JSON for API consumption.

#### Key Pattern:
```python
# Model field (Cloudinary image)
logo_kenya = cloudinary.models.CloudinaryField(...)

# Serializer exposes URL
logo_kenya_url = serializers.SerializerMethodField()

def get_logo_kenya_url(self, obj):
    return _cloudinary_url(obj.logo_kenya)  # Returns optimized Cloudinary URL
```

#### Available API Fields:
- All `*_url` fields (optimized image URLs via Cloudinary)
- Video URLs (direct links)
- Text fields (names, titles, bios)

---

### 3. Django Admin Configuration (`backend/main/admin.py`)

Organized fieldsets for easy management:

```python
fieldsets = (
    ('Logos', {
        'fields': ('logo_kenya', 'logo_global', 'mpesa_logo'),
        'description': 'Upload logos for Miss Culture Global Kenya...'
    }),
    ('Home Page', {...}),
    ('Kenya Page', {...}),
    # ... etc
)
```

**Access:** `https://api.misscultureglobalkenya.com/admin/main/sitesettings/`

---

### 4. API Endpoint (`backend/main/urls.py`)

```python
router.register(r'site-settings', SiteSettingsViewSet)
```

**Endpoint:** `GET /api/main/site-settings/`

**Response Example:**
```json
{
  "logo_kenya_url": "https://res.cloudinary.com/.../logo_kenya.png",
  "logo_global_url": "https://res.cloud.cloudinary.com/.../logo_global.png",
  "mpesa_logo_url": "https://res.cloudinary.com/.../mpesa_logo.png",
  "home_hero_image_url": "https://res.cloudinary.com/.../home_hero.jpg",
  "home_hero_video_url": "https://youtube.com/...",
  "leader_1_name": "Jane Doe",
  "leader_1_title": "Founder & CEO",
  "leader_1_bio": "Bio text here..."
}
```

---

## Frontend Components

### 1. API Client (`frontend/src/lib/api.ts`)

Centralized HTTP client for backend communication.

```typescript
// Base configuration
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
const API_BASE = `${BASE}/api`

// Site settings method
getSiteSettings: async () => {
  const res = await api.get('/main/site-settings/')
  return res.data
}
```

**Timeout:** 30 seconds
**Error Handling:** Automatic with user-friendly messages

---

### 2. useSiteSettings Hook (`frontend/src/lib/useSiteSettings.ts`)

React hook for accessing site settings in components.

```typescript
const useSiteSettings = () => {
  const [settings, setSettings] = useState(null)
  
  useEffect(() => {
    apiClient.getSiteSettings()
      .then(data => setSettings(data))
      .catch(() => setSettings({})) // Graceful fallback
  }, [])
  
  return settings  // Returns null (loading), {} (error), or {logo_kenya_url: "...", ...}
}
```

**Usage in Components:**
```typescript
const settings = useSiteSettings()
const logoUrl = settings?.logo_kenya_url
```

---

### 3. Component Integration Examples

#### Navigation Component
```typescript
// frontend/src/components/Navigation.tsx
const Navigation = () => {
  const [settings, setSettings] = useState(null)
  
  useEffect(() => {
    apiClient.getSiteSettings()
      .then(data => setSettings(data))
      .catch(() => {})
  }, [])
  
  // Uses logo from backend, falls back to env variable
  const logoSrc = settings?.logo_kenya_url || 
                  settings?.logo_global_url || 
                  process.env.NEXT_PUBLIC_LOGO_URL
                  
  return (
    <nav>
      {logoSrc && <Image src={logoSrc} alt="Logo" />}
    </nav>
  )
}
```

#### Footer Component
```typescript
// frontend/src/components/Footer.tsx
const Footer = () => {
  const [logoSrc, setLogoSrc] = useState(process.env.NEXT_PUBLIC_LOGO_URL)
  
  useEffect(() => {
    apiClient.getSiteSettings()
      .then(data => {
        const logo = data?.logo_kenya_url || data?.logo_global_url
        if (logo) setLogoSrc(logo)
      })
  }, [])
  
  return <footer>{logoSrc && <Image src={logoSrc} />}</footer>
}
```

#### Hero Section with Dynamic Background
```typescript
// Hero uses site settings for background
<section style={{
  backgroundImage: settings?.home_hero_image_url 
    ? `url(${settings.home_hero_image_url})` 
    : 'url(/fallback-bg.jpg)'
}}>
```

---

## M-Pesa Logo Integration

### Backend-Frontend Flow:

```
Django Admin Upload
       │
       ▼
Cloudinary Storage
       │
       ▼
API: /api/main/site-settings/
  { "mpesa_logo_url": "https://..." }
       │
       ▼
MpesaLogo Component
  - Fetches from API
  - Displays via next/image
  - Falls back to /mpesa-logo.png
```

### Usage:
```typescript
import MpesaLogo from '@/components/MpesaLogo'

// In any payment section
<MpesaLogo size="md" />  // sm | md | lg | xl
```

**Locations:**
- `/contribute` page - Payment form header
- `SupportBlocks` component - Contribution card
- `PaymentModal` - Ticket checkout
- `VotePaymentModal` - Voting checkout

---

## Data Flow Summary

### 1. Admin Uploads Image
```
Admin → Django Admin → Cloudinary → Image URL Stored in DB
```

### 2. API Serves URL
```
Frontend Request → DRF View → Serializer → JSON Response
```

### 3. Component Displays
```
React Component → useEffect Fetch → State Update → Render with Image
```

---

## Environment Variables

### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://...

# Cloudinary (Image storage)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# M-Pesa (Payments)
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_SHORTCODE=...

# Telegram (Notifications)
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...

# Email
EMAIL_HOST=smtp.zoho.com
EMAIL_HOST_USER=info@misscultureglobalkenya.com
```

### Frontend (.env.local)
```bash
# API Base URL
NEXT_PUBLIC_API_BASE_URL=https://api.misscultureglobalkenya.com

# Fallback Logo (optional, primarily managed via backend)
NEXT_PUBLIC_LOGO_URL=https://... (deprecated, use backend settings)
```

---

## Common Workflows

### Adding a New Logo
1. Go to `/admin/main/sitesettings/`
2. Scroll to **Logos** section
3. Upload image to `logo_kenya` or `logo_global`
4. Save
5. Logo appears automatically in Navigation and Footer

### Changing Hero Image
1. Go to `/admin/main/sitesettings/`
2. Find relevant page section (e.g., "Home Page")
3. Upload new image to `home_hero_image`
4. Save
5. Homepage hero updates immediately

### Adding Leadership Info
1. Go to `/admin/main/sitesettings/`
2. Find **Leadership** text fields
3. Enter `leader_1_name`, `leader_1_title`, `leader_1_bio`
4. Upload `about_leader_1_image`
5. Save - About page updates automatically

---

## Error Handling

### Backend Errors
- **Missing columns**: Run migrations (`python manage.py migrate`)
- **Missing Cloudinary config**: Check environment variables
- **API 500 errors**: Check Railway logs

### Frontend Errors
- **Images not loading**: Check browser console for 404s
- **API timeout**: 30s timeout, check backend status
- **CORS errors**: Verify `CORS_ALLOWED_ORIGINS` in backend settings

---

## File Structure Reference

```
backend/
├── main/
│   ├── models.py          # SiteSettings model
│   ├── serializers.py     # SiteSettingsSerializer
│   ├── admin.py           # Django Admin config
│   ├── views.py           # API ViewSets
│   └── migrations/        # Database migrations
├── missculture/
│   └── settings.py        # Django settings
└── railway.json           # Deploy config with auto-migrate

frontend/
├── src/
│   ├── lib/
│   │   ├── api.ts         # API client
│   │   └── useSiteSettings.ts  # React hook
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   └── MpesaLogo.tsx
│   └── app/
│       └── [pages]/
└── public/
    └── mpesa-logo.png     # Fallback logo
```

---

## API Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/main/site-settings/` | GET | All site settings |
| `/api/main/ambassador/` | GET | Ambassador data |
| `/api/main/partners/` | GET | Partners/sponsors |
| `/api/main/team/` | GET | Team members |
| `/api/events/events/` | GET | Events list |
| `/api/events/tickets/` | POST | Purchase tickets |
| `/api/events/vote/` | POST | Submit votes |
| `/api/gallery/photos/` | GET | Gallery images |

---

## Summary

**Key Principle:** All visual and textual content on the frontend can be managed via Django Admin through the `SiteSettings` model. The frontend fetches these settings via API and dynamically renders content, allowing non-technical administrators to update the website without code changes.

**For Developers:**
- Backend: Add fields to `SiteSettings` model → Create migration → Update serializer
- Frontend: Use `useSiteSettings()` hook → Access `settings?.field_name_url` → Render

**For Administrators:**
- Use Django Admin at `/admin/main/sitesettings/`
- Upload images to Cloudinary (automatic)
- Changes reflect immediately on frontend

---

*Document Version: 1.0*
*Last Updated: May 2026*
