# Django Admin → Frontend Mapping Guide

This document explains what each Django Admin section does and which frontend pages it affects.

---

## 🎯 MAIN APP (`/api/main/`)

### 1. **Ambassadors** (`Main → Ambassadors`)
**Backend Model:** `Ambassador`  
**API Endpoint:** `/api/main/ambassador/`  
**Frontend Pages Affected:**
- `/ambassador` - Ambassador page

**What it controls:**
- Ambassador's name, title, bio, mission statement
- Featured image/photo
- Gallery images (if supported)

**How to use:**
- Add/Edit the current Miss Culture Global Kenya representative
- Only one ambassador should be active at a time
- Update bio and mission statement as needed

---

### 2. **Blog Posts** (`Main → Blog posts`)
**Backend Model:** `BlogPost`  
**API Endpoint:** `/api/main/blog/`  
**Frontend Pages Affected:**
- `/blog` - Blog page
- `/` (home page) - BlogFeed component

**What it controls:**
- Blog post title, content, excerpt
- Author name
- Publication date
- Featured image
- Category
- Published status (draft vs published)

**How to use:**
- Create blog posts about cultural events, ambassador's journey, community stories
- Set `published=True` to make posts visible on frontend
- Use featured images for visual appeal
- Organize by categories for filtering

---

### 3. **Cultural Communities** (`Main → Cultural communities`)
**Backend Model:** `CulturalCommunity`  
**API Endpoint:** `/api/main/communities/`  
**Frontend Pages Affected:**
- `/our-culture` - Our Culture page

**What it controls:**
- Community name and description
- Associated region
- Featured status
- Community-specific content

**How to use:**
- Add Kenya's diverse cultural communities (Kikuyu, Luo, Maasai, Kalenjin, etc.)
- Mark important communities as `featured=True`
- Link to specific regions

---

### 4. **Cultural Heritage** (`Main → Cultural heritage`)
**Backend Model:** `CulturalHeritage`  
**API Endpoint:** `/api/main/heritage/`  
**Frontend Pages Affected:**
- `/our-culture` - Our Culture page (Heritage Sites section)

**What it controls:**
- Heritage site name/title
- Description
- Heritage type (UNESCO, Historical Monument, Archaeological Site, etc.)
- Featured status

**How to use:**
- Add UNESCO World Heritage Sites (Lamu Old Town, Fort Jesus, etc.)
- Add important cultural/historical landmarks
- Mark most significant sites as `featured=True`
- These appear in the "Ceremonies & Heritage" section

---

### 5. **Kenya Regions** (`Main → Kenya regions`)
**Backend Model:** `KenyaRegion`  
**API Endpoint:** `/api/main/regions/`  
**Frontend Pages Affected:**
- `/our-kenya` - Our Kenya page

**What it controls:**
- Region name (Nairobi, Mombasa, Nakuru, etc.)
- Description
- Featured image
- Key attractions
- Featured status

**How to use:**
- Add Kenya's major regions/counties
- Include descriptions of what makes each region unique
- Upload representative images
- Mark popular regions as `featured=True`

---

### 6. **Achievements** (`Main → Achievements`)
**Backend Model:** `Achievement`  
**API Endpoint:** `/api/main/achievements/`  
**Frontend Pages Affected:**
- `/global-stage` - Global Stage page

**What it controls:**
- Achievement title and description
- Achievement type (Sports, Tourism, Innovation, Arts, Diplomacy, etc.)
- Year
- Featured image
- Stats/metrics
- Featured status

**How to use:**
- Add Kenya's global achievements (Olympics, tech innovation, tourism, etc.)
- Categorize by type for filtering
- Include impressive statistics
- Mark major achievements as `featured=True`
- These showcase Kenya's global impact

---

### 7. **Partners** (`Main → Partners`)
**Backend Model:** `Partner`  
**API Endpoint:** `/api/main/partners/`  
**Frontend Pages Affected:**
- `/partnership` - Partnership & Sponsorship page
- `/ambassador` - Ambassador page (partner logos)

**What it controls:**
- Partner/sponsor name
- Logo image
- Description
- Partner type (Government, Corporate, NGO, International, etc.)
- Website URL
- Featured status

**How to use:**
- Add current sponsors and partners
- Upload high-quality logos (PNG with transparent background recommended)
- Mark active/major partners as `featured=True`
- Update regularly as partnerships change

---

