const cachesName = "notesCaches_v2";
const appShellfiles = [
	"/",
	"/index.html",
	"/indexedDb.js",
	"/Note.js",
	"/style.css",
	"/script.js",
	
	"https://fonts.googleapis.com/icon?family=Material+Icons+Round",
	"https://fonts.gstatic.com/s/materialiconsround/v58/LDItaoyNOAY6Uewc665JcIzCKsKc_M9flwmP.woff2",

	"https://fonts.gstatic.com/s/itim/v5/0nknC9ziJOYe8ANAkA.woff2",
	"https://fonts.googleapis.com/css2?family=Itim&display=swap",
	
	"https://unpkg.com/idb/build/iife/index-min.js",
	"/manifest.webmanifest",
];

self.addEventListener("install", (e) => {
	console.log("Service Worker: Installed");

	e.waitUntil(
		(async () => {
			const cache = await caches.open(cachesName);
			console.log("Service Worker: Caching all, app shell");
			await cache.addAll(appShellfiles);
			console.log("Service Worker: Cached all, app shell");
			self.skipWaiting()
		})()
	);
});

self.addEventListener("activate", (e) => {
	console.log("Service Worker: Activated");

	//remove unwanted cache
	e.waitUntil(
		caches.keys().then((cachesNames) => {
			return Promise.all(
				cachesNames.map((cache) => {
					if (cache !== cachesName) {
						console.log("Service Worker: Deleting old cache");
						return caches.delete(cache);
					}
				})
			);
		})
	);
});

self.addEventListener("fetch", (e) => {
	console.log("Service Worker: Fetching");

	e.respondWith(
		(async () => {
			const r = await caches.match(e.request);
			console.log(`[Service Worker] Fetching resource: ${e.request.url}`);

			if (r) return r;

			const res = await fetch(e.request);
			const cache = await caches.open(cachesName);
			console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
			cache.put(e.request, res.clone());
			return res;
		})()
	);
});
