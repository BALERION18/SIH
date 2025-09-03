// Main App JavaScript
console.log('My PWA App loaded successfully!');

// App state management
const AppState = {
  isOnline: navigator.onLine,
  isInstalled: false,
  serviceWorkerReady: false
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  console.log('Initializing PWA...');
  
  // Setup event listeners
  setupNetworkListeners();
  setupServiceWorkerListeners();
  setupInstallListeners();
  
  // Initialize UI
  updateNetworkStatus();
  
  console.log('PWA initialized successfully!');
}

// Network status management
function setupNetworkListeners() {
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
}

function handleOnline() {
  console.log('App is now online');
  AppState.isOnline = true;
  updateNetworkStatus();
  
  // Sync any pending data when back online
  syncPendingData();
}

function handleOffline() {
  console.log('App is now offline');
  AppState.isOnline = false;
  updateNetworkStatus();
}

function updateNetworkStatus() {
  const statusElement = document.getElementById('online-status');
  if (statusElement) {
    statusElement.textContent = AppState.isOnline ? 'Online' : 'Offline';
    statusElement.className = AppState.isOnline ? 'online' : 'offline';
  }
}

// Service Worker management
function setupServiceWorkerListeners() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      console.log('Service Worker is ready');
      AppState.serviceWorkerReady = true;
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        console.log('Service Worker update found');
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Show update notification
              showUpdateAvailable();
            }
          });
        }
      });
    });
    
    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('Message from SW:', event.data);
      
      if (event.data && event.data.type === 'CACHE_UPDATED') {
        console.log('Cache was updated');
      }
    });
  }
}

function showUpdateAvailable() {
  if (confirm('A new version is available. Would you like to update now?')) {
    // Tell the service worker to skip waiting
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  }
}

// PWA Installation
function setupInstallListeners() {
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('Install prompt triggered');
    e.preventDefault();
    deferredPrompt = e;
    
    showInstallButton();
  });
  
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    AppState.isInstalled = true;
    hideInstallButton();
    
    // Track installation
    trackEvent('pwa_installed');
  });
  
  // Install button click handler
  const installBtn = document.getElementById('install-btn');
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User ${outcome} the install prompt`);
        
        if (outcome === 'accepted') {
          trackEvent('pwa_install_accepted');
        } else {
          trackEvent('pwa_install_dismissed');
        }
        
        deferredPrompt = null;
        hideInstallButton();
      }
    });
  }
}

function showInstallButton() {
  const installBtn = document.getElementById('install-btn');
  if (installBtn) {
    installBtn.style.display = 'block';
  }
}

function hideInstallButton() {
  const installBtn = document.getElementById('install-btn');
  if (installBtn) {
    installBtn.style.display = 'none';
  }
}

// Data synchronization
function syncPendingData() {
  // This is where you would sync any offline changes
  // when the app comes back online
  console.log('Syncing pending data...');
  
  // Example: sync form data, user actions, etc.
  const pendingData = getPendingData();
  
  if (pendingData.length > 0) {
    pendingData.forEach(async (data) => {
      try {
        await sendDataToServer(data);
        removePendingData(data.id);
        console.log('Synced data:', data.id);
      } catch (error) {
        console.error('Failed to sync data:', error);
      }
    });
  }
}

function getPendingData() {
  // Get data from localStorage or IndexedDB
  const stored = localStorage.getItem('pendingSync');
  return stored ? JSON.parse(stored) : [];
}

function addPendingData(data) {
  const pending = getPendingData();
  pending.push({
    id: Date.now(),
    data: data,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('pendingSync', JSON.stringify(pending));
}

function removePendingData(id) {
  const pending = getPendingData();
  const filtered = pending.filter(item => item.id !== id);
  localStorage.setItem('pendingSync', JSON.stringify(filtered));
}

async function sendDataToServer(data) {
  // Replace with your actual API endpoint
  const response = await fetch('/api/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Failed to send data to server');
  }
  
  return response.json();
}

// Analytics and tracking
function trackEvent(eventName, data = {}) {
  console.log('Track event:', eventName, data);
  
  // Add your analytics tracking here
  // Example: Google Analytics, Mixpanel, etc.
  
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'TRACK_EVENT',
      event: eventName,
      data: data
    });
  }
}

// Cache management utilities
function clearAppCache() {
  if ('caches' in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
  }
  
  // Also clear localStorage if needed
  localStorage.clear();
  
  console.log('App cache cleared');
}

// Utility functions
function showToast(message, type = 'info') {
  // Simple toast notification
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: type === 'error' ? '#f44336' : '#4caf50',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    zIndex: '9999',
    animation: 'slideUp 0.3s ease-out'
  });
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Export functions for use in other scripts
window.MyPWA = {
  AppState,
  trackEvent,
  clearAppCache,
  showToast,
  addPendingData,
  syncPendingData
};