### 8. **Social Media Posts** (`Main → Social media posts`)
**Backend Model:** `SocialMediaPost`  
**API Endpoint:** `/api/main/social-media/`  
**Frontend Pages Affected:**
- `/` (home page) - SocialFeed component (if implemented)
- Social media feed sections

**What it controls:**
- Post content/caption
- Platform (Instagram, Facebook, Twitter, YouTube, TikTok)
- Post URL
- Media URL (image/video)
- Posted date
- Engagement metrics
- Featured status

**How to use:**
- Manually add social media posts or import them
- Keep the feed fresh with recent posts
- Mark best posts as `featured=True`
- Link to actual social media posts

---

## 📸 GALLERY APP (`/api/gallery/`)

### 9. **Photo Collections** (`Gallery → Photo collections`)
**Backend Model:** `PhotoCollection`  
**API Endpoint:** `/api/gallery/collections/`  
**Frontend Pages Affected:**
- `/gallery` - Gallery page

**What it controls:**
- Collection name (e.g., "Cultural Festival 2024", "Ambassador's Journey")
- Description
- Cover image
- Featured status

**How to use:**
- Create albums/collections to organize photos
- Group photos by event, theme, or date
- Use descriptive names
- Mark important collections as `featured=True`

---

### 10. **Photos** (`Gallery → Photos`)
**Backend Model:** `Photo`  
**API Endpoint:** `/api/gallery/photos/`  
**Frontend Pages Affected:**
- `/gallery` - Gallery page (main photo grid)

**What it controls:**
- Photo title
- Description/caption
- Image file
- Category (Events, Portraits, Cultural, Behind the Scenes, etc.)
- Associated collection
- Photographer name
- Location/venue
- Date taken
- Featured status
- Published status

**How to use:**
- Upload high-quality photos from events, photoshoots, travels
- Add descriptive titles and captions
- Categorize properly for filtering
- Assign to collections for organization
- Mark best photos as `featured=True`
- Set `published=True` to make visible

---

### 11. **Videos** (`Gallery → Videos`)
**Backend Model:** `Video`  
**API Endpoint:** `/api/gallery/videos/`  
**Frontend Pages Affected:**
- `/gallery` - Gallery page (video section)

**What it controls:**
- Video title
- Description
- Video URL (YouTube/Vimeo embed)
- Thumbnail image
- Category
- Associated collection
- Duration
- View count
- Featured status
- Published status

**How to use:**
- Add YouTube/Vimeo video URLs
- Upload custom thumbnails for better visuals
- Categorize videos (Performances, Interviews, Behind the Scenes, etc.)
- Mark important videos as `featured=True`
- Set `published=True` to display

---

### 12. **Gallery Settings** (`Gallery → Gallery settings`)
**Backend Model:** `GallerySettings`  
**API Endpoint:** `/api/gallery/settings/`  
**Frontend Pages Affected:**
- `/gallery` - Gallery page configuration

**What it controls:**
- Gallery display settings
- Default view mode
- Items per page
- Enable/disable features

**How to use:**
- Configure global gallery settings
- Usually only one settings record needed
- Adjust display preferences

---

## 🎉 EVENTS APP (`/api/events/`)

### 13. **Events** (`Events → Events`)
**Backend Model:** `Event`  
**API Endpoint:** `/api/events/events/`  
**Frontend Pages Affected:**
- `/events` - Events page
- `/` (home page) - Upcoming event modal popup

**What it controls:**
- Event title and description
- Event type (Cultural Event, Workshop, Conference, Festival, etc.)
- Start/end date and time
- Venue name, address, city, country
- Capacity and pricing
- Featured image
- Organizer information
- Contact details (email, phone)
- Ticket categories
- Registration link
- Status (Upcoming, Ongoing, Completed, Cancelled)
- Featured status
- Published status
- Voting enabled

**How to use:**
- Add upcoming cultural events, festivals, conferences
- Set accurate dates and times
- Include complete venue information
- Set capacity and pricing
- Add multiple ticket categories if needed
- Mark major events as `featured=True`
- Set `published=True` to make visible
- Enable voting if applicable

**Special features:**
- Upcoming events: `/api/events/events/upcoming/`
- Past events: `/api/events/events/past/`
- Featured events: `/api/events/events/featured/`

---

