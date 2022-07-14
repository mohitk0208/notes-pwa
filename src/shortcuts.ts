import { ExtendedKeyboardEvent } from "mousetrap";
import { addFileHandler, closeHelpModal, themeToggleHandler, toggleHelpModalHandler } from "./eventHandlers";
import { searchElement, notepad, fileNameElement, helpModalContainer, importBtn, exportBtn, monospaceMode } from "./selectors";

interface shortcut {
  keys: readonly (readonly string[])[]  // array is for multiple shortcuts for the same action
  handler: (e: ExtendedKeyboardEvent) => void,
  description: string
}

interface shortcutsType {
  [key: string]: shortcut
}


export const shortcuts: shortcutsType = {

  NEW_FILE: {
    keys: [["alt", "n"], ["ctrl", "n"]],
    handler: (e: ExtendedKeyboardEvent) => {
      e.preventDefault()
      addFileHandler()
    },
    description: "Create a new file"

  },

  TOGGLE_THEME: {
    keys: [["alt", "t"]],
    handler: (e: ExtendedKeyboardEvent) => {
      e.preventDefault()
      themeToggleHandler()
    },
    description: "Toggle theme"
  },

  FOCUS_FILE_SEARCH: {
    keys: [["alt", "s"]],
    handler: (e: ExtendedKeyboardEvent) => {
      e.preventDefault()
      searchElement.focus()
    },
    description: "Search for a file"
  },

  TOGGLE_HELP: {
    keys: [["alt", "h"]],
    handler: (e: ExtendedKeyboardEvent) => {
      e.preventDefault()
      toggleHelpModalHandler()
    },
    description: "Toggle help modal"
  },

  RENAME_CURRENT_FILE: {
    keys: [["alt", "r"]],
    handler: (e: ExtendedKeyboardEvent) => {
      e.preventDefault()
      fileNameElement.focus()
    },
    description: "rename current file"
  },

  FOCUS_NOTEPAD: {
    keys: [["alt", "w"]],
    handler: (e: ExtendedKeyboardEvent) => {
      e.preventDefault()
      notepad.focus()
    },
    description: "focus writing pad"
  },

  ESCAPE_KEY_PRESSED: {
    keys: [["esc"]],
    handler: (e: ExtendedKeyboardEvent) => {

      if (helpModalContainer.classList.contains("show")) {
        e.preventDefault()
        closeHelpModal()
      }

    },
    description: "close help modal"
  },

  IMPORT_FILE: {
    keys: [["alt", "i"]],
    handler: (e: ExtendedKeyboardEvent) => {
      e.preventDefault()
      importBtn.click()
    },
    description: "import file"
  },

  EXPORT_FILE: {
    keys: [["alt", "e"]],
    handler: (e: ExtendedKeyboardEvent) => {
      e.preventDefault()
      exportBtn.click()
    },
    description: "export file"
  },

  TOGGLE_MONOSPACE_MODE: {
    keys: [["alt", "m"]],
    handler: (e: ExtendedKeyboardEvent) => {
      e.preventDefault()
      monospaceMode.click()
    },
    description: "toggle monospace mode"
  }

} as const;


export const notepadShortcuts: shortcutsType = {

  INSERT_WHITESPACE_ON_TAB_PRESS: {
    keys: [["tab"]],
    handler: (e: ExtendedKeyboardEvent) => {
      e.preventDefault();
      var start = notepad.selectionStart;
      var end = notepad.selectionEnd;

      // set textarea value to: text before caret + tab + text after caret
      notepad.value =
        notepad.value.substring(0, start) + "\t" + notepad.value.substring(end);

      // put caret at right position again
      notepad.selectionStart = notepad.selectionEnd = start + 1;
    },
    description: "Insert a tab character on tab press"
  }
} as const;