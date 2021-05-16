// ALL IMPORT STATEMENTS AT THE TOP
import Note from "./Note.js";
import { addOrUpdateNote, getAllNotes, getNote } from "./indexedDb.js";

// ALL QUERY SELECTORS
const body = document.querySelector("body");
const indicator = document.getElementById("save-indicator");
const notepad = document.getElementById("notepad");
const fileNameElement = document.getElementById("filename");
const addFileBtn = document.querySelector(".add-btn");
const filesContainer = document.querySelector(".files-container");

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
		const content = notes
			.reverse()
			.map((n) => {
				return createHTMLFile(n);
			})
			
			content.forEach(c => {
				filesContainer.appendChild(c)
			})

		console.log(content);

		// filesContainer.innerHTML = "";
		// filesContainer.insertAdjacentHTML("afterbegin", content);
	});
}

updateFileList();

(async () => {
	let x = await getAllNotes();
	console.log(x);
})();

// ALL EVENT LISTENERS HERE....

addFileBtn.addEventListener("click", (e) => {
	createNewFileAndOpen();
	updateFileList();
});

fileNameElement.addEventListener("input", function (e) {
	note.name = fileNameElement.innerText;

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

function createHTMLFile(note) {
	const content = `
		<div class="file">
			<p>${note.name}</p>
			<button class="delete-btn remove-btn-style" data-note-id=${note.id} >
				DEL
			</button>
		</div>
		`;

	const div = document.createElement("div")
	div.classList.add("file")

	const p = document.createElement("p")
	p.innerText = note.name

	const button = document.createElement("button")
	button.innerText = "DEL"
	button.classList.add(...["delete-btn","remove-btn-style"])
	button.setAttribute("data-note-id",note.id)

	div.appendChild(p)
	div.appendChild(button)

	return div;
}

function createNewFileAndOpen() {
	setIndicatorStatusColor(SAVE_STATUS.SAVING);
	openNoteInEditor(new Note("something", ""));
	save();
}
/**
 *
 * @param {Note} n note object
 */
function openNoteInEditor(n) {
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
