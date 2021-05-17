export async function addOrUpdateNote(note) {
	let db = await idb.openDB("NotesDb", 1, {
		upgrade(db, oldVersion, newVersion, transaction) {
			let objStore = db.createObjectStore("notes", { keyPath: "id" });
		},
	});

	let tx = db.transaction("notes", "readwrite");
	let store = tx.objectStore("notes");

	await store.put(note);

	await tx.done;
	db.close();
}

export async function getNote(noteId) {
	let db = await idb.openDB("NotesDb", 1, {
		upgrade(db, oldVersion, newVersion, transaction) {
			let objStore = db.createObjectStore("notes", { keyPath: "id" });
		},
	});

	let tx = db.transaction("notes");
	let store = tx.objectStore("notes");

	let note = await store.get(noteId);

	await tx.done;
	db.close();

	return note;
}

export async function getAllNotes() {
	let db = await idb.openDB("NotesDb", 1, {
		upgrade(db, oldVersion, newVersion, transaction) {
			let objStore = db.createObjectStore("notes", { keyPath: "id" });
		},
	});

	let tx = db.transaction("notes");
	let store = tx.objectStore("notes");

	let notes = await store.getAll();

	await tx.done;
	db.close();

	return notes;
}

export async function deleteNote(noteId) {
	let db = await idb.openDB("NotesDb", 1, {
		upgrade(db, oldVersion, newVersion, transaction) {
			let objStore = db.createObjectStore("notes", { keyPath: "id" });
		},
	});

	let tx = db.transaction("notes", "readwrite");
	let store = tx.objectStore("notes");

	await store.delete(noteId);

	await tx.done;
	db.close();

	return;
}

export async function getTotalFiles() {
	let db = await idb.openDB("NotesDb", 1, {
		upgrade(db, oldVersion, newVersion, transaction) {
			let objStore = db.createObjectStore("notes", { keyPath: "id" });
		},
	});

	// let tx = db.transaction("notes");
	// let store = tx.objectStore("notes");

	const count = await db.count("notes");

	db.close();

	return count;
}

export async function getFileByIndex(index) {
	let db = await idb.openDB("NotesDb", 1, {
		upgrade(db, oldVersion, newVersion, transaction) {
			let objStore = db.createObjectStore("notes", { keyPath: "id" });
		},
	});

	let cursor = await db.transaction("notes").store.openCursor();

	if (index) cursor = await cursor.advance(index);

	db.close();

	return cursor.value;
}