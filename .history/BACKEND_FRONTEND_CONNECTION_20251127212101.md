# Backend-Frontend Connection Setup

## ✅ What Has Been Configured

### 1. Backend Configuration
- ✅ CORS is configured to allow requests from `http://localhost:3000`
- ✅ Django REST Framework is set up with proper endpoints
- ✅ All migrations have been applied
- ✅ API endpoints are available at:
  - `/api/main/` - Main app endpoints (blog, ambassador, communities, etc.)
  - `/api/gallery/` - Gallery endpoints (photos, videos, collections)
  - `/api/events/` - Events endpoints (events, inquiries, categories)

### 2. Frontend Configuration
- ✅ API client created at `frontend/src/lib/api.ts`
- ✅ BlogFeed component updated to fetch data from backend
- ✅ API test page created at `/api-test` to verify connection

## 🧪 Testing the Connection

### Step 1: Start the Backend Server
```bash
cd backend
python manage.py runserver
```
The backend should be running at `http://localhost:8000`

### Step 2: Start the Frontend Server
```bash
cd frontend
npm run dev
```
The frontend should be running at `http://localhost:3000`

### Step 3: Test the Connection
1. Visit `http://localhost:3000/api-test` in your browser
2. The page will automatically test all API endpoints
3. You should see:
   - ✅ Green checkmarks if the connection works
   - ❌ Red errors if the backend is not running or there's a CORS issue

### Step 4: Add Test Data (Optional)
To see actual data, add some test data in Django admin:
1. Go to `http://localhost:8000/admin/`
2. Create a superuser if needed: `python manage.py createsuperuser`
3. Add some blog posts, events, or photos

## 📝 API Endpoints Available

### Main App (`/api/main/`)
- `GET /api/main/blog/` - Get blog posts
- `GET /api/main/ambassador/` - Get ambassador info
- `GET /api/main/communities/` - Get cultural communities
- `GET /api/main/heritage/` - Get cultural heritage items
- `GET /api/main/regions/` - Get Kenya regions
- `GET /api/main/achievements/` - Get achievements
- `GET /api/main/partners/` - Get partners
- `GET /api/main/social-media/` - Get social media posts

### Gallery App (`/api/gallery/`)
- `GET /api/gallery/photos/` - Get photos
- `GET /api/gallery/videos/` - Get videos
- `GET /api/gallery/collections/` - Get photo collections

### Events App (`/api/events/`)
- `GET /api/events/events/` - Get all events
- `GET /api/events/events/upcoming/` - Get upcoming events
- `GET /api/events/events/past/` - Get past events
- `GET /api/events/events/featured/` - Get featured events
- `POST /api/events/inquiries/` - Create event inquiry

## 🔧 Troubleshooting

### Issue: CORS Error
**Solution**: Make sure `corsheaders` is in `INSTALLED_APPS` and `CorsMiddleware` is in `MIDDLEWARE` (already configured)

### Issue: 404 Not Found
**Solution**: 
- Check that the backend server is running
- Verify the API endpoint URL is correct
- Check Django URL routing in `backend/missculture/urls.py`

### Issue: No Data Showing
**Solution**: 
- Add test data in Django admin
- Check that models have `published=True` for published items
- Verify the API response in browser DevTools Network tab

## 📦 Next Steps

1. **Update More Components**: Update other components (Events, Gallery) to use the API
2. **Add Error Handling**: Implement better error handling and loading states
3. **Add Environment Variables**: Create `.env.local` for API URL configuration
4. **Implement Data Posting**: Add forms to create new data (event inquiries, contact forms, etc.)

## 🎯 Current Status

- ✅ Backend API is set up and running
- ✅ Frontend API client is created
- ✅ BlogFeed component fetches from API
- ✅ API test page available at `/api-test`
- ⏳ Other components still use hardcoded data (can be updated as needed)

