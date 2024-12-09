// First, ensure we have the correct type definitions
declare global {
  // Extend the Navigator interface correctly
  interface NavigatorServiceWorker {
    readonly serviceWorker: ServiceWorkerContainer;
  }
}

let registration: ServiceWorkerRegistration | null = null;

export async function registerServiceWorker() {
  try {
    if (registration) {
      console.log('Service Worker already registered');
      return registration;
    }

    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker not supported');
    }

    console.log('Registering service worker...', {
      timestamp: new Date().toISOString(),
      caller: new Error().stack,
    });

    registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      type: 'module',
    });

    registration.addEventListener('statechange', () => {
      console.log('SW state:', registration?.active?.state);
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    throw error;
  }
}
