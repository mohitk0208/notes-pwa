import Note from "./Note.js";
import { addOrUpdateNote, getNote } from "./indexedDb.js";

const body = document.querySelector("body");
const indicator = document.getElementById("save-indicator");
const notepad = document.getElementById("notepad");
const fileNameElement = document.getElementById("filename");

// let note = new Note(fileNameElement.innerText, notepad.value);
let note = null;
let timeOut = null;

const COLORS = {
	ORANGE: "hsl(39, 100%, 50%)",
	GREEN: "hsl(120, 100%, 25%)",
};

console.log(localStorage.getItem("currentFileId"));

const currentFileId = localStorage.getItem("currentFileId");

if (currentFileId) {
	getNote(currentFileId).then((n) => {
        console.log("this",n);
		if (n) {
			note = n;
			fileNameElement.innerText = n.name;
			notepad.value = n.content;
		} else {
			fileNameElement.innerText = "something";
			note = new Note(fileNameElement.innerText, notepad.innerText);
			setIndicatorToSaving();
			save();
			setindicatorToSaved();
			localStorage.setItem("currentFileId", note.id);
		}
	});
} else {
	fileNameElement.innerText = "something";
	note = new Note(fileNameElement.innerText, notepad.innerText);
	setIndicatorToSaving();
	save();
	setindicatorToSaved();
	localStorage.setItem("currentFileId", note.id);
}

(async () => {
	let x = await getNote(currentFileId || "");
	console.log(x);
})();

// set the mode according to the system preference
SetDarkModeAndAddEventListener();

fileNameElement.addEventListener("input", function (e) {
	note.name = fileNameElement.innerText;

	setIndicatorToSaving();
	clearTimeoutIfExistAndCallSaveFunctionWithTimeout();
});

notepad.addEventListener("input", () => {
	note.content = notepad.value;

	setIndicatorToSaving();
	clearTimeoutIfExistAndCallSaveFunctionWithTimeout();
});

function save() {
	addOrUpdateNote(note)
		.then(() => {
			timeOut = null;
			setindicatorToSaved();
		})
		.catch((err) => {
			console.log(err);
		});
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

function setIndicatorToSaving() {
	indicator.style.backgroundColor = COLORS.ORANGE;
}

function setindicatorToSaved() {
	indicator.style.backgroundColor = COLORS.GREEN;
}

function clearTimeoutIfExistAndCallSaveFunctionWithTimeout() {
	if (timeOut) clearTimeout(timeOut);

	timeOut = setTimeout(() => {
		save();
	}, 1000);
}
