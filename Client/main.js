import { StorageService } from "./services/StorageService.js";
import { NoteService } from "./services/NoteService.js";
import { NoteList } from "./services/NoteList.js";
import { BackGroundService } from "./services/BackGroundService.js";
import { UIManager } from "./services/UIManager.js";
class NoteApp {
    constructor() {
        this.noteService = new NoteService;
        this.noteList = new NoteList(document.getElementById("mainContent"));
        this.bgService = new BackGroundService;
        this.UImanager = new UIManager;
        this.setUpEventListeners();
        this.loadNotes();
    }
    setUpEventListeners() {
        var _a, _b;
        document.addEventListener("click", (e) => {
            const funcTarg = e.target;
            const parentDiv = funcTarg.closest(".addedNote");
            if (funcTarg.classList.contains("addButton")) {
                this.UImanager.contentEditable = false;
                this.UImanager.insertMode();
            }
            if (funcTarg.classList.contains("submitButton")) {
                const editorText = this.UImanager.returnEditorText();
                if (editorText.trim() == "") {
                    alert("Text Input is empty");
                    this.UImanager.viewMode();
                    return;
                }
                const newNoteObj = this.UImanager.returnEditorObject();
                const newNote = this.noteService.addNote(newNoteObj);
                this.noteList.renderNote(newNote);
                this.UImanager.viewMode();
            }
            if (funcTarg.classList.contains("cancelButton")) {
                this.UImanager.viewMode();
            }
            if (funcTarg.classList.contains("deleteButton")) {
                this.UImanager.viewMode();
                const noteToBeDel = this.UImanager.noteChange;
                this.noteService.deleteNote(noteToBeDel);
                const selectedNote = document.querySelector(`[data-id="${noteToBeDel}"]`);
                if (selectedNote)
                    this.noteList.deleteNoteDiv(selectedNote);
            }
            if (funcTarg.classList.contains("acceptButton")) {
                this.UImanager.viewMode();
                const noteToBeEdited = this.UImanager.noteChange;
                const editedNote = this.UImanager.returnEditorObject();
                const selectedNote = document.querySelector(`[data-id="${noteToBeEdited}"]`);
                let notes = StorageService.loadNote();
                for (let i = 0; i < notes.length; i++) {
                    if (notes[i].storedID === noteToBeEdited) {
                        notes[i].content = editedNote;
                        break;
                    }
                }
                if (selectedNote)
                    selectedNote.innerHTML = this.UImanager.returnEditorHTML();
                StorageService.setNote(notes);
            }
            if (parentDiv) {
                this.UImanager.editorMode(parentDiv);
            }
        });
        (_a = document.querySelector(".searchBar")) === null || _a === void 0 ? void 0 : _a.addEventListener("input", (e) => {
            const wordTarg = e.target;
            console.log(wordTarg.value);
            if (wordTarg.value)
                this.UImanager.searchMode(wordTarg.value);
        });
        (_b = document.querySelector(".themeToggle")) === null || _b === void 0 ? void 0 : _b.addEventListener("change", () => {
            this.bgService.toggleTheme();
        });
    }
    loadNotes() {
        const notes = StorageService.loadNote();
        this.noteList.render(notes);
    }
}
new NoteApp();
