import { NoteObj } from "../models/NoteObj.js";
import { NoteEditor } from "./NoteEditor.js";
import { StorageService } from "./StorageService.js";

export class UIManager{

    private currentEditor: NoteEditor | null = null;
    private mode: string = "viewMode";
    private addButton: HTMLElement | null = null;
    private submitButton: HTMLElement | null = null;
    private cancelButton: HTMLElement | null = null;
    private editorContainer: HTMLElement | null = null;
    private editorParent: HTMLElement | null = null;

    constructor() {
        this.initialize();
    }

    private initialize(): void{
        this.addButton = document.querySelector(".addButton");
        this.editorContainer = document.createElement("div");
        this.currentEditor = new NoteEditor(this.editorContainer);
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
        this.submitButton = this.makeButton("Submit", "submitButton");
        this.cancelButton = this.makeButton("Cancel", "cancelButton");
        
        if(this.editorContainer)
        {
            this.editorContainer.insertAdjacentElement('afterend', this.submitButton);
            this.editorContainer.insertAdjacentElement("afterend", this.cancelButton);
        }
    }

    viewMode(): void{
        if(this.mode === "viewMode") return;
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

    editorMode(clickedNote: HTMLElement): void{
        console.log(clickedNote);
        if (this.mode === "editorMode") return;
        this.mode = "editorMode";
        this.editorParent = clickedNote;
        const divID = clickedNote.getAttribute("data-id");
        const notes = StorageService.loadNote();
        for(let i = 0; i < notes.length; i++)
        {
            if(divID === notes[i].storedID)
            {
                this.currentEditor?.showEditor(this.editorParent!);
                this.currentEditor?.setContent(notes[i].content);
            }
        }
    }
}