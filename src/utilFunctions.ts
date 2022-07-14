import { addOrUpdateNote, deleteNote, getAllNotes, getFileByIndex, getNote, getTotalFiles } from "./indexedDb";
import Note from "./Note";
import { body, appContainer, indicator, notepad, fileNameElement, filesContainer, searchElement, helpModalBody } from "./selectors"
import { shortcuts } from "./shortcuts";


export const SAVE_STATUS = {
  SAVING: "hsl(39, 100%, 50%)",
  SAVED: "hsl(120, 100%, 25%)",
} as const;

export function updateFileList() {
  globalThis.searchTimeOut = null;

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

    const fragment = document.createDocumentFragment()

    content.forEach((c) => {
      fragment.appendChild(c);
    });

    filesContainer.appendChild(fragment)
  });
}


export function save() {
  addOrUpdateNote(note!)
    .then(() => {
      globalThis.timeOut = null;
      setIndicatorStatusColor("SAVED");
    })
    .catch((err) => {
      console.log(err);
    });
}

export function createHTMLFile(localNote: Note, selected = false) {
  // _____________div _____________________
  const div = document.createElement("div");
  div.classList.add("file");
  div.setAttribute("data-note-id", localNote.id);
  div.setAttribute("data-selected", String(selected));

  div.addEventListener("click", async () => {
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

export async function deleteAndUpdateEnvironment(id: string) {
  await deleteNote(id);

  const count = await getTotalFiles();

  if (count === 0) createNewFileAndOpen();
  else if (id === note?.id) {
    const firstNote = await getFileByIndex(count - 1);

    openNoteInEditor(firstNote);
  }

  updateFileList();
}

export function checkAndRemoveClass(element: HTMLElement, className: string) {
  if (element.classList.contains(className))
    element.classList.remove(className);
}

export function createNewFileAndOpen() {
  setIndicatorStatusColor("SAVING");
  getAllNotes().then((allNotes) => {
    const filteredFilesNumbers = allNotes
      .filter((n) => {
        return /^untitled-\d+$/.test(n.name);
      })
      .map((n) => {
        return Number(n.name.split("-")[1]);
      });


    const lastFileNumber = filteredFilesNumbers.length === 0 ? 0 : Math.max(...filteredFilesNumbers);

    openNoteInEditor(new Note(`untitled-${Number(lastFileNumber) + 1}`, ""));
    save();
    updateFileList()
  });
}


export function openNoteInEditor(n: Note) {
  note = n; // set the global note object
  fileNameElement.value = n.name;
  notepad.value = n.content;
  localStorage.setItem("currentFileId", n.id);
}


export function SetDarkModeAndAddEventListener() {
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
}


export function setIndicatorStatusColor(color: keyof typeof SAVE_STATUS) {
  indicator.style.backgroundColor = SAVE_STATUS[color];
}


export function clearTimeoutIfExistAndCallSaveFunctionWithTimeout() {
  if (globalThis.timeOut) clearTimeout(globalThis.timeOut);

  globalThis.timeOut = setTimeout(() => {
    save();
  }, 1000);
}


export function exportData() {
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



export async function importData(notes: Note[]) {

  for (let i = 0; i < notes.length; i++) {
    const n = new Note(notes[i].name, notes[i].content);
    await addOrUpdateNote(n);
  }

  updateFileList()

}

function createShortcutHTMLElement(keys: readonly (readonly string[])[], description: string) {

  const shortcut = document.createElement("div");
  shortcut.classList.add("help-modal--shortcut");

  const keysElement = document.createElement("p");
  keysElement.classList.add("help-modal--shortcut__keys");

  keysElement.innerHTML = keys.map(key => `<span>${key.map(k => `<span>${k}</span>`).join(" + ")}</span>`).join(" or ");


  const descriptionElement = document.createElement("p");
  descriptionElement.classList.add("help-modal--shortcut__desc");
  descriptionElement.innerHTML = description;

  shortcut.appendChild(keysElement);
  shortcut.appendChild(descriptionElement);

  return shortcut;
}


export function createHelpModal() {
  const fragment = document.createDocumentFragment()

  Object.keys(shortcuts).forEach(key => {
    const shortcut = createShortcutHTMLElement(shortcuts[key].keys, shortcuts[key].description);
    fragment.appendChild(shortcut);
  })

  helpModalBody.appendChild(fragment);

}


