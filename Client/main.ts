import { DBStorage } from "./Storage/DBStorage.js";
import { NoteService } from "./services/NoteService.js";
import { StorageService } from "./Storage/StorageService.js";
import { NoteList } from "./services/NoteList.js";
import { BackGroundService } from "./services/BackGroundService.js";
import { UIManager } from "./UI/UIManager.js";
import { AuthManager } from "./services/AuthManager.js";

 class NoteApp {
    private noteService: NoteService;
    private noteList: NoteList;
    private bgService: BackGroundService;
    private UImanager: UIManager;
    private authManager: AuthManager;

    constructor() {
        this.noteService = new NoteService;
        this.noteList = new NoteList(document.getElementById("mainContent")!);
        this.bgService = new BackGroundService;
        this.UImanager = new UIManager;
        this.authManager = new AuthManager;
        this.setUpEventListeners();
        this.loadLSNotes();
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

            if(funcTarg.id === "signInButton" || funcTarg.id === "signInCancelButton"){
                this.UImanager.signInModalViewToggle();
                this.UImanager.toggle_Modal_BG_overlay();
            }

            if(funcTarg.id === "createAcctButton"){
                this.UImanager.registerModalViewToggle();
            }

            if(funcTarg.id === "cancelRegisterButton")
            {
                this.UImanager.signInModalViewToggle();
                this.UImanager.registerModalViewToggle();
                this.UImanager.toggle_Modal_BG_overlay();
            }

            if(funcTarg.id === "submit_Create_Acct_Btn"){
                const usernameField = document.querySelector("#register_userName_field") as HTMLInputElement;
                const emailField = document.querySelector("#register_email_field") as HTMLInputElement;
                const passwordField = document.querySelector("#register_password_field") as HTMLInputElement;

                const userName = usernameField?.value;
                const email = emailField?.value;
                const password = passwordField?.value;

                if (userName && email && password) {
                    this.authManager.registerUser(userName, email, password)
                    .then(response => {
                        this.authManager.setUser(response.user_id);
                        this.authManager.setToken(response.token);
                    }).then(() => {
                        this.authManager.setAuthorize(true);
                    });
                }
                if(this.authManager.getUser()){
                    StorageService.saveToken(this.authManager.getUser()!);
                }
                this.UImanager.registerModalViewToggle();
                this.UImanager.signInModalViewToggle();
                this.UImanager.toggle_Modal_BG_overlay();
            }

            if(funcTarg.id === "loginButton") {
                const emailField = document.querySelector("#signin_email_field") as HTMLInputElement;
                const passwordField = document.querySelector("#signin_password_field") as HTMLInputElement;

                const email = emailField?.value;
                const password = passwordField?.value;

                if(email && password)
                {
                    this.authManager.signIn(email, password)
                    .then((response) => {
                        this.authManager.setToken(response.token);
                        this.loadDBNotes();
                    })
                }
            }

            if(parentDiv)
            {
                this.UImanager.editorMode(parentDiv);
            }
        });
        
        document.querySelector(".searchBar")?.addEventListener("input", (e) => {
            const wordTarg = e.target as HTMLInputElement;
            if(wordTarg.value)
                this.UImanager.searchMode(wordTarg.value);
            })

        document.querySelector(".themeToggle")?.addEventListener("change", () => {
            this.bgService.toggleTheme();
        });
    }

    private async loadDBNotes(): Promise<void> {
        const notes = await DBStorage.getAllNotes();
        this.noteList.render(notes);
    }

    private loadLSNotes(): void{
        const notes = StorageService.loadNote();
        this.noteList.render(notes);
    }
 }

 new NoteApp();