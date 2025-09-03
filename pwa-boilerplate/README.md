# PWA Boilerplate - Complete Setup Guide

A production-ready Progressive Web App boilerplate with offline functionality, caching strategies, and installation prompts.

## 🚀 Quick Start

1. **Copy all files** to your web server root directory
2. **Create icons** (see Icons section below)
3. **Customize** the app name, colors, and content
4. **Test locally** using a local server (required for service workers)
5. **Deploy** to HTTPS (required for PWA features)

## 📁 File Structure

```
your-website/
├── index.html          # Main HTML with PWA setup
├── manifest.json       # PWA manifest configuration
├── service-worker.js   # Service worker with caching
├── offline.html        # Offline fallback page
├── styles.css          # Basic responsive styles
├── app.js             # Main application JavaScript
├── icons/             # App icons (create this folder)
│   ├── icon-16x16.png
│   ├── icon-32x32.png
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
└── screenshots/       # Optional screenshots folder
    ├── desktop.png
    └── mobile.png
```

## 🎨 Required Icons

Create these icon sizes and place them in `/icons/` folder:
- `icon-16x16.png` (16x16px)
- `icon-32x32.png` (32x32px) 
- `icon-72x72.png` (72x72px)
- `icon-96x96.png` (96x96px)
- `icon-128x128.png` (128x128px)
- `icon-144x144.png` (144x144px)
- `icon-152x152.png` (152x152px)
- `icon-192x192.png` (192x192px) - **Required**
- `icon-384x384.png` (384x384px)
- `icon-512x512.png` (512x512px) - **Required**

**Tip:** Use [PWA Icon Generator](https://www.pwabuilder.com/imageGenerator) to generate all sizes from one image.

## ⚙️ Customization

### 1. Update App Information
Edit `manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "YourApp",
  "description": "Your app description",
  "theme_color": "#your-color",
  "background_color": "#your-bg-color"
}
```

### 2. Update Cache Version
When deploying updates, change the cache version in `service-worker.js`:
```javascript
const CACHE_NAME = 'pwa-cache-v2'; // Increment version
const STATIC_CACHE_NAME = 'pwa-static-v2';
const DYNAMIC_CACHE_NAME = 'pwa-dynamic-v2';
```

### 3. Add Your Files to Cache
Update the `STATIC_ASSETS` array in `service-worker.js`:
```javascript
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/offline.html',
  '/your-other-files.js', // Add your files here
  // ... existing files
];
```

### 4. Customize Colors
Update CSS variables in `styles.css`:
```css
:root {
  --primary-color: #your-primary-color;
  --primary-dark: #your-dark-color;
  /* ... other colors */
}
```

## 🧪 Testing Locally

**Important:** Service workers require HTTPS or localhost.

### Option 1: Python Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Option 2: Node.js Server
```bash
npx serve .
```

### Option 3: PHP Server
```bash
php -S localhost:8000
```

Visit: `http://localhost:8000`

## ✅ Testing PWA Features

### Chrome DevTools
1. Open DevTools (F12)
2. Go to **Application** tab
3. Check **Service Workers** (should show registered)
4. Check **Storage** > **Cache Storage** (should show cached files)
5. Test offline mode: **Network** tab > Check "Offline"

### PWA Audit
1. Open DevTools **Lighthouse** tab
2. Select "Progressive Web App"
3. Click "Generate report"

### Install Testing
1. Visit your site in Chrome
2. Look for install prompt or address bar install icon
3. Install and test offline functionality

## 🚀 Deployment Requirements

### HTTPS Required
PWA features require HTTPS. Use:
- **Free SSL:** Let's Encrypt, Cloudflare
- **Hosting:** Netlify, Vercel, GitHub Pages
- **CDN:** CloudFront, Cloudflare

### Server Configuration
Ensure your server serves the correct MIME types:
```
.webmanifest → application/manifest+json
.js → application/javascript
```

## 🔧 Advanced Features

### Add Background Sync
```javascript
// In service-worker.js
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncData());
  }
});
```

### Add Push Notifications
```javascript
// Register for push in app.js
navigator.serviceWorker.ready.then((registration) => {
  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: 'your-vapid-key'
  });
});
```

### Add Web Share API
```javascript
if (navigator.share) {
  navigator.share({
    title: 'My PWA',
    text: 'Check out this awesome app!',
    url: window.location.href
  });
}
```

## 🐛 Troubleshooting

### Service Worker Not Registering
- Ensure HTTPS or localhost
- Check browser console for errors
- Verify `service-worker.js` path is correct

### Cache Not Working
- Check cache version numbers
- Clear browser cache and try again
- Verify files exist in STATIC_ASSETS array

### Install Prompt Not Showing
- Ensure manifest.json is properly linked
- Check all required manifest fields are present
- Verify icons exist and are correct format
- Test on mobile Chrome (desktop has stricter requirements)

### Offline Page Not Showing
- Ensure `/offline.html` is in STATIC_ASSETS
- Check service worker fetch handler
- Test by going offline in DevTools

## 📱 Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Service Workers | ✅ | ✅ | ✅ | ✅ |
| Web Manifest | ✅ | ✅ | ✅ | ✅ |
| Add to Home Screen | ✅ | ✅ | ✅ | ✅ |
| Background Sync | ✅ | ❌ | ❌ | ✅ |
| Push Notifications | ✅ | ✅ | ✅ | ✅ |

## 🎯 Best Practices

1. **Keep service worker updated** - Increment cache versions on changes
2. **Optimize images** - Use WebP format when possible
3. **Minimize cache size** - Only cache essential files
4. **Test offline scenarios** - Ensure app works without network
5. **Monitor performance** - Use Lighthouse for regular audits
6. **Update prompts** - Always notify users of available updates

## 📚 Additional Resources

- [PWA Builder](https://www.pwabuilder.com/)
- [Workbox](https://developers.google.com/web/tools/workbox) - Advanced PWA tooling
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google PWA Checklist](https://web.dev/pwa-checklist/)

---

**Ready to go!** Your PWA is now configured for offline functionality, installation, and automatic updates. Test thoroughly and deploy to HTTPS for full functionality.
