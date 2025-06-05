import { NoteObj } from "../models/NoteObj.js";
import { NoteEditor } from "./NoteEditor.js";
import { StorageService } from "./StorageService.js";
import { TempEditor } from "./TempEditor.js";

type Mode = "viewMode" | "insertMode" | "editorMode";

export class UIManager{

    private currentEditor: NoteEditor | null = null;
    private mode: Mode = "viewMode";
    private tempEditor = new TempEditor;

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

    constructor() {
        this.initialize();
    }

    private initialize(): void{
        this.addButton = document.querySelector(".addButton");
        this.editorContainer = document.createElement("div");
        this.currentEditor = new NoteEditor(this.editorContainer);
        this.makeButtonArea();

        this.buttons.submit = this.makeButton("Submit", "submitButton");
        this.buttons.cancel = this.makeButton("Cancel", "cancelButton");
        this.buttons.accept = this.makeButton("Accept", "acceptButton");
        this.buttons.delete = this.makeButton("Delete Note", "deleteButton");
    }

    makeButtonArea(): void{
        const newContainer = document.createElement("div");
        this.buttonContainer = newContainer;
    }

    removeButtonArea(buttonArea: HTMLElement):void{
        buttonArea.remove();
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
        if(this.addButton) this.hideButton(this.addButton);

        if(this.buttonContainer)
        {
            console.log("woo");
            this.editorParent.insertAdjacentElement("afterend", this.buttonContainer);
        }
        
        if(this.editorContainer && this.buttons.cancel && this.buttons.submit)
        {
            this.buttonContainer?.appendChild(this.buttons.cancel);
            this.buttonContainer?.appendChild(this.buttons.submit);
        }

        if(this.editorContainer){
            this.currentEditor!.showEditor(this.editorParent!);
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
            if(this.buttons.cancel && this.buttons.submit)
            {
                this.killButton(this.buttons.cancel);
                this.killButton(this.buttons.submit);
            }
        }
        if(this.mode === "editorMode")
        {
            this.mode = "viewMode";
            if(this.buttons.delete && this.buttons.accept && this.buttons.cancel)
            {
                this.killButton(this.buttons.delete);
                this.killButton(this.buttons.accept);
                this.killButton(this.buttons.cancel);
            }
            this.currentEditor?.removeEditor();
            if(this.clickedNoteObj)
            {
                this.editorParent!.innerHTML = this.tempEditor.returnHTMLFromObj(this.clickedNoteObj);
            }
        }
    }

    editorMode(clickedNote: HTMLElement): void{
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
        if(this.buttonContainer)
        clickedNote.insertAdjacentElement('afterend', this.buttonContainer)

        if(this.buttons.cancel && this.buttons.accept && this.buttons.delete)
        {
            this.buttonContainer?.appendChild(this.buttons.delete);
            this.buttonContainer?.appendChild(this.buttons.cancel);
            this.buttonContainer?.appendChild(this.buttons.accept);
        }
    }
}