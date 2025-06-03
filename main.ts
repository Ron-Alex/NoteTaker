import { StorageService } from "./services/StorageService.js";
import { NoteService } from "./services/NoteService.js";
import { NoteEditor } from "./services/NoteEditor.js";
import { NoteList } from "./services/NoteList.js";
import { BackGroundService } from "./services/BackGroundService.js";
//  import { Note } from "./models/Note.js";

 class NoteApp {
    private noteService: NoteService;
    private noteList: NoteList;
    private currentEditor: NoteEditor | null = null;
    private bgService: BackGroundService;

    constructor() {
        this.noteService = new NoteService;
        this.noteList = new NoteList(document.getElementById("mainContent")!);
        this.bgService = new BackGroundService;
        this.initialize();
        this.loadNotes();
    }

    private initialize(): void {
        this.setUpEventListeners();
        StorageService.loadNote();
    }

    private setUpEventListeners(): void {
        document.querySelector(".addButton")?.addEventListener("click", () => {
            const editorContainer = document.createElement("div");
            this.currentEditor = new NoteEditor(editorContainer);
            this.currentEditor?.showEditor();
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