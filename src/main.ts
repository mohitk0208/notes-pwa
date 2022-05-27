import "./style.css"
import Note from "./Note.js";
import { getNote, getFileByIndex, getTotalFiles } from "./indexedDb"
import { registerSW } from 'virtual:pwa-register'
import { attachEventListeners } from "./events"
import { notepad, monospaceMode } from "./selectors"
import { createNewFileAndOpen, openNoteInEditor, SetDarkModeAndAddEventListener, updateFileList } from "./utilFunctions";

registerSW({
  onNeedRefresh() { },
  onOfflineReady() { },
})



// set the mode according to the system preference
SetDarkModeAndAddEventListener();

// let note = new Note(fileNameElement.innerText, notepad.value);
declare global {
  var note: Note | null;
  var timeOut: NodeJS.Timeout | null;
  var searchTimeOut: NodeJS.Timeout | null;
}

globalThis.note = null;
globalThis.timeOut = null;
globalThis.searchTimeOut = null;


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
attachEventListeners()