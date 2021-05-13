const cachesName = "notesCaches_v1";
const appShellfiles = [
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
    
    
    e.waitUntil((async () => {
        const cache = await caches.open(cachesName);
        
        await cache.addAll(appShellfiles)
    })())

});

self.addEventListener("activate", (e) => {
	

	//remove unwanted cache
	e.waitUntil(
		caches.keys().then((cachesNames) => {
			return Promise.all(
				cachesNames.map((cache) => {
					if (cache !== cachesName) {
						
						return caches.delete(cache);
					}
				})
			);
		})
	);
});

self.addEventListener("fetch", (e) => {
	

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
			

			if (r) return r;

			const res = await fetch(e.request);
			const cache = await caches.open(cachesName);
			
			cache.put(e.request, res.clone());
			return res;
		})()
	);
});
