
import { handleMonospaceModeChange, searchElementInputHandler, themeToggleHandler, addFileHandler, backBtnClickHandler, fileNameInputHandler, notepadKeydownEventHandler, notepadInputHandler, deleteCurrentFileHandler, exportBtnClickHandler, importBtnClickHandler, importFileHandler } from "./eventHandlers";
import { notepad, fileNameElement, addFileBtn, backBtn, currentDeleteBtn, modeBtn, searchElement, monospaceMode, importBtn, exportBtn, importFile } from "./selectors"
  ;


export function attachEventListeners() {


  monospaceMode.addEventListener("change", handleMonospaceModeChange);

  searchElement.addEventListener("input", searchElementInputHandler);

  modeBtn.addEventListener("click", themeToggleHandler);

  addFileBtn.addEventListener("click", addFileHandler);

  backBtn.addEventListener("click", backBtnClickHandler);

  fileNameElement.addEventListener("input", fileNameInputHandler);

  notepad.addEventListener("keydown", notepadKeydownEventHandler);

  notepad.addEventListener("input", notepadInputHandler);

  currentDeleteBtn.addEventListener("click", deleteCurrentFileHandler);

  exportBtn.addEventListener("click", exportBtnClickHandler);

  importBtn.addEventListener("click", importBtnClickHandler)

  importFile.addEventListener("input", importFileHandler)
}
