// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
                console.log('✅ Service Worker registered:', registration.scope);

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New service worker available, show update notification
                            if (confirm('Nueva versión disponible. ¿Recargar para actualizar?')) {
                                window.location.reload();
                            }
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('❌ Service Worker registration failed:', error);
            });
    });
}

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('✅ Conectado a internet');
    document.body.classList.remove('offline');
    // Trigger background sync if available
    if ('sync' in navigator.serviceWorker.registration) {
        navigator.serviceWorker.ready.then((registration) => {
            registration.sync.register('sync-shifts');
            registration.sync.register('sync-tasks');
        });
    }
});

window.addEventListener('offline', () => {
    console.log('⚠️ Sin conexión a internet');
    document.body.classList.add('offline');
});

// PWA install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWA install prompt available');
    e.preventDefault();
    deferredPrompt = e;

    // Show custom install button (you can add this to your UI)
    window.showInstallPromotion = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('✅ PWA installed');
                }
                deferredPrompt = null;
            });
        }
    };
});

window.addEventListener('appinstalled', () => {
    console.log('✅ PWA installed successfully');
    deferredPrompt = null;
});
