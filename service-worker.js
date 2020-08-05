importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
    console.log("Workbox berhasil dimuat");

    // Precaching App Shell di Workbox
    workbox.precaching.precacheAndRoute([{
            url: "/",
            revision: "1"
        },
        {
            url: "/index.html",
            revision: "1"
        },
        {
            url: "/nav.html",
            revision: "1"
        },
        {
            url: "/pages/home.html",
            revision: "1"
        },
        {
            url: "/pages/standing.html",
            revision: "1"
        },
        {
            url: "/pages/favorite.html",
            revision: "1"
        },
        {
            url: "/pages/result.html",
            revision: "1"
        },
        {
            url: "/css/materialize.min.css",
            revision: "1"
        },
        {
            url: "/js/scripts.js",
            revision: "1"
        },
        {
            url: "/js/api.js",
            revision: "1"
        },
        {
            url: "/js/idb.js",
            revision: "1"
        },
        {
            url: "/js/db.js",
            revision: "1"
        },
        {
            url: "/js/materialize.min.js",
            revision: "1"
        },
        {
            url: "/images/detail-elclasico.jpg",
            revision: "1"
        },
        {
            url: "/images/header-background.jpg",
            revision: "1"
        },
        {
            url: "/images/header-elclasico.jpg",
            revision: "1"
        },
        {
            url: "/images/logo-liga.png",
            revision: "1"
        },
        {
            url: "/icon-liga512.png",
            revision: "1"
        },
        {
            url: "/icon-liga192.png",
            revision: "1"
        },
        {
            url: "/manifest.json",
            revision: "1"
        }
    ], {
        ignoreUrlParametersMatching: [/.*/]
    });

    // Routing workbox untuk menyimpan cache images
    workbox.routing.registerRoute(
        /\.(?:png|gif|jpg|jpeg|svg)$/,
        workbox.strategies.cacheFirst()
    );

    // Routing workbox untuk menyimpan cache dari data api.football-data.org
    workbox.routing.registerRoute(
        new RegExp("https://api.football-data.org/v2/"),
        workbox.strategies.staleWhileRevalidate({
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [200]
                }),
                new workbox.expiration.Plugin({
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                    maxEntries: 30
                })
            ]
        })
    );

    // Routing workbox untuk menyimpan cache dari data google fonts
    workbox.routing.registerRoute(
        /.*(?:googleapis|gstatic)\.com/,
        workbox.strategies.staleWhileRevalidate({
            cacheName: "google-fonts-stylesheets",
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.Plugin({
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                    maxEntries: 30,
                }),
            ],
        })
    );

    // Routing di workbox untuk menyimpan cache folder pages
    workbox.routing.registerRoute(
        new RegExp("/pages/"),
        workbox.strategies.staleWhileRevalidate()
    );

} else {
    console.log("Workbox gagal dimuat");
}

self.addEventListener('push', function (event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    var options = {
        body: body,
        icon: '/icon-liga192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});