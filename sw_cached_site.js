const cachesName = "notesCaches_v1";
const appShellfiles = [
    "/notes-pwa/",
    "/notes-pwa/index.html",
    "/notes-pwa/indexedDb.js",
    "/notes-pwa/Note.js",
    "/notes-pwa/style.css",
    "/notes-pwa/script.js",
    "/notes-pwa/",
    "https://fonts.gstatic.com/s/itim/v5/0nknC9ziJOYe8ANAkA.woff2",
    "/notes-pwa/manifest.webmanifest"
]

self.addEventListener("install", (e) => {
    console.log("Service Worker: Installed");
    
    e.waitUntil((async () => {
        const cache = await caches.open(cachesName);
        console.log("Service Worker: Caching all, app shell");
        await cache.addAll(appShellfiles)
    })())

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
		// caches
		// 	.match(e.request)
		// 	.then((res) => res)
		// 	.catch((err) =>
		// 		fetch(e.request).then((res) => {
		// 			const resClone = res.clone();

		// 			caches.open(cacheName).then((cache) => {
		// 				cache.put(e.request, resClone);
		// 			});
		// 		})
		// 	)
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