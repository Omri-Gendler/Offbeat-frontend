# YouTube API Configuration for Production (Render.com)

## Fix YouTube API Key for Production Deployment

### 1. Update API Key Restrictions in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Click on your YouTube API key to edit it

### 2. Configure Application Restrictions

**Current Problem**: Your API key is likely restricted to `localhost` only

**Solution**: Update HTTP referrers to include your Render domain:

```
Application restrictions: HTTP referrers (web sites)

Allowed referrers:
- http://localhost:*/*
- https://localhost:*/*
- https://your-app-name.onrender.com/*
- https://*.onrender.com/*
```

**Replace `your-app-name` with your actual Render app name**

### 3. API Restrictions
Make sure only these APIs are enabled:
- YouTube Data API v3

### 4. Test Your Configuration

After updating, test with:
```
https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&key=YOUR_API_KEY&type=video&maxResults=1
```

## Environment Variables on Render

1. Go to your Render dashboard
2. Select your service
3. Go to "Environment" tab
4. Add these variables:

```
VITE_YOUTUBE_API_KEY = AIzaSyCXADIPq03jMwdp-917sLcary9kX4VojBQ
VITE_SPOTIFY_API_KEY = 2134594e2b14492f8bb393661edf8d7c
VITE_SPOTIFY_API_KEY_SECRET = 89559a7c86c14556ad23aa5892387e29
```

## Common Issues & Solutions

### Issue 1: 403 Forbidden
- API key not configured for your domain
- Update HTTP referrer restrictions

### Issue 2: API key not found
- Environment variables not set on Render
- Variable names must start with VITE_ for Vite apps

### Issue 3: CORS Errors
- Use HTTPS URLs in production
- Update API key restrictions to allow your domain

### Issue 4: Quota Exceeded
- Check API usage in Google Cloud Console
- Default quota: 10,000 units/day
- Each search costs ~100 units