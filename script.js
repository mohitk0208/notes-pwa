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
const backBtn = document.querySelector(".back-btn");
const currentDeleteBtn = document.querySelector(".current-delete-btn");
const modeBtn = document.querySelector(".mode-btn")

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

// ________________________________________________________________________

// ALL EVENT LISTENERS HERE....

modeBtn.addEventListener("click",() => {
	body.classList.toggle("dark")

	if(body.classList.contains("dark")) modeBtn.innerText = "Dark"
	else modeBtn.innerText = "Light"
})

addFileBtn.addEventListener("click", (e) => {
	createNewFileAndOpen();
	updateFileList();
});

backBtn.addEventListener("click", () => {
	save();
	appContainer.classList.add("left");
});

fileNameElement.addEventListener("input", function (e) {
	note.name = fileNameElement.value;

	const fileElement = document.querySelector(`p[data-note-id="${note.id}"]`);

	fileElement.innerText = fileNameElement.value;

	console.log(fileElement);

	setIndicatorStatusColor(SAVE_STATUS.SAVING);
	clearTimeoutIfExistAndCallSaveFunctionWithTimeout();
});

notepad.addEventListener("input", () => {
	note.content = notepad.value;

	// _______________ AUTO GROW TEXTAREA HEIGHT___________
	notepad.style.height = "5px";
	notepad.style.height = notepad.scrollHeight + "px";
	// -------------------------------------------------------

	setIndicatorStatusColor(SAVE_STATUS.SAVING);
	clearTimeoutIfExistAndCallSaveFunctionWithTimeout();
});

currentDeleteBtn.addEventListener("click", async () => {
	await deleteAndUpdateEnvironment(note.id);
	appContainer.classList.add("left");
});

// __________________________________________________________________________________

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

	div.addEventListener("click", async () => {
		console.log("clicked");
		save();

		const updatedNote = await getNote(localNote.id);
		openNoteInEditor(updatedNote);
		checkAndRemoveClass(appContainer, "left");

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
		await deleteAndUpdateEnvironment(localNote.id);
	});

	div.appendChild(p);
	div.appendChild(button);

	return div;
}

async function deleteAndUpdateEnvironment(id) {
	await deleteNote(id);

	const count = await getTotalFiles();
	console.log(count);
	console.log("local note", id);
	console.log("note", note.id);

	if (count === 0) createNewFileAndOpen();
	else if (id === note.id) {
		const firstNote = await getFileByIndex(count - 1);

		openNoteInEditor(firstNote);
	}

	updateFileList();
}

function checkAndRemoveClass(element, className) {
	if (element.classList.contains(className))
		element.classList.remove(className);
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
	fileNameElement.value = n.name;
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
	} else {
		checkAndRemoveClass(body, "dark");
	}
	// listen for the mode change
	window
		.matchMedia("(prefers-color-scheme: dark)")
		.addEventListener("change", function (e) {
			if (e.matches) {
				console.info("ACTIVATED DARK MODE");
				body.classList.add("dark");
			} else {
				console.info("ACTIVATED LIGHT MODE");
				// body.classList.remove("dark");
				checkAndRemoveClass(body,"dark")
			}
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
