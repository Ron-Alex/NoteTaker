import { StorageService } from "./services/StorageService.js";
import { NoteService } from "./services/NoteService.js";
import { NoteList } from "./services/NoteList.js";
import { BackGroundService } from "./services/BackGroundService.js";
import { UIManager } from "./services/UIManager.js";
//  import { Note } from "./models/Note.js";

 class NoteApp {
    private noteService: NoteService;
    private noteList: NoteList;
    private bgService: BackGroundService;
    private UImanager: UIManager;

    constructor() {
        this.noteService = new NoteService;
        this.noteList = new NoteList(document.getElementById("mainContent")!);
        this.bgService = new BackGroundService;
        this.UImanager = new UIManager;
        this.setUpEventListeners();
        this.loadNotes();
    }

    private setUpEventListeners(): void {
        document.querySelector(".addButton")?.addEventListener("click", () => {
            this.UImanager.insertMode();
        });

        document.querySelector(".themeToggle")?.addEventListener("change", () => {
            this.bgService.toggleTheme();
        });
    }

    private loadNotes(): void {
        const notes = StorageService.loadNote();
        this.noteList.render(notes);
    }
 }

 new NoteApp();