import { NoteObj } from "../models/NoteObj.js";
import { NoteEditor } from "./NoteEditor.js";
import { StorageService } from "./StorageService.js";
import { TempEditor } from "./TempEditor.js";

type Mode = "viewMode" | "insertMode" | "editorMode";

export class UIManager{

    private currentEditor: NoteEditor | null = null;
    private mode: Mode = "viewMode";
    private tempEditor = new TempEditor;

    private addButton: HTMLElement | null = null;
    private submitButton: HTMLElement | null = null;
    private cancelButton: HTMLElement | null = null;
    private acceptButton: HTMLElement | null = null;
    private deleteButton: HTMLElement | null = null;
    
    private editorContainer: HTMLElement | null = null;
    private editorParent: HTMLElement | null = null;
    private clickedNoteObj: NoteObj | null = null;

    constructor() {
        this.initialize();
    }

    private initialize(): void{
        this.addButton = document.querySelector(".addButton");
        this.editorContainer = document.createElement("div");
        this.currentEditor = new NoteEditor(this.editorContainer);
        this.submitButton = this.makeButton("Submit", "submitButton");
        this.cancelButton = this.makeButton("Cancel", "cancelButton");
    }

    returnEditorObject(): NoteObj{
        const editorObj = this.currentEditor?.getContents()!;
        return editorObj;
    }

    returnEditorText(): string{
        return this.currentEditor?.getText()!;
    }

    makeButton(text: string, newClass: string): HTMLElement{
        const newButton = document.createElement('button');
        newButton.classList.add("bodyButton", newClass);
        newButton.textContent = text;
        return newButton;
    }

    killButton(button: HTMLElement): void{
        button.remove();
    }

    hideButton(button: HTMLElement): HTMLElement{
        button.style.display = "none";
        return button;
    }

    viewButton(button: HTMLElement): HTMLElement{
        button.style.display = "";
        return button;
    }

    insertMode(): void{
        if(this.mode === "insertMode") return;
        this.mode = "insertMode";
        this.editorParent = document.querySelector("#editorArea")!;
        console.log(this.editorContainer);
        if(this.addButton) this.hideButton(this.addButton);
        
        if(this.editorContainer){
            this.currentEditor!.showEditor(this.editorParent!);
        }
        
        if(this.editorContainer && this.cancelButton && this.submitButton)
        {
            this.editorContainer.insertAdjacentElement('afterend', this.submitButton);
            this.editorContainer.insertAdjacentElement("afterend", this.cancelButton);
        }
    }

    viewMode(): void{
        if(this.mode === "viewMode") return;
        if(this.mode === "insertMode")
        {
            this.mode = "viewMode";
            if(this.addButton) this.viewButton(this.addButton);
            if(this.editorContainer){
                this.currentEditor?.clear();
                this.currentEditor?.removeEditor();
            }
            if(this.cancelButton && this.submitButton)
            {
                this.killButton(this.cancelButton);
                this.killButton(this.submitButton);
            }
        }
        if(this.mode === "editorMode")
        {
            this.mode = "viewMode";
            if(this.deleteButton && this.acceptButton && this.cancelButton)
            {
                this.killButton(this.deleteButton);
                this.killButton(this.acceptButton);
                this.killButton(this.cancelButton);
            }
            this.currentEditor?.removeEditor();
            if(this.clickedNoteObj)
            {
                this.editorParent!.innerHTML = this.tempEditor.returnHTMLFromObj(this.clickedNoteObj);
            }
            
        }
    }

    editorMode(clickedNote: HTMLElement): void{
        console.log(clickedNote);
        if (this.mode === "editorMode") return;
        this.mode = "editorMode";
        this.editorParent = clickedNote;
        const divID = clickedNote.getAttribute("data-id");
        const notes = StorageService.loadNote();
        clickedNote.textContent = '';
        for(let i = 0; i < notes.length; i++)
        {
            if(divID === notes[i].storedID)
            {
                this.currentEditor?.showEditor(this.editorParent!);
                this.clickedNoteObj = notes[i].content;
                this.currentEditor?.setContent(notes[i].content);
                break;
            }
        }
        this.acceptButton = this.makeButton("Accept", "acceptButton");
        this.deleteButton = this.makeButton("Delete Note", "deleteButton");
        if(this.cancelButton && this.acceptButton && this.deleteButton)
        {
            clickedNote.insertAdjacentElement("afterend", this.acceptButton);
            clickedNote.insertAdjacentElement("afterend", this.cancelButton);
            clickedNote.insertAdjacentElement("afterend", this.deleteButton);
        }
    }
}