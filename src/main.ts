import "./style.css"
import Note from "./Note.js";
import { getNote, getAllNotes, getFileByIndex, getTotalFiles, deleteNote, addOrUpdateNote } from "./indexedDb"

// ALL QUERY SELECTORS
const body = document.querySelector<HTMLBodyElement>("body")!;
const appContainer = document.querySelector<HTMLDivElement>(".app-container")!;

const indicator = document.getElementById("save-indicator") as HTMLDivElement;
const notepad = document.getElementById("notepad") as HTMLTextAreaElement;
const fileNameElement = document.getElementById("filename") as HTMLInputElement;
const addFileBtn = document.querySelector(".add-btn") as HTMLButtonElement;
const filesContainer = document.querySelector(".files-container") as HTMLDivElement;
const backBtn = document.querySelector(".back-btn") as HTMLButtonElement;
const currentDeleteBtn = document.querySelector(".current-delete-btn") as HTMLButtonElement;
const modeBtn = document.querySelector(".mode-btn") as HTMLButtonElement;
const searchElement = document.getElementById("search") as HTMLInputElement;
const monospaceMode = document.getElementById("font-mode") as HTMLInputElement;
const importBtn = document.querySelector(".import-btn") as HTMLButtonElement;
const exportBtn = document.querySelector(".export-btn") as HTMLButtonElement;
const importFile = document.getElementById("import-file") as HTMLInputElement;


// set the mode according to the system preference
SetDarkModeAndAddEventListener();

if (navigator.serviceWorker) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw_cached_site.js")
      .then((reg) => console.log(`Service Worker: Registered,  Scope is ${reg.scope}`))
      .catch((err) => console.error(`Service Worker: Error ${err}`));
  });
}

// let note = new Note(fileNameElement.innerText, notepad.value);
let note: Note | null = null;
let timeOut: number | null = null;
let searchTimeOut: number | null = null;

