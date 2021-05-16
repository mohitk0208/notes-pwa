// ALL IMPORT STATEMENTS AT THE TOP
import Note from "./Note.js";
import {
	addOrUpdateNote,
	deleteNote,
	getAllNotes,
	getFileByIndex,
	getNote,
	getTotalFiles,
} from "./indexedDb.js";

// ALL QUERY SELECTORS
const body = document.querySelector("body");
const appContainer = document.querySelector(".app-container");
const indicator = document.getElementById("save-indicator");
const notepad = document.getElementById("notepad");
const fileNameElement = document.getElementById("filename");
const addFileBtn = document.querySelector(".add-btn");
const filesContainer = document.querySelector(".files-container");
const backBtn = document.querySelector(".back-btn")

// if (navigator.serviceWorker) {
// 	window.addEventListener("load", () => {
// 		navigator.serviceWorker
// 			.register("./sw_cached_site.js")
// 			.then((reg) => console.log("Service Worker: Registered"))
// 			.catch((err) => console.error(`Service Worker: Error ${err}`));
// 	});
// }

// let note = new Note(fileNameElement.innerText, notepad.value);
let note = null;
let timeOut = null;

const SAVE_STATUS = {
	SAVING: "hsl(39, 100%, 50%)",
	SAVED: "hsl(120, 100%, 25%)",
};

// set the mode according to the system preference
SetDarkModeAndAddEventListener();

console.log(localStorage.getItem("currentFileId"));

const currentFileId = localStorage.getItem("currentFileId");

if (currentFileId) {
	getNote(currentFileId).then((n) => {
		console.log("this", n);

		if (n) return openNoteInEditor(n);

		createNewFileAndOpen();
	});
} else {
	createNewFileAndOpen();
}

// initialize the file list in left panel
function updateFileList() {
	getAllNotes().then((notes) => {
		const content = notes.reverse().map((n) => {
			if (n.id === note.id) return createHTMLFile(n, true);

			return createHTMLFile(n);
		});

		filesContainer.innerHTML = "";

		content.forEach((c) => {
			filesContainer.appendChild(c);
		});

		console.log(content);

		// filesContainer.innerHTML = "";
		// filesContainer.insertAdjacentHTML("afterbegin", content);
	});
}

updateFileList();

(async () => {
	let x = await getFileByIndex((await getTotalFiles()) - 1);
	console.log(x);
})();

// ALL EVENT LISTENERS HERE....

addFileBtn.addEventListener("click", (e) => {
	createNewFileAndOpen();
	updateFileList();
});

backBtn.addEventListener("click",() => {
	appContainer.classList.add("left")
})

fileNameElement.addEventListener("input", function (e) {
	note.name = fileNameElement.innerText;

	const fileElement = document.querySelector(`p[data-note-id="${note.id}"]`);

	fileElement.innerText = fileNameElement.innerText;

	console.log(fileElement);

	setIndicatorStatusColor(SAVE_STATUS.SAVING);
	clearTimeoutIfExistAndCallSaveFunctionWithTimeout();
});

notepad.addEventListener("input", () => {
	note.content = notepad.value;

	setIndicatorStatusColor(SAVE_STATUS.SAVING);
	clearTimeoutIfExistAndCallSaveFunctionWithTimeout();
});

function save() {
	addOrUpdateNote(note)
		.then(() => {
			timeOut = null;
			setIndicatorStatusColor(SAVE_STATUS.SAVED);
		})
		.catch((err) => {
			console.log(err);
		});
}

function createHTMLFile(localNote, selected = false) {
	// _____________div _____________________
	const div = document.createElement("div");
	div.classList.add("file");
	div.setAttribute("data-note-id", localNote.id);
	div.setAttribute("data-selected", selected);

	div.addEventListener("click", () => {
		console.log("clicked");

		if (appContainer.classList.contains("left"))
			appContainer.classList.remove("left");

		openNoteInEditor(localNote);
		updateFileList();
	});

	// ________________ p ___________________
	const p = document.createElement("p");
	p.innerText = localNote.name;
	p.setAttribute("data-note-id", localNote.id);

	// _______________button__________________
	const button = document.createElement("button");
	button.innerText = "DEL";
	button.classList.add(...["delete-btn", "remove-btn-style"]);
	button.setAttribute("data-note-id", localNote.id);

	button.addEventListener("click", async (e) => {
		e.stopPropagation(); // to prevent the event bubbling triggering event on th div

		// delete the file
		await deleteNote(localNote.id);

		const count = await getTotalFiles();
		console.log(count);
		console.log("local note", localNote.id);
		console.log("note", note.id);

		if (count === 0) createNewFileAndOpen();
		else if (localNote.id === note.id) {
			const firstNote = await getFileByIndex(count - 1);

			openNoteInEditor(firstNote);
		}

		updateFileList();
	});

	div.appendChild(p);
	div.appendChild(button);

	return div;
}

function createNewFileAndOpen() {
	setIndicatorStatusColor(SAVE_STATUS.SAVING);
	openNoteInEditor(new Note("untitled", ""));
	save();
}
/**
 *
 * @param {Note} n note object
 */
function openNoteInEditor(n) {
	console.log("global note", n.id);
	note = n; // set the global note object
	fileNameElement.innerText = n.name;
	notepad.value = n.content;
	localStorage.setItem("currentFileId", n.id);
}

function SetDarkModeAndAddEventListener() {
	if (
		window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches
	) {
		//dark mode
		console.info("DARK MODE ACTIVATED");
		body.classList.add("dark");
	}
	// listen for the mode change
	window
		.matchMedia("(prefers-color-scheme: dark)")
		.addEventListener("change", function (e) {
			if (e.matches) {
				console.info("ACTIVATED DARK MODE");
				return body.classList.add("dark");
			}
			console.info("ACTIVATED LIGHT MODE");
			return body.classList.remove("dark");
		});
}

function setIndicatorStatusColor(color) {
	indicator.style.backgroundColor = color;
}

function clearTimeoutIfExistAndCallSaveFunctionWithTimeout() {
	if (timeOut) clearTimeout(timeOut);

	timeOut = setTimeout(() => {
		save();
	}, 1000);
}
