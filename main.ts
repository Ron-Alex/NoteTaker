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
        document.addEventListener("click", (e) => {
            const funcTarg: HTMLElement = e.target as HTMLElement;
            if(funcTarg.classList.contains("addButton")){
                this.UImanager.insertMode();
            }
            if(funcTarg.classList.contains("submitButton"))
            {
                const newNoteObj = this.UImanager.returnEditorObject();
                console.log(newNoteObj);
                const newNote = this.noteService.addNote(newNoteObj);
                console.log(newNote);
                this.noteList.renderNote(newNote);
            }
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