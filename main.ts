import { StorageService } from "./services/StorageService.js";
import { NoteService } from "./services/NoteService.js";
import { NoteList } from "./services/NoteList.js";
import { BackGroundService } from "./services/BackGroundService.js";
import { UIManager } from "./services/UIManager.js";

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
            const parentDiv = funcTarg.closest(".addedNote") as HTMLElement;

            if(funcTarg.classList.contains("addButton")){
                this.UImanager.insertMode();
            }

            if(funcTarg.classList.contains("submitButton"))
            {
                const editorText = this.UImanager.returnEditorText();
                if(editorText.trim() == "") 
                {
                    alert("Text Input is empty");
                    this.UImanager.viewMode();
                    return;
                }
                const newNoteObj = this.UImanager.returnEditorObject();
                const newNote = this.noteService.addNote(newNoteObj);
                this.noteList.renderNote(newNote);
                this.UImanager.viewMode();
            }

            if(funcTarg.classList.contains("cancelButton"))
            {
                this.UImanager.viewMode();
            }

            if(parentDiv)
            {
                this.UImanager.editorMode(parentDiv);
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