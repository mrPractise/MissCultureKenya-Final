# 🚀 Quick Deployment Guide - Step by Step

## Prerequisites
- GitHub account
- Code pushed to GitHub repository

---

## 📦 Part 1: Deploy Backend (Railway - 5 minutes)

### Step 1: Sign up for Railway
1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign up with GitHub

### Step 2: Deploy Backend
1. Click "Deploy from GitHub repo"
2. Select your repository: `MissCultureNextJs`
3. Railway will detect it's a Python project
4. **IMPORTANT**: Set the **Root Directory** to `backend`
   - Click on the service → Settings → Root Directory → Set to `backend`

### Step 3: Configure Environment Variables
In Railway dashboard, go to **Variables** tab and add:

```
DEBUG=False
SECRET_KEY=your-random-secret-key-here-make-it-long-and-random
ALLOWED_HOSTS=*.railway.app,localhost,127.0.0.1
```

**To generate a secret key**, run this in terminal:
```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

### Step 4: Get Your Backend URL
1. After deployment, Railway will show a URL like: `https://your-app-name.railway.app`
2. **Copy this URL** - you'll need it for the frontend!

### Step 5: Update CORS (After Frontend is Deployed)
Once you have your frontend URL, add it to Railway environment variables:
```
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

---

## 🎨 Part 2: Deploy Frontend (Vercel - 5 minutes)

### Step 1: Sign up for Vercel
1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub

### Step 2: Deploy Frontend
1. Click "Add New Project"
2. Import your GitHub repository: `MissCultureNextJs`
3. **IMPORTANT**: Set the **Root Directory** to `frontend`
   - In project settings → Root Directory → Set to `frontend`
4. Vercel will auto-detect Next.js

### Step 3: Add Environment Variable
Before deploying, go to **Environment Variables** and add:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
```

Replace `your-backend-url.railway.app` with your actual Railway backend URL from Part 1.

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Vercel will give you a URL like: `https://your-app.vercel.app`

### Step 5: Update Backend CORS
Go back to Railway and update the CORS environment variable:
```
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
```

Railway will automatically redeploy with the new CORS settings.

---

## ✅ Part 3: Test Your Deployment

1. Visit your Vercel frontend URL
2. Check browser console for any errors
3. Test API connection by visiting: `https://your-backend.railway.app/api/main/blog/`
4. If you see JSON data, the backend is working!

---

## 🔧 Troubleshooting

### Backend not accessible?
- Check Railway logs: Railway Dashboard → Your Service → Logs
- Make sure `ALLOWED_HOSTS` includes `*.railway.app`

### Frontend can't connect to backend?
- Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
- Make sure it's exactly: `https://your-backend.railway.app/api` (with `/api` at the end)
- Check browser console for CORS errors

### CORS errors?
- Make sure `CORS_ALLOWED_ORIGINS` in Railway includes your Vercel URL
- Format: `https://your-app.vercel.app` (no trailing slash)

### Database issues?
- Railway uses SQLite by default (good for testing)
- For production, you might want to add PostgreSQL

---

## 📝 Quick Commands (if needed)

### Generate Secret Key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

### Test Backend Locally:
```bash
cd backend
python manage.py runserver
```

### Test Frontend Locally:
```bash
cd frontend
npm run dev
```

---

## 🎉 You're Done!

Your app should now be live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.railway.app/api`

Both services offer free tiers perfect for testing!


