import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Enhanced service worker registration with better error handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
        
        // Check for updates every 30 seconds when app is active
        setInterval(() => {
          registration.update();
        }, 30000);
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Show update available notification
                if (confirm('New version available. Reload to update?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Add offline/online event listeners
window.addEventListener('online', () => {
  document.body.classList.remove('offline');
  console.log('App is now online');
});

window.addEventListener('offline', () => {
  document.body.classList.add('offline');
  console.log('App is now offline');
});

createRoot(document.getElementById("root")).render(<App />);