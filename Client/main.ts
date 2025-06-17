import { DBStorage } from "./services/DBStorage.js";
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
                this.UImanager.contentEditable = false;
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

            if(funcTarg.classList.contains("deleteButton"))
            {
                this.UImanager.viewMode();
                const noteToBeDel = this.UImanager.noteChange;
                this.noteService.deleteNote(noteToBeDel);
                const selectedNote = document.querySelector(`[data-id="${noteToBeDel}"]`);
                if(selectedNote)
                this.noteList.deleteNoteDiv(selectedNote as HTMLDivElement);
            }

            if(funcTarg.classList.contains("acceptButton"))
            {
                this.UImanager.viewMode();
                const noteToBeEdited = this.UImanager.noteChange;
                const editedNote = this.UImanager.returnEditorObject();
                const selectedNote = document.querySelector(`[data-id="${noteToBeEdited}"]`);
                if(selectedNote)
                selectedNote.innerHTML = this.UImanager.returnEditorHTML();
                DBStorage.edit_Note(editedNote, new Date(), noteToBeEdited);
            }

            if(funcTarg.id === "signInButton" || funcTarg.id === "modalCancelButton"){
                this.UImanager.modalViewToggle();
            }

            if(parentDiv)
            {
                this.UImanager.editorMode(parentDiv);
            }
        });
        
        document.querySelector(".searchBar")?.addEventListener("input", (e) => {
            const wordTarg = e.target as HTMLInputElement;
            console.log(wordTarg.value);
            if(wordTarg.value)
                this.UImanager.searchMode(wordTarg.value);
            })

        document.querySelector(".themeToggle")?.addEventListener("change", () => {
            this.bgService.toggleTheme();
        });
    }

    private async loadNotes(): Promise<void> {
        const notes = await DBStorage.getAllNotes();
        this.noteList.render(notes);
    }
 }

 new NoteApp();