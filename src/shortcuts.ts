import { ExtendedKeyboardEvent } from "mousetrap";
import { addFileHandler, themeToggleHandler, toggleHelpModalHandler } from "./eventHandlers";
import { searchElement, notepad } from "./selectors";

interface shortcut {
  keys: string | []
  handler: (e: ExtendedKeyboardEvent) => void
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
    }
  },

  TOGGLE_THEME: {
    keys: "alt+t",
    handler: (e: ExtendedKeyboardEvent) => {
      e.preventDefault()
      themeToggleHandler()
    }
  },

  FOCUS_FILE_SEARCH: {
    keys: "alt+s",
    handler: (e: ExtendedKeyboardEvent) => {
      e.preventDefault()
      searchElement.focus()
    }
  },

  TOGGLE_HELP: {
    keys: "alt+h",
    handler: (e: ExtendedKeyboardEvent) => {
      e.preventDefault()
      toggleHelpModalHandler()
    }
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
    }
  }
} as const;