import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  plugins: [
    VitePWA({
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'images/*.jpg'],
      strategies: "generateSW",
      registerType: "autoUpdate",
      workbox: {
        cleanupOutdatedCaches: true,
        sourcemap: true,
        runtimeCaching: [
          {
            urlPattern: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&family=Fira+Sans:wght@400;700&display=swap",
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: "https://fonts.gstatic.com/s/firasans/v11/va9E4kDNxMZdWfMOD5Vvl4jL.woff2",
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: "https://fonts.gstatic.com/s/firacode/v10/uU9NCBsR6Z2vfE9aq3bh3dSD.woff2",
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: "https://fonts.gstatic.com/s/materialiconsround/v58/LDItaoyNOAY6Uewc665JcIzCKsKc_M9flwmP.woff2",
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: "https://fonts.googleapis.com/icon?family=Material+Icons+Round",
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
        ]
      },
      manifest: {
        short_name: "Notes",
        name: "Notes-PWA",
        description: "A Simple and light weight note making PWA",
        icons: [
          {
            src: "./images/icon-64.png",
            type: "image/png",
            sizes: "64x64",
            purpose: "any maskable"
          },
          {
            src: "./images/icon-120.png",
            type: "image/png",
            sizes: "120x120",
            purpose: "any maskable"
          },
          {
            src: "./images/icon-144.png",
            type: "image/png",
            sizes: "144x144",
            purpose: "any maskable"
          },
          {
            src: "./images/icon-152.png",
            type: "image/png",
            sizes: "152x152",
            purpose: "any maskable"
          },
          {
            src: "./images/icon-192.png",
            type: "image/png",
            sizes: "192x192"
          },
          {
            src: "./images/icon-384.png",
            type: "image/png",
            sizes: "384x384",
            purpose: "any maskable"
          },
          {
            src: "./images/icon-512.png",
            type: "image/png",
            sizes: "512x512",
            purpose: "any maskable"
          }
        ],
        start_url: "./?source=pwa",
        background_color: "#FFE680",
        display: "standalone",
        scope: "./",
        theme_color: "#FFA500",
        screenshots: [
          {
            src: "./images/Screenshot1.jpg",
            type: "image/jpg",
            sizes: "1920x1080"
          },
          {
            src: "./images/Screenshot2.jpg",
            type: "image/jpg",
            sizes: "1920x1080"
          }
        ]
      }
    })
  ]
})
