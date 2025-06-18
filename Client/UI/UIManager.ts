import { NoteObj } from "../models/NoteObj.js";
import { DBStorage } from "../Storage/DBStorage.js";
import { NoteEditor } from "../Editor/NoteEditor.js";
// import { StorageService } from "./StorageService.js";
import { TempEditor } from "../Editor/TempEditor.js";
import { ElementMananger } from "./ElementManager.js";
import { Note } from "../models/Note.js";

type Mode = "viewMode" | "insertMode" | "editorMode";

export class UIManager{

    private currentEditor: NoteEditor | null = null;
    private mode: Mode = "viewMode";
    private tempEditor = new TempEditor;
    private elementManager = new ElementMananger;
    contentEditable: boolean = true;

    private buttons = {
        submit: null as HTMLElement | null,
        cancel: null as HTMLElement | null,
        accept: null as  HTMLElement | null,
        delete: null as HTMLElement | null
    }
    
    private addButton: HTMLElement | null = null;
    private editorContainer: HTMLElement | null = null;
    private editorParent: HTMLElement | null = null;
    private clickedNoteObj: NoteObj | null = null;
    private buttonContainer: HTMLElement | null = null;

    noteChange: string = "";

    constructor() {
        this.initialize();
    }

    private initialize(): void{
        this.addButton = document.querySelector(".addButton");
        this.editorContainer = document.createElement("div");
        this.currentEditor = new NoteEditor(this.editorContainer);
        this.makeButtonArea();

        this.buttons.submit = this.elementManager.makeButton("Submit", "submitButton");
        this.buttons.cancel = this.elementManager.makeButton("Cancel", "cancelButton");
        this.buttons.accept = this.elementManager.makeButton("Accept", "acceptButton");
        this.buttons.delete = this.elementManager.makeButton("Delete Note", "deleteButton");
    }

    makeButtonArea(): void{
        const newContainer = document.createElement("div");
        this.buttonContainer = newContainer;
    }

    returnEditorObject(): NoteObj{
        const editorObj = this.currentEditor?.getContents()!;
        return editorObj;
    }

    returnEditorHTML(): any{
        const editorObj = this.currentEditor?.getHTML()!;
        return editorObj;
    }

    returnEditorText(): string{
        return this.currentEditor?.getText()!;
    }

    toggle_Modal_BG_overlay(){
        const overlay = document.querySelector("#overlay");
        const mainPage = document.querySelector(".mainPage");
        mainPage?.classList.toggle("display-filter");
        overlay?.classList.toggle("display-none");
    }

    signInModalViewToggle(){
        const signInModal = document.querySelector("#signInModal");
        signInModal?.classList.toggle("display-none");
    }

    registerModalViewToggle(){
        const registerModal = document.querySelector("#registerModal");
        registerModal?.classList.toggle("display-none");
        this.signInModalViewToggle();
    }

    insertMode(): void{
        if(this.mode === "insertMode") return;
        this.mode = "insertMode";
        this.editorParent = document.querySelector("#editorArea")!;
        
        if(this.addButton) this.elementManager.hideButton(this.addButton);

        if(this.buttonContainer)
        {
            this.editorParent.insertAdjacentElement("afterend", this.buttonContainer);
        }
        
        if(this.editorContainer && this.buttons.cancel && this.buttons.submit)
        {
            this.buttonContainer?.appendChild(this.buttons.cancel);
            this.buttonContainer?.appendChild(this.buttons.submit);
        }

        if(this.editorContainer){
            this.currentEditor!.showEditor(this.editorParent!);
            this.currentEditor?.clear();
        }
    }

    viewMode(): void{
        if(this.mode === "viewMode") return;
        if(this.addButton) this.elementManager.viewButton(this.addButton);
        this.contentEditable = true;
        if(this.buttonContainer)
        this.elementManager.removeButtonArea(this.buttonContainer);
        if(this.mode === "insertMode")
        {
            this.mode = "viewMode";
            if(this.editorContainer){
                this.currentEditor?.clear();
                this.currentEditor?.removeEditor();
            }
            if(this.buttons.cancel && this.buttons.submit)
            {
                this.elementManager.killButton(this.buttons.cancel);
                this.elementManager.killButton(this.buttons.submit);
            }
            if(this.buttonContainer)
            this.elementManager.removeButtonArea(this.buttonContainer);
        }
        if(this.mode === "editorMode")
        {
            this.mode = "viewMode";
            if(this.buttons.delete && this.buttons.accept && this.buttons.cancel)
            {
                this.elementManager.killButton(this.buttons.delete);
                this.elementManager.killButton(this.buttons.accept);
                this.elementManager.killButton(this.buttons.cancel);
            }
            this.currentEditor?.removeEditor();
            if(this.clickedNoteObj)
            {
                this.editorParent!.innerHTML = this.tempEditor.returnHTMLFromObj(this.clickedNoteObj);
            }
        }
    }

    async editorMode(clickedNote: HTMLElement): Promise<void>{
        if (this.mode === "editorMode") return;
        if (this.contentEditable === false) return; 
        this.mode = "editorMode";
        this.editorParent = clickedNote;
        if(this.addButton) this.elementManager.hideButton(this.addButton);
        const divID = clickedNote.getAttribute("data-id");
        let selected_Note_from_DB: Note | null = null;
        if(divID) {
            this.noteChange = divID;
            selected_Note_from_DB = await DBStorage.get_curr_Note(divID);
        }
        clickedNote.textContent = '';

        this.currentEditor?.showEditor(this.editorParent!);
        this.currentEditor?.setContent(selected_Note_from_DB?.content);
        this.clickedNoteObj = selected_Note_from_DB?.content;

        if(this.buttonContainer)
        clickedNote.insertAdjacentElement('afterend', this.buttonContainer)

        if(this.buttons.cancel && this.buttons.accept && this.buttons.delete)
        {
            this.buttonContainer?.appendChild(this.buttons.delete);
            this.buttonContainer?.appendChild(this.buttons.cancel);
            this.buttonContainer?.appendChild(this.buttons.accept);
        }
    }

    //Queries all addedNotes, turns them into a HTMLCollection, and loops through them checking for the input string.
    //If !found, sets the style to none
    searchMode(searchedText: string): void{
        console.log("Called");
        const allNotes = document.getElementsByClassName("addedNote") as HTMLCollectionOf<HTMLElement>;
        const lowerCaseSearch = searchedText.toLowerCase();
        for(let i = 0; i < allNotes.length; i++){
            console.log("Looped");
            const lowerCaseNote = allNotes[i].textContent?.toLowerCase();
            const note = allNotes[i];
            if(!lowerCaseNote?.includes(lowerCaseSearch))
            {
                note.style.display = "none";
            }
            else
            {
                note.style.display = "";
            }
        }
    }
}