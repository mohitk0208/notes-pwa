
import { body, appContainer, notepad, fileNameElement, addFileBtn, backBtn, currentDeleteBtn, modeBtn, searchElement, monospaceMode, importBtn, exportBtn, importFile } from "./selectors"
import { clearTimeoutIfExistAndCallSaveFunctionWithTimeout, createNewFileAndOpen, deleteAndUpdateEnvironment, exportData, importData, save, setIndicatorStatusColor, updateFileList } from "./utilFunctions";

export function attachEventListeners() {


  monospaceMode.addEventListener("change", () => {
    if (monospaceMode.checked)
      notepad.style.fontFamily = "'Fira Code', monospace";
    else {
      notepad.style.fontFamily = "'Fira Sans', sans-serif";
    }
  });

  searchElement.addEventListener("input", (_e) => {
    if (globalThis.searchTimeOut) clearTimeout(globalThis.searchTimeOut);

    globalThis.searchTimeOut = setTimeout(() => {
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

  addFileBtn.addEventListener("click", (_e) => {
    createNewFileAndOpen();
    updateFileList();
  });

  backBtn.addEventListener("click", () => {
    save();
    appContainer.classList.add("left");
  });

  fileNameElement.addEventListener("input", function (_e) {
    if (globalThis.note) {
      globalThis.note.name = fileNameElement.value;
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

  notepad.addEventListener("input", (_e) => {
    if (globalThis.note) {
      globalThis.note.content = notepad.value;
    }

    setIndicatorStatusColor("SAVING");
    clearTimeoutIfExistAndCallSaveFunctionWithTimeout();
  });

  currentDeleteBtn.addEventListener("click", async () => {
    if (globalThis.note) {
      await deleteAndUpdateEnvironment(globalThis.note.id);
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

  importFile.addEventListener("input", (_e) => {
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
}