const SAVE_STATUS = {
  SAVING: "hsl(39, 100%, 50%)",
  SAVED: "hsl(120, 100%, 25%)",
} as const;

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
  searchTimeOut = null;

  getAllNotes().then((allNotes) => {
    const query = searchElement.value.toLowerCase();

    const content = allNotes
      .filter((n) => {
        if (query === "") return true;

        return new RegExp(query).test(n.name.toLowerCase());
      })
      .reverse()
      .map((n) => {
        if (n.id === note?.id) return createHTMLFile(n, true);

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

if (monospaceMode.checked) {
  notepad.style.fontFamily = "'Fira Code', monospace";
} else {
  notepad.style.fontFamily = "'Fira Sans', sans-serif";
}

(async () => {
  let x = await getFileByIndex((await getTotalFiles()) - 1);
  console.log(x);
})();

// ________________________________________________________________________

// ALL EVENT LISTENERS HERE....
monospaceMode.addEventListener("change", () => {
  if (monospaceMode.checked)
    notepad.style.fontFamily = "'Fira Code', monospace";
  else {
    notepad.style.fontFamily = "'Fira Sans', sans-serif";
  }
});

searchElement.addEventListener("input", (e) => {
  if (searchTimeOut) clearTimeout(searchTimeOut);

  searchTimeOut = setTimeout(() => {
    updateFileList();
  }, 50);
});

modeBtn.addEventListener("click", () => {
  body.classList.toggle("dark");

  if (body.classList.contains("dark"))
    modeBtn.innerHTML = '<span class="material-icons-round">dark_mode</span>';
  else
    modeBtn.innerHTML = '<span class="material-icons-round">light_mode</span>';
});

addFileBtn.addEventListener("click", (e) => {
  createNewFileAndOpen();
  updateFileList();
});

backBtn.addEventListener("click", () => {
  save();
  appContainer.classList.add("left");
});

fileNameElement.addEventListener("input", function (e) {
  if (note) {
    note.name = fileNameElement.value;
  }

  const fileElement = document.querySelector(`p[data-note-id="${note?.id}"]`)!;

  fileElement.innerHTML = `<span class="material-icons-round">description</span> ${fileNameElement.value}`;

  console.log(fileElement);

  setIndicatorStatusColor("SAVING");
  clearTimeoutIfExistAndCallSaveFunctionWithTimeout();
});

notepad.addEventListener("keydown", (e) => {
  console.log(e.key);

  if (e.key == "Tab") {
    e.preventDefault();
    var start = notepad.selectionStart;
    var end = notepad.selectionEnd;

    // set textarea value to: text before caret + tab + text after caret
    notepad.value =
      notepad.value.substring(0, start) + "\t" + notepad.value.substring(end);

    // put caret at right position again
    notepad.selectionStart = notepad.selectionEnd = start + 1;
  }
});

notepad.addEventListener("input", (e) => {
  if (note) {
    note.content = notepad.value;
  }

  // _______________ AUTO GROW TEXTAREA HEIGHT___________
  // notepad.style.height = "5px";
  // notepad.style.height = notepad.scrollHeight + "px";
  // -------------------------------------------------------

  setIndicatorStatusColor("SAVING");
  clearTimeoutIfExistAndCallSaveFunctionWithTimeout();
});

currentDeleteBtn.addEventListener("click", async () => {
  if (note) {
    await deleteAndUpdateEnvironment(note.id);
  }
  appContainer.classList.add("left");
});

exportBtn.addEventListener("click", () => {
  save()
  exportData()
})

importBtn.addEventListener("click", () => {

  if (typeof window.FileReader !== 'function') {
    alert("The file API isn't supported on this browser yet.");
    return;
  }

  importFile.click()
})

importFile.addEventListener("input", (e) => {
  var file, fr;

  if (!importFile) {
    alert("Um, couldn't find the fileinput element.");
  }
  else if (!importFile.files) {
    alert("This browser doesn't seem to support the `files` property of file inputs.");
  }
  else if (!importFile.files[0]) {
    alert("Please select a file before clicking 'Load'");
  }
  else {
    file = importFile.files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(file);
  }

  function receivedText(e: ProgressEvent<FileReader>) {
    let lines = e?.target?.result as string;
    var newArr = lines ? JSON.parse(lines) : [];

    importData(newArr)
  }
})

// __________________________________________________________________________________

function save() {
  addOrUpdateNote(note!)
    .then(() => {
      timeOut = null;
      setIndicatorStatusColor("SAVED");
    })
    .catch((err) => {
      console.log(err);
    });
}

function createHTMLFile(localNote: Note, selected = false) {
  // _____________div _____________________
  const div = document.createElement("div");
  div.classList.add("file");
  div.setAttribute("data-note-id", localNote.id);
  div.setAttribute("data-selected", String(selected));

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
  p.innerHTML = `<span class="material-icons-round">description</span><span>${localNote.name}</span>`;
  p.setAttribute("data-note-id", localNote.id);

  // _______________button__________________
  const button = document.createElement("button");
  button.innerHTML = '<span class="material-icons-round">delete_forever</span>';
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

async function deleteAndUpdateEnvironment(id: string) {
  await deleteNote(id);

  const count = await getTotalFiles();
  console.log(count);
  console.log("local note", id);
  console.log("note", note?.id);

  if (count === 0) createNewFileAndOpen();
  else if (id === note?.id) {
    const firstNote = await getFileByIndex(count - 1);

    openNoteInEditor(firstNote);
  }

  updateFileList();
}

function checkAndRemoveClass(element: HTMLElement, className: string) {
  if (element.classList.contains(className))
    element.classList.remove(className);
}

function createNewFileAndOpen() {
  setIndicatorStatusColor("SAVING");
  getAllNotes().then((allNotes) => {
    const sortedFiles = allNotes
      .filter((n) => {
        return /untitled-\d+/.test(n.name);
      })
      .sort((a, b) => {
        const aNum = a.name.match(/untitled-(\d+)/)[1];
        const bNum = b.name.match(/untitled-(\d+)/)[1];

        return bNum - aNum;
      });

    const lastFileNumber =
      sortedFiles.length !== 0
        ? sortedFiles[0].name.match(/untitled-(\d+)/)[1]
        : 0;

    console.log(lastFileNumber);

    openNoteInEditor(new Note(`untitled-${Number(lastFileNumber) + 1}`, ""));
    save();
    updateFileList()
  });
}


function openNoteInEditor(n: Note) {
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
  // window
  // 	.matchMedia("(prefers-color-scheme: dark)")
  // 	.addEventListener("change", function (e) {
  // 		if (e.matches) {
  // 			console.info("ACTIVATED DARK MODE");
  // 			body.classList.add("dark");
  // 		} else {
  // 			console.info("ACTIVATED LIGHT MODE");
  // 			// body.classList.remove("dark");
  // 			checkAndRemoveClass(body,"dark")
  // 		}
  // 	});
}


function setIndicatorStatusColor(color: keyof typeof SAVE_STATUS) {
  indicator.style.backgroundColor = SAVE_STATUS[color];
}


function clearTimeoutIfExistAndCallSaveFunctionWithTimeout() {
  if (timeOut) clearTimeout(timeOut);

  timeOut = setTimeout(() => {
    save();
  }, 1000);
}


function exportData() {
  getAllNotes().then(allNotes => {
    const data = JSON.stringify(allNotes);
    const exportName = "notes"
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(data);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  })
}


async function importData(notes: Note[]) {

  console.log(notes);

  for (let i = 0; i < notes.length; i++) {
    const n = new Note(notes[i].name, notes[i].content);
    await addOrUpdateNote(n);
  }

  updateFileList()

}