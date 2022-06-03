import { ExtendedKeyboardEvent } from "mousetrap";
import { addFileHandler, themeToggleHandler, toggleHelpModalHandler } from "./eventHandlers";
import { searchElement, notepad } from "./selectors";

interface shortcut {
  keys: string | []
  handler: (e: ExtendedKeyboardEvent) => void,
  description: string
}

interface shortcutsType {
  [key: string]: shortcut
}


export const shortcuts: shortcutsType = {

  NEW_FILE: {
    keys: "alt+n",
    handler: (e: ExtendedKeyboardEvent) => {
      e.preventDefault()
      addFileHandler()
    },
    description: "Create a new file"

  },

  TOGGLE_THEME: {
    keys: "alt+t",
    handler: (e: ExtendedKeyboardEvent) => {
      e.preventDefault()
      themeToggleHandler()
    },
    description: "Toggle theme"
  },

  FOCUS_FILE_SEARCH: {
    keys: "alt+s",
    handler: (e: ExtendedKeyboardEvent) => {
      e.preventDefault()
      searchElement.focus()
    },
    description: "Search for a file"
  },

  TOGGLE_HELP: {
    keys: "alt+h",
    handler: (e: ExtendedKeyboardEvent) => {
      e.preventDefault()
      toggleHelpModalHandler()
    },
    description: "Toggle help modal"
  }

} as const;


export const notepadShortcuts: shortcutsType = {

  INSERT_WHITESPACE_ON_TAB_PRESS: {
    keys: "tab",
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