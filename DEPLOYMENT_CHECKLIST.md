# ✅ Deployment Checklist

## Before Deployment

### Backend Preparation
- [x] `requirements.txt` updated with production dependencies
- [x] `Procfile` created for deployment
- [x] `runtime.txt` created (Python version)
- [x] Settings updated to use environment variables
- [x] WhiteNoise added for static files
- [x] CORS configured for environment variables

### Frontend Preparation
- [x] `vercel.json` created
- [x] API client uses environment variables
- [x] Build command configured

---

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Deploy Backend (Railway)
- [ ] Sign up at https://railway.app
- [ ] Create new project from GitHub
- [ ] Set root directory to `backend`
- [ ] Add environment variables:
  - `DEBUG=False`
  - `SECRET_KEY=<generated-key>`
  - `ALLOWED_HOSTS=*.railway.app,localhost,127.0.0.1`
- [ ] Copy backend URL

### 3. Deploy Frontend (Vercel)
- [ ] Sign up at https://vercel.com
- [ ] Import GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Add environment variable:
  - `NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api`
- [ ] Deploy

### 4. Update CORS
- [ ] Go back to Railway
- [ ] Add environment variable:
  - `CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app`
- [ ] Redeploy backend

---

## Testing After Deployment

- [ ] Backend API accessible: `https://your-backend.railway.app/api/main/blog/`
- [ ] Frontend loads: `https://your-frontend.vercel.app`
- [ ] Frontend can fetch data from backend
- [ ] No CORS errors in browser console
- [ ] All pages load correctly

---

## Quick Links

- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Generate Secret Key**: Run `python backend/generate_secret_key.py`



