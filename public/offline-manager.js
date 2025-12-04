// Offline Manager - Handles offline/online state and localStorage sync
class OfflineManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.offlineIndicator = null;
        this.init();
    }

    init() {
        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());

        // Check initial status
        if (!this.isOnline) {
            this.handleOffline();
        }

        // Create offline indicator
        this.createOfflineIndicator();

        // Sync user session from server to localStorage when online
        this.syncUserSession();
    }

    createOfflineIndicator() {
        // Create a fixed indicator at the top of the page
        this.offlineIndicator = document.createElement('div');
        this.offlineIndicator.id = 'offline-indicator';
        this.offlineIndicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
      color: white;
      padding: 12px 20px;
      text-align: center;
      z-index: 10000;
      display: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      animation: slideDown 0.3s ease-out;
    `;
        this.offlineIndicator.innerHTML = `
      <span style="margin-right: 8px;">📡</span>
      <strong>You are offline</strong> - Some features may be limited
    `;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
      @keyframes slideDown {
        from { transform: translateY(-100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
        document.head.appendChild(style);
        document.body.appendChild(this.offlineIndicator);
    }

    handleOffline() {
        this.isOnline = false;
        console.log('[OfflineManager] You are offline');

        // Show offline indicator
        if (this.offlineIndicator) {
            this.offlineIndicator.style.display = 'block';
        }

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('app-offline'));
    }

    handleOnline() {
        this.isOnline = true;
        console.log('[OfflineManager] You are back online');

        // Hide offline indicator
        if (this.offlineIndicator) {
            this.offlineIndicator.style.display = 'none';
        }

        // Re-sync user session
        this.syncUserSession();

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('app-online'));
    }

    // Sync user session from server to localStorage
    async syncUserSession() {
        if (!this.isOnline) return;

        try {
            const response = await fetch('/api/user-info');
            if (response.ok) {
                const userData = await response.json();
                localStorage.setItem('edugamehub_user', JSON.stringify(userData));
                console.log('[OfflineManager] User session synced to localStorage');
            } else {
                console.log('[OfflineManager] No active session on server');
            }
        } catch (error) {
            console.error('[OfflineManager] Failed to sync user session:', error);
        }
    }

    // Get user info (from localStorage if offline, from server if online)
    async getUserInfo() {
        if (this.isOnline) {
            try {
                const response = await fetch('/api/user-info');
                if (response.ok) {
                    const userData = await response.json();
                    localStorage.setItem('edugamehub_user', JSON.stringify(userData));
                    return userData;
                }
            } catch (error) {
                console.error('[OfflineManager] Failed to fetch user info:', error);
            }
        }

        // Fallback to localStorage
        const cachedUser = localStorage.getItem('edugamehub_user');
        return cachedUser ? JSON.parse(cachedUser) : null;
    }

    // Check if user is logged in (works offline)
    isLoggedIn() {
        const cachedUser = localStorage.getItem('edugamehub_user');
        return cachedUser !== null;
    }

    // Clear user session
    clearUserSession() {
        localStorage.removeItem('edugamehub_user');
    }

    // Check network status
    checkOnlineStatus() {
        return this.isOnline;
    }
}

// Initialize offline manager
const offlineManager = new OfflineManager();

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then((registration) => {
                console.log('[Service Worker] Registered successfully:', registration.scope);

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('[Service Worker] New version found, updating...');

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New service worker available
                            console.log('[Service Worker] New version ready');
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('[Service Worker] Registration failed:', error);
            });
    });
}
