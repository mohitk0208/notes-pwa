export const body = document.querySelector<HTMLBodyElement>("body")!;
export const appContainer = document.querySelector<HTMLDivElement>(".app-container")!;
export const indicator = document.getElementById("save-indicator") as HTMLDivElement;
export const notepad = document.getElementById("notepad") as HTMLTextAreaElement;
export const fileNameElement = document.getElementById("filename") as HTMLInputElement;
export const addFileBtn = document.querySelector(".add-btn") as HTMLButtonElement;
export const filesContainer = document.querySelector(".files-container") as HTMLDivElement;
export const backBtn = document.querySelector(".back-btn") as HTMLButtonElement;
export const currentDeleteBtn = document.querySelector(".current-delete-btn") as HTMLButtonElement;
export const modeBtn = document.querySelector(".mode-btn") as HTMLButtonElement;
export const searchElement = document.getElementById("search") as HTMLInputElement;
export const monospaceMode = document.getElementById("font-mode") as HTMLInputElement;
export const importBtn = document.querySelector(".import-btn") as HTMLButtonElement;
export const exportBtn = document.querySelector(".export-btn") as HTMLButtonElement;
export const importFile = document.getElementById("import-file") as HTMLInputElement;
export const helpModalContainer = document.querySelector(".help-modal-container") as HTMLDivElement;
export const helpModal = document.querySelector(".help-modal") as HTMLDivElement;
export const helpModalOverlay = document.querySelector(".help-modal-overlay") as HTMLDivElement;
export const helpBtn = document.querySelector(".help-btn") as HTMLButtonElement;
export const helpModalHeader = document.querySelector(".help-modal--header") as HTMLDivElement;
export const helpModalHeaderHeading = document.querySelector(".help-modal--header__heading") as HTMLHeadingElement;
export const helpModalCloseBtn = document.querySelector(".help-modal--close-btn") as HTMLButtonElement;
export const helpModalBody = document.querySelector(".help-modal--body") as HTMLDivElement;
export const helpModalShortcut = document.querySelector(".help-modal--shortcut") as HTMLDivElement;
export const helpModalShortcutKey = document.querySelector(".help-modal--shortcut__keys") as HTMLParagraphElement;
export const helpModalShortcutDescription = document.querySelector(".help-modal--shortcut__desc") as HTMLParagraphElement;
export const copyFileNameBtn = document.querySelector(".copy-filename-btn") as HTMLButtonElement;
export const copyNotepadContentBtn = document.querySelector(".copy-notepad-content-btn") as HTMLButtonElement;
export const downloadBtn = document.querySelector(".download-btn") as HTMLButtonElement;