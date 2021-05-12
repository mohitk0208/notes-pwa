import Note from "./Note.js";

const body = document.querySelector("body");
const indicator = document.getElementById("save-indicator");
const notepad = document.getElementById("notepad");
const fileNameElement = document.getElementById("filename");

let note = new Note(fileNameElement.innerText, notepad.value);
let timeOut = null;

const COLORS = {
	ORANGE: "hsl(39, 100%, 50%)",
	GREEN: "hsl(120, 100%, 25%)",
};

// set the mode according to the system preference
SetDarkModeAndAddEventListener();

fileNameElement.addEventListener("input", function (e) {
	note.setName(fileNameElement.innerText);

	setIndicatorToSaving();
	clearTimeoutIfExistAndCallSaveFunctionWithTimeout();
});

notepad.addEventListener("input", () => {
    note.setContent(notepad.value);
    setIndicatorToSaving()
	clearTimeoutIfExistAndCallSaveFunctionWithTimeout();
});




function save() {

	console.log(note);
	timeOut = null;

	setindicatorToSaved();
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
