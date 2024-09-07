
import { handleMonospaceModeChange, searchElementInputHandler, themeToggleHandler, addFileHandler, backBtnClickHandler, fileNameInputHandler, notepadInputHandler, deleteCurrentFileHandler, exportBtnClickHandler, importBtnClickHandler, importFileHandler, openHelpModal, closeHelpModal, copyFileNameBtnHandler, copyNotepadContentBtnHandler, downloadFileAsTxtHandler } from "./eventHandlers";
import { notepad, fileNameElement, addFileBtn, backBtn, currentDeleteBtn, modeBtn, searchElement, monospaceMode, importBtn, exportBtn, importFile, helpBtn, helpModalOverlay, helpModalCloseBtn, copyFileNameBtn, copyNotepadContentBtn, downloadBtn, confirmModalCloseBtn, confirmModalOverlay } from "./selectors";
import MouseTrap from "mousetrap"
import { notepadShortcuts, shortcuts } from "./shortcuts";
import { closeConfirmModal } from "./utilFunctions";



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

  copyFileNameBtn.addEventListener("click", copyFileNameBtnHandler)

  copyNotepadContentBtn.addEventListener("click", copyNotepadContentBtnHandler)

  downloadBtn.addEventListener("click", downloadFileAsTxtHandler)

  confirmModalCloseBtn.addEventListener("click", closeConfirmModal)

  confirmModalOverlay.addEventListener("click", closeConfirmModal)

}


export function attachNotepadKeyboardShortcuts() {

  Object.keys(notepadShortcuts).forEach(shortcut_name => {

    notepadShortcuts[shortcut_name].keys.forEach(combination => {

      MouseTrap(notepad).bind(combination.join("+"), notepadShortcuts[shortcut_name].handler);
    })

  })
}



export function attachKeyBoardShortcuts() {

  const focusableElements = [notepad, searchElement, fileNameElement];

  Object.keys(shortcuts).forEach(shortcut_name => {

    shortcuts[shortcut_name].keys.forEach(combination => {
      MouseTrap.bind(combination.join("+"), shortcuts[shortcut_name].handler)
    })

  })

  focusableElements.forEach(element => {
    Object.keys(shortcuts).forEach(shortcut_name => {

      shortcuts[shortcut_name].keys.forEach(combination => {
        MouseTrap(element).bind(combination.join("+"), shortcuts[shortcut_name].handler)
      })
    })
  })

}