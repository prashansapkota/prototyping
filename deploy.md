# Deployment Guide

## Quick Deploy Options

### 1. Vercel (Recommended - Easiest)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (run in project root)
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (choose your account)
# - Link to existing project? N  
# - Project name: qkd-vehicle-simulation
# - Directory: ./
# - Settings correct? Y
```

**Add Environment Variables in Vercel Dashboard:**
- Go to vercel.com → your project → Settings → Environment Variables
- Add: `VITE_GEMINI_API_KEY` = `your_api_key_here`
- Redeploy

**Your app will be live at:** `https://qkd-vehicle-simulation.vercel.app`

### 2. Netlify

```bash
# Build first
npm run build

# Option A: Drag & Drop
# Go to netlify.com → drag the 'dist' folder

# Option B: Netlify CLI
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

**Add Environment Variables in Netlify Dashboard:**
- Site settings → Environment variables
- Add: `VITE_GEMINI_API_KEY` = `your_api_key_here`

### 3. GitHub Pages (Free but static only)

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Build and deploy
npm run build
npm run deploy
```

### 4. Other Platforms

The built `dist` folder can be deployed to:
- AWS S3 + CloudFront
- Firebase Hosting
- Surge.sh
- Railway
- Render

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key and add it to your deployment environment variables

## Testing Your Deployment

1. Visit your deployed URL
2. Try running the QKD simulation
3. Toggle the eavesdropper option
4. Test the Gemini AI analysis (if API key is configured)

## Troubleshooting

**Build fails:**
```bash
# Check for TypeScript errors
npm run build

# Fix any errors and rebuild
```

**App loads but Three.js scene is black:**
- Check browser console for WebGL errors
- Ensure modern browser with WebGL support

**Gemini API not working:**
- Verify API key is set correctly
- Check browser network tab for API errors
- Ensure CORS is properly configured (Vercel/Netlify handle this automatically)
