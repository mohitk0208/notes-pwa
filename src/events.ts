
import { handleMonospaceModeChange, searchElementInputHandler, themeToggleHandler, addFileHandler, backBtnClickHandler, fileNameInputHandler, notepadInputHandler, deleteCurrentFileHandler, exportBtnClickHandler, importBtnClickHandler, importFileHandler, openHelpModal, closeHelpModal } from "./eventHandlers";
import { notepad, fileNameElement, addFileBtn, backBtn, currentDeleteBtn, modeBtn, searchElement, monospaceMode, importBtn, exportBtn, importFile, helpBtn, helpModalOverlay, helpModalCloseBtn } from "./selectors";
import MouseTrap from "mousetrap"
import { notepadShortcuts, shortcuts } from "./shortcuts";



export function attachEventListeners() {


  monospaceMode.addEventListener("change", handleMonospaceModeChange);

  searchElement.addEventListener("input", searchElementInputHandler);

  modeBtn.addEventListener("click", themeToggleHandler);

  addFileBtn.addEventListener("click", addFileHandler);

  backBtn.addEventListener("click", backBtnClickHandler);

  fileNameElement.addEventListener("input", fileNameInputHandler);

  notepad.addEventListener("input", notepadInputHandler);

  currentDeleteBtn.addEventListener("click", deleteCurrentFileHandler);

  exportBtn.addEventListener("click", exportBtnClickHandler);

  importBtn.addEventListener("click", importBtnClickHandler)

  importFile.addEventListener("input", importFileHandler)

  helpBtn.addEventListener("click", openHelpModal)

  helpModalOverlay.addEventListener("click", closeHelpModal)

  helpModalCloseBtn.addEventListener("click", closeHelpModal)

}


export function attachNotepadKeyboardShortcuts() {

  Object.keys(notepadShortcuts).forEach(key => {
    MouseTrap(notepad).bind(notepadShortcuts[key].keys, notepadShortcuts[key].handler)
  })
}



export function attachKeyBoardShortcuts() {

  Object.keys(shortcuts).forEach(key => {
    MouseTrap.bind(shortcuts[key].keys, shortcuts[key].handler)
  })

  Object.keys(shortcuts).forEach(key => {
    MouseTrap(notepad).bind(shortcuts[key].keys, shortcuts[key].handler)
  })

  Object.keys(shortcuts).forEach(key => {
    MouseTrap(searchElement).bind(shortcuts[key].keys, shortcuts[key].handler)
  })

  Object.keys(shortcuts).forEach(key => {
    MouseTrap(fileNameElement).bind(shortcuts[key].keys, shortcuts[key].handler)
  })

}