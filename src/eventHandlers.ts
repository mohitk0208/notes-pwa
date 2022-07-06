import { body, appContainer, notepad, fileNameElement, modeBtn, monospaceMode, importFile, helpModalContainer } from "./selectors"

import { clearTimeoutIfExistAndCallSaveFunctionWithTimeout, createNewFileAndOpen, deleteAndUpdateEnvironment, exportData, importData, save, setIndicatorStatusColor, updateFileList } from "./utilFunctions"

export const handleMonospaceModeChange = () => {
  if (monospaceMode.checked)
    notepad.style.fontFamily = "'Fira Code', monospace";
  else {
    notepad.style.fontFamily = "'Fira Sans', sans-serif";
  }
}


export const searchElementInputHandler = () => {
  if (globalThis.searchTimeOut) clearTimeout(globalThis.searchTimeOut);

  globalThis.searchTimeOut = setTimeout(() => {
    updateFileList();
  }, 50);
}


export const themeToggleHandler = () => {
  body.classList.toggle("dark");

  if (body.classList.contains("dark"))
    modeBtn.innerHTML = '<span class="material-icons-round">dark_mode</span>';
  else
    modeBtn.innerHTML = '<span class="material-icons-round">light_mode</span>';
}


export const addFileHandler = () => {
  createNewFileAndOpen();
  updateFileList();
}

export const backBtnClickHandler = () => {
  save();
  appContainer.classList.add("left");
}


export const fileNameInputHandler = () => {
  if (globalThis.note) {
    globalThis.note.name = fileNameElement.value;
  }

  const fileElement = document.querySelector(`p[data-note-id="${note?.id}"]`)!;

  fileElement.innerHTML = `<span class="material-icons-round">description</span> ${fileNameElement.value}`;

  setIndicatorStatusColor("SAVING");
  clearTimeoutIfExistAndCallSaveFunctionWithTimeout();
}

export const notepadInputHandler = () => {
  if (globalThis.note) {
    globalThis.note.content = notepad.value;
  }

  setIndicatorStatusColor("SAVING");
  clearTimeoutIfExistAndCallSaveFunctionWithTimeout();
}

export const deleteCurrentFileHandler = async () => {
  if (globalThis.note) {
    await deleteAndUpdateEnvironment(globalThis.note.id);
  }
  appContainer.classList.add("left");
}

export const exportBtnClickHandler = () => {
  save()
  exportData()
}

export const importBtnClickHandler = () => {

  if (typeof window.FileReader !== 'function') {
    alert("The file API isn't supported on this browser yet.");
    return;
  }

  importFile.click()
}

export const importFileHandler = () => {
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
}


export const openHelpModal = () => {
  if (helpModalContainer.classList.contains("show")) return

  helpModalContainer.classList.add("show");
}

export const closeHelpModal = () => {
  helpModalContainer.classList.remove("show");
}

export const toggleHelpModalHandler = () => {
  helpModalContainer.classList.toggle("show");
}

export const copyFileNameBtnHandler = () => {
  if (globalThis.note) {
    navigator.clipboard.writeText(globalThis.note.name);
    fileNameElement.select()
  }
}

export const copyNotepadContentBtnHandler = () => {

  if (globalThis.note) {
    navigator.clipboard.writeText(globalThis.note.content);
    notepad.select()
  }

}