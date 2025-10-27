# YouTube API Setup Instructions

## Get a New YouTube Data API v3 Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create/Select Project**
   - Create a new project or select existing one

3. **Enable YouTube Data API v3**
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "ENABLE"

4. **Create API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "CREATE CREDENTIALS" > "API Key"
   - Copy the generated key

5. **Configure Key (Important!)**
   - Click on your new API key to edit it
   - Under "API restrictions" select "Restrict key"
   - Choose "YouTube Data API v3" ONLY
   - Under "Application restrictions":
     - Choose "HTTP referrers (web sites)"
     - Add: http://localhost:*
     - Add: https://your-domain.com (if deploying)
   - Save

6. **Update .env file**
   - Replace the key in your .env file
   - Restart your development server

## Check Quota Usage
- Go to "APIs & Services" > "Quotas"
- Look for YouTube Data API v3
- Default quota is 10,000 units/day
- Each search costs ~100 units

## Test Your Key
Use this URL in browser (replace YOUR_KEY):
https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&key=YOUR_KEY&type=video&maxResults=1