import { StorageService } from "./services/StorageService.js";
import { NoteService } from "./services/NoteService.js";
import { NoteList } from "./services/NoteList.js";
import { BackGroundService } from "./services/BackGroundService.js";
import { UIManager } from "./services/UIManager.js";
//  import { Note } from "./models/Note.js";
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
        (_a = document.querySelector(".addButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            this.UImanager.insertMode();
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
