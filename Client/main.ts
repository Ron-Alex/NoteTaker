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
        this.init();
    }

    async init(){
        await this.authManager.init();
        const authStatus = await this.authManager.getAuthorized();
        if(authStatus) this.loadDBNotes();
        else this.loadLSNotes();
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
                const newNote = this.noteService.makeNote(newNoteObj);
                if(this.authManager.getAuthorized())
                {
                    DBStorage.add_Note(newNote);
                }
                else {
                    let notes = StorageService.loadNote();
                    if(!notes) notes = [];
                    notes.push(newNote);
                    StorageService.setNote(notes);
                }
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
                if(this.authManager.getAuthorized()){
                    this.noteService.deleteDBNote(noteToBeDel);
                }
                else{
                    this.noteService.deleteLSNote(noteToBeDel);
                }
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
                if(this.authManager.getAuthorized())
                {
                    DBStorage.edit_Note(editedNote, new Date(), noteToBeEdited);
                }
                else{
                    this.noteService.editNote(editedNote, new Date(), noteToBeEdited);
                }
            }

            if(funcTarg.id === "signInButton" || funcTarg.id === "signInCancelButton"){
                this.UImanager.signInModalViewToggle();
                this.UImanager.toggle_Modal_BG_overlay();
                this.UImanager.alertToggle(false);
            }

            if(funcTarg.id === "createAcctButton"){
                this.UImanager.registerModalViewToggle();
            }

            if(funcTarg.id === "cancelRegisterButton"){
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
                        usernameField.value = "";
                        emailField.value = "";
                        passwordField.value = "";
                        this.UImanager.signedInMode();
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
                    }).then(() => {
                        this.loadDBNotes();
                        this.UImanager.signInModalViewToggle();
                        this.UImanager.toggle_Modal_BG_overlay();
                    })
                    .then(() => {
                        this.UImanager.signedInMode();
                        this.authManager.setAuthorize(true);
                        emailField.value = "";
                        passwordField.value = "";
                    })
                    .catch((err) => {
                        passwordField.value = "";
                        this.UImanager.alertToggle(true);
                        throw new Error("Could not resolve notes");
                    });
                }
            }

            if(funcTarg.classList.contains("signOutButton")) {
                this.authManager.setAuthorize(false);
                const notes = Array.from(document.getElementsByClassName("addedNote")) as HTMLElement[];
                StorageService.clearToken();
                this.UImanager.signedOutMode();
                this.noteList.clearNotes(notes);
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