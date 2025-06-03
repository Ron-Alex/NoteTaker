import { StorageService } from "./services/StorageService.js";
import { NoteService } from "./services/NoteService.js";
import { NoteEditor } from "./services/NoteEditor.js";
import { NoteList } from "./services/NoteList.js";
import { BackGroundService } from "./services/BackGroundService.js";
//  import { Note } from "./models/Note.js";
class NoteApp {
    constructor() {
        this.currentEditor = null;
        this.noteService = new NoteService;
        this.noteList = new NoteList(document.getElementById("mainContent"));
        this.bgService = new BackGroundService;
        this.initialize();
        this.loadNotes();
    }
    initialize() {
        this.setUpEventListeners();
        StorageService.loadNote();
    }
    setUpEventListeners() {
        var _a, _b;
        (_a = document.querySelector(".addButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            var _a;
            const editorContainer = document.createElement("div");
            this.currentEditor = new NoteEditor(editorContainer);
            (_a = this.currentEditor) === null || _a === void 0 ? void 0 : _a.showEditor();
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
