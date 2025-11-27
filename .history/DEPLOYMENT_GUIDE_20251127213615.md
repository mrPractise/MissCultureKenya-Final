# Temporary Deployment Guide

This guide will help you deploy your application online temporarily for testing.

## 🚀 Quick Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended
- **Frontend**: Vercel (free, best for Next.js)
- **Backend**: Railway (free tier available)

### Option 2: Vercel (Frontend) + Render (Backend)
- **Frontend**: Vercel (free)
- **Backend**: Render (free tier available)

---

## 📦 Step 1: Prepare Backend for Deployment

### 1.1 Update Django Settings

The backend settings have been updated to support production. Make sure to:
- Set `DEBUG = False` in production
- Add your deployment URLs to `ALLOWED_HOSTS`
- Configure environment variables

### 1.2 Create Production Requirements

The `requirements.txt` is ready. For production, you may want to add:
- `gunicorn` (WSGI server)
- `whitenoise` (static files)

---

## 🌐 Step 2: Deploy Backend (Railway - Recommended)

### 2.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"

### 2.2 Deploy Backend
1. Click "Deploy from GitHub repo"
2. Select your repository
3. Set root directory to `backend`
4. Railway will auto-detect Python

### 2.3 Configure Environment Variables
In Railway dashboard, add these variables:
```
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=your-app.railway.app,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### 2.4 Add Build Commands
Railway will auto-detect, but you can set:
- **Build Command**: `pip install -r requirements.txt && python manage.py migrate`
- **Start Command**: `python manage.py runserver 0.0.0.0:$PORT` or use gunicorn

### 2.5 Get Backend URL
After deployment, Railway will give you a URL like: `https://your-app.railway.app`
Copy this URL - you'll need it for the frontend!

---

## 🎨 Step 3: Deploy Frontend (Vercel)

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New Project"

### 3.2 Deploy Frontend
1. Import your GitHub repository
2. Set root directory to `frontend`
3. Vercel will auto-detect Next.js

### 3.3 Configure Environment Variables
In Vercel dashboard, go to Settings → Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

### 3.4 Deploy
Click "Deploy" - Vercel will build and deploy automatically!

---

## 🔧 Alternative: Render (Backend)

### Render Setup Steps:
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name**: missculture-backend
   - **Root Directory**: backend
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt && python manage.py migrate`
   - **Start Command**: `gunicorn missculture.wsgi:application`
6. Add environment variables (same as Railway)
7. Deploy!

---

## ✅ Post-Deployment Checklist

1. ✅ Backend is accessible (test API endpoint)
2. ✅ Frontend environment variable points to backend
3. ✅ CORS is configured correctly
4. ✅ Database migrations are run
5. ✅ Static files are served (if needed)
6. ✅ Test the full application flow

---

## 🐛 Troubleshooting

### Backend Issues:
- **CORS errors**: Make sure `CORS_ALLOWED_ORIGINS` includes your frontend URL
- **Database errors**: Run migrations in the deployment platform
- **Static files**: Add `whitenoise` to serve static files

### Frontend Issues:
- **API connection**: Check `NEXT_PUBLIC_API_URL` environment variable
- **Build errors**: Check build logs in Vercel dashboard

---

## 📝 Quick Commands Reference

### Local Testing Before Deployment:
```bash
# Backend
cd backend
python manage.py collectstatic --noinput
python manage.py migrate

# Frontend
cd frontend
npm run build
npm start
```

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard
- **Render Dashboard**: https://dashboard.render.com

