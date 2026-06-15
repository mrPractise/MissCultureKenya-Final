Miss Culture Global Kenya
Official digital platform for Miss Culture Global Kenya.
Miss Culture Global Kenya is a movement dedicated to showcasing Kenya's heritage through cultural pageantry, community initiatives, tourism promotion, and global partnerships.
________________________________________
🌍 Overview
This platform is built with Next.js and Django to provide a modern digital experience for Miss Culture Global Kenya.
Included Platforms
•	Main Website — misscultureglobalkenya.com
•	Gallery Platform — gallery.misscultureglobalkenya.com
•	Events & Voting Platform — events.misscultureglobalkenya.com
________________________________________
✨ Key Features
Main Website
•	Immersive hero section with cultural storytelling
•	Kenya regions and community showcase
•	Cultural heritage and traditions
•	Global achievements and partnerships
•	Ambassador profile and journey
•	Integrated social media feed
•	Modern engagement and follow sections
Gallery Platform
•	Masonry-style photo gallery
•	Collection filtering
•	High-resolution lightbox viewing
•	Social sharing functionality
•	Django-powered content management
Events & Voting Platform
•	Interactive event calendar
•	Detailed event pages
•	Secure M-Pesa ticketing
•	Real-time contestant voting
•	Cookie consent management
•	Administrative dashboard
________________________________________
🛠 Technology Stack
Frontend
Technology	Purpose
Next.js 15	React Framework
TypeScript	Type Safety
Tailwind CSS	Styling
Framer Motion	Animations
Lucide React	Icons
Backend
Technology	Purpose
Django 5.2	Backend Framework
Django REST Framework	API Development
PostgreSQL	Production Database
SQLite	Development Database
Django Filter	API Filtering
Django CORS Headers	Cross-Origin Requests
________________________________________
📂 Project Structure
miss-culture-global-kenya/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── styles/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── missculture/
│   ├── main/
│   ├── gallery/
│   ├── events/
│   └── manage.py
│
└── README.md
________________________________________
🚀 Local Development
Prerequisites
•	Node.js 18+
•	npm
•	Python 3.8+
•	Git
________________________________________
Backend Setup
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt

python manage.py migrate

python manage.py createsuperuser

python manage.py runserver
Backend URLs
Admin: http://localhost:8000/admin/
API:   http://localhost:8000/api/
________________________________________
Frontend Setup
cd frontend

npm install

npm run dev
Frontend URL
http://localhost:3000
________________________________________
⚙️ Environment Variables
Backend (.env)
DEBUG=False
SECRET_KEY=your_secret_key

ALLOWED_HOSTS=yourdomain.com,api.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com

MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_PASSKEY=

TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

CLOUDINARY_URL=
Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
________________________________________
🔌 API Modules
Main API
/api/main/
Endpoints:
•	Ambassador
•	Communities
•	Heritage
•	Regions
•	Achievements
•	Partners
•	Social Media
________________________________________
Gallery API
/api/gallery/
Endpoints:
•	Collections
•	Photos
•	Videos
•	Gallery Settings
________________________________________
Events API
/api/events/
Endpoints:
•	Events
•	Categories
•	Contestants
•	Voting
•	Event Inquiries
•	Featured Events
________________________________________
📝 Content Management Guide
Website Section	Django Admin Section
Home Page	Events, Site Settings
Ambassador	Ambassadors
Our Culture	Heritage, Communities
Gallery	Photos, Videos, Collections
Events	Events, Categories
Voting	Events & Contestants
Terms & Privacy	Static Pages
________________________________________
🎨 Design System
Brand Colors
Color	Hex
Primary Green	#10b981
Secondary Yellow	#f59e0b
Accent Blue	#3b82f6
Neutral Gray	#6b7280
Typography
•	Headings: Inter
•	Body: System Font Stack
•	Responsive typography scaling
UI Components
•	Fixed navigation
•	Full-screen hero sections
•	Interactive cards
•	Animated buttons
•	Accessible forms
________________________________________
🔒 Privacy & Browser Storage
The platform stores limited client-side data for user experience improvements:
•	Cookie consent preferences
•	Checkout information
•	Site settings cache
•	API response caching through SWR
For production deployments, CDN caching and cache-control headers are recommended.
________________________________________
🌐 Deployment
Frontend Deployment
Recommended: Vercel
Build Command: npm run build
Output Directory: .next
Backend Deployment
•	Railway
Required configuration:
SECRET_KEY
DEBUG=False
ALLOWED_HOSTS
DATABASE_URL
________________________________________
🌍 Domain Structure
Platform	Domain
Main Website	misscultureglobalkenya.com
Gallery	gallery.misscultureglobalkenya.com
Events & Voting	events.misscultureglobalkenya.com
________________________________________



