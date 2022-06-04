import "./style.css"
import Note from "./Note.js";
import { getNote, getFileByIndex, getTotalFiles } from "./indexedDb"
import { registerSW } from 'virtual:pwa-register'
import { attachEventListeners, attachKeyBoardShortcuts, attachNotepadKeyboardShortcuts } from "./events"
import { notepad, monospaceMode } from "./selectors"
import { createHelpModal, createNewFileAndOpen, openNoteInEditor, SetDarkModeAndAddEventListener, updateFileList } from "./utilFunctions";

registerSW({
  onNeedRefresh() { },
  onOfflineReady() {
    alert("app is ready to work offline.")
  },
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

const currentFileId = localStorage.getItem("currentFileId");

if (currentFileId) {
  getNote(currentFileId).then((n) => {
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
  await getFileByIndex((await getTotalFiles()) - 1);
})();




createHelpModal()


// ________________________________________________________________________

// ALL EVENT LISTENERS HERE....
attachEventListeners()
attachKeyBoardShortcuts()
attachNotepadKeyboardShortcuts()