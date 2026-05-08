# Miss Culture Global Kenya

Official digital platform for Miss Culture Global Kenya.

- description: 'Miss Culture Global Kenya is a movement showcasing Kenya's heritage through pageants, community programs, and global partnerships.',

## 🌟 Project Overview

Built with Next.js for the frontend and Django for the backend. The project includes:

- **Main Website** (misscultureglobalkenya.com)
- **Gallery Subdomain** (gallery.misscultureglobalkenya.com)
- **Events Subdomain** (events.misscultureglobalkenya.com)
- **Unified Social Media Content Strategy**

## 🚀 Features

### Main Website
- **Hero Section**: Cinematic, full-screen presentation with cultural imagery
- **Our Kenya**: Exploration of Kenya's regions and communities
- **Our Culture**: Showcase of languages, traditions, and heritage
- **Global Stage**: Kenya's achievements and international presence
- **The Ambassador**: Susan's personal journey and mission
- **Live Social Feed**: Instagram integration with latest posts
- **Follow CTA**: Modern social media engagement

### Gallery Subdomain
- **Masonry Layout**: Modern photo grid with collections
- **Filters**: Official Photoshoots, Cultural Events, Behind the Scenes, Community Work
- **Lightbox Mode**: High-res image previews with navigation
- **Social Sharing**: Quick share functionality
- **Django Admin**: Easy content management

### Events & Voting
- **Interactive Calendar**: Past/upcoming events with hover previews
- **Event Details**: Comprehensive event information with Google Maps
- **Ticketing System**: Secure M-Pesa ticket purchases with automated issuance
- **Voting System**: Real-time voting for contestants with M-Pesa integration
- **Cookie Consent**: Browser banner that stores consent state locally
- **Admin Control**: Full event, inquiry, and voting management

## 🛠️ Technical Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation and motion library
- **Lucide React** - Beautiful icon library

### Backend
- **Django 5.2** - Python web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Database (SQLite for development)
- **Django CORS Headers** - Cross-origin resource sharing
- **Django Filter** - Advanced filtering capabilities

## 📁 Project Structure

```
miss-culture-global-kenya/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   └── styles/          # Global styles
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Django backend application
│   ├── missculture/         # Django project settings
│   ├── main/                # Main app (ambassador, culture, etc.)
│   ├── gallery/             # Gallery app
│   ├── events/              # Events app
│   └── manage.py
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Start the development server:
```bash
python manage.py runserver
```

The Django admin will be available at `http://localhost:8000/admin/`
The API will be available at `http://localhost:8000/api/`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The Next.js application will be available at `http://localhost:3000`

## ⚙️ Production Configuration

To go live, ensure the following environment variables are set in your hosting provider:

### Backend (.env)
- `DEBUG=False`
- `SECRET_KEY`: A long, random string
- `ALLOWED_HOSTS`: `yourdomain.com,api.yourdomain.com`
- `CORS_ALLOWED_ORIGINS`: `https://yourdomain.com`
- `MPESA_CONSUMER_KEY` & `MPESA_CONSUMER_SECRET`: From Safaricom Daraja
- `MPESA_PASSKEY`: From Safaricom Daraja
- `TELEGRAM_BOT_TOKEN` & `TELEGRAM_CHAT_ID`: For real-time payment alerts
- `CLOUDINARY_URL`: For image storage

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: `https://api.yourdomain.com/api`

## 📊 API Endpoints

### Main App (`/api/main/`)
- `GET /ambassador/` - Ambassador profile
- `GET /communities/` - Cultural communities
- `GET /heritage/` - Cultural heritage items
- `GET /regions/` - Kenya regions
- `GET /achievements/` - Global achievements
- `GET /partners/` - Partners and sponsors
- `GET /social-media/` - Social media posts

### Gallery App (`/api/gallery/`)
- `GET /collections/` - Photo collections
- `GET /photos/` - Gallery photos
- `GET /videos/` - Gallery videos
- `GET /settings/` - Gallery settings

### Events App (`/api/events/`)
- `GET /events/` - All events
- `GET /events/upcoming/` - Upcoming events
- `GET /events/past/` - Past events
- `GET /events/featured/` - Featured events
- `POST /inquiries/` - Create event inquiry
- `GET /categories/` - Event categories
- `GET /settings/` - Event settings
- `GET /contestants/` - Voting contestants

## 📝 Admin-Frontend Mapping

| Frontend Page | Admin Section to Update |
| :--- | :--- |
| **Home Page** | Main → Events (Featured), Site Settings |
| **Ambassador** | Main → Ambassadors |
| **Our Culture** | Main → Cultural Heritage, Communities |
| **Gallery** | Gallery → Photos, Videos, Collections |
| **Events** | Events → Events, Categories |
| **Voting** | Events → Events (is_voting_active), Contestants |
| **Legal** | (Static) `/terms` and `/privacy` |

## 🎨 Design System

### Colors
- **Primary Green**: #10b981 (Kenya's natural beauty)
- **Secondary Yellow**: #f59e0b (Sunshine and warmth)
- **Accent Blue**: #3b82f6 (Sky and water)
- **Neutral Gray**: #6b7280 (Text and backgrounds)

### Typography
- **Headings**: Inter font family
- **Body**: System font stack
- **Sizes**: Responsive typography scale

### Components
- **Navigation**: Fixed header with smooth scrolling
- **Hero**: Full-screen immersive sections
- **Cards**: Consistent shadow and hover effects
- **Buttons**: Rounded corners with hover animations
- **Forms**: Clean, accessible input styling

## 🛡️ Privacy & Browser Storage
- The frontend shows a cookie consent banner via `frontend/src/components/CookieConsent.tsx`.
- Consent is stored in browser localStorage under `mcgk_cookie_consent`.
- Checkout convenience data (phone, name, email) is also stored locally in `mcgk_user_info`.
- Site settings are cached client-side in `frontend/src/lib/useSiteSettings.ts` and reused across requests.
- API request caching is configured with SWR in `frontend/src/components/Providers.tsx` using deduping and stale revalidation.
- Note: there is no dedicated backend cache-control or service worker caching configured in source control yet; for production, add CDN or cache headers for static assets and API responses.

## 🌐 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Set environment variables
4. Deploy

### Backend (Railway/Heroku)
1. Create a new project
2. Connect your GitHub repository
3. Set environment variables:
   - `SECRET_KEY`
   - `DEBUG=False`
   - `ALLOWED_HOSTS`
   - Database URL
4. Deploy

### Domain Configuration
- Main site: `misscultureglobalkenya.com`
- Gallery: `gallery.misscultureglobalkenya.com`
- Events: `events.misscultureglobalkenya.com`

## 📱 Social Media Integration

### Instagram API
- Real-time post fetching
- Automatic content updates
- Social engagement tracking

### Hashtag Strategy
- Primary: `#MissCultureGlobalKenya`
- Supporting: `#KenyaCulture`, `#CulturalAmbassador`, `#GlobalUnity`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 📞 Support

For technical support or questions:
- Email: tech@misscultureglobalkenya.com
- Phone: +254 700 000 000

---

**Miss Culture Global Kenya** - Embodying the Spirit of Kenya, Celebrating Global Culture.
#   M i s s C u l t u r e K e n y a - F i n a l 
 
 