### 14. **Event Inquiries** (`Events → Event inquiries`)
**Backend Model:** `EventInquiry`  
**API Endpoint:** `/api/events/inquiries/`  
**Frontend Pages Affected:**
- Contact forms on event pages (submissions)

**What it controls:**
- Inquiry submissions from website visitors
- Name, organization, email, phone
- Event title
- Inquiry type (General, Booking, Partnership, Media, Sponsorship)
- Message/details
- Preferred contact method
- Response status

**How to use:**
- View and manage inquiries from website visitors
- Respond to booking requests
- Track inquiry status (New, In Progress, Resolved, Closed)
- Filter by inquiry type
- Export for follow-up

---

### 15. **Event Categories** (`Events → Event categories`)
**Backend Model:** `EventCategory`  
**API Endpoint:** `/api/events/categories/`  
**Frontend Pages Affected:**
- `/events` - Events page (category filter)

**What it controls:**
- Category name
- Description
- Icon/image

**How to use:**
- Create event categories for filtering
- Examples: Cultural Festival, Workshop, Conference, Gala, Community Event
- Used for organizing and filtering events on frontend

---

### 16. **Event Settings** (`Events → Event settings`)
**Backend Model:** `EventSettings`  
**API Endpoint:** `/api/events/settings/`  
**Frontend Pages Affected:**
- `/events` - Events page configuration

**What it controls:**
- Global event settings
- Default configurations
- Feature toggles

**How to use:**
- Configure global event settings
- Usually only one settings record needed

---

## 🔐 DJANGO ADMIN DEFAULTS

### **Users** (`Authentication and Authorization → Users`)
- Manage admin users who can access Django admin
- Create staff accounts for content management
- Set permissions

### **Groups** (`Authentication and Authorization → Groups`)
- Create user groups with specific permissions
- Useful for team management (e.g., Content Editors, Event Managers)

---

## 📋 QUICK REFERENCE: WHAT AFFECTS WHICH PAGE

| Frontend Page | Admin Sections Used |
|--------------|-------------------|
| **Home (`/`)** | Events (upcoming), Blog Posts, Social Media Posts |
| **About (`/about`)** | *(Static content - no admin)* |
| **Ambassador (`/ambassador`)** | Ambassadors, Partners |
| **Blog (`/blog`)** | Blog Posts |
| **Events (`/events`)** | Events, Event Categories |
| **Gallery (`/gallery`)** | Photos, Videos, Photo Collections |
| **Our Culture (`/our-culture`)** | Cultural Heritage, Cultural Communities |
| **Our Kenya (`/our-kenya`)** | Kenya Regions |
| **Global Stage (`/global-stage`)** | Achievements |
| **Partnership (`/partnership`)** | Partners |
| **Contact (`/contact`)** | *(Static content - no admin)* |
| **FAQ (`/faq`)** | *(Static content - no admin)* |
| **Contribute (`/contribute`)** | *(Static content - no admin)* |
| **Voting (`/voting`)** | *(Static content - voting handled separately)* |

---

## 💡 BEST PRACTICES

1. **Always set `published=True`** for content you want visible on the website
2. **Use `featured=True`** to highlight important content (appears first or in special sections)
3. **Upload high-quality images** - compress them before upload for better performance
4. **Write descriptive titles and captions** - helps with SEO and user engagement
5. **Keep content fresh** - regularly update blog posts, events, and social media feed
6. **Test on frontend** after making changes to ensure content displays correctly
7. **Use categories consistently** for better filtering and organization
8. **Fill all fields** when possible for rich, complete content display

---

## 🚀 WORKFLOW TIPS

### Adding a New Event:
1. Go to `Events → Events`
2. Click "Add Event"
3. Fill in all details (title, description, dates, venue, pricing)
4. Upload featured image
5. Set `published=True` and `status=Upcoming`
6. Mark as `featured=True` if it's a major event
7. Save
8. Check `/events` page on frontend

### Publishing a Blog Post:
1. Go to `Main → Blog posts`
2. Click "Add blog post"
3. Write title, content, excerpt
4. Upload featured image
5. Set category
6. Set `published=True`
7. Save
8. Check `/blog` page on frontend

### Updating Ambassador Info:
1. Go to `Main → Ambassadors`
2. Edit the current ambassador record
3. Update bio, mission, or image as needed
4. Save
5. Check `/ambassador` page on frontend

---

**Need Help?** Check that the backend is running at `http://localhost:8000` and the frontend at `http://localhost:3000` for local development.
