import { NoteObj } from "../models/NoteObj.js";
import { NoteEditor } from "./NoteEditor.js";

export class UIManager{

    private currentEditor: NoteEditor | null = null;
    private mode: string = "viewMode";
    private addButton: HTMLElement | null = null;
    private submitButton: HTMLElement | null = null;
    private cancelButton: HTMLElement | null = null;
    private editorContainer: HTMLElement | null = null;

    constructor() {
        this.initialize();
        this.setUpEvents();
    }

    private initialize(): void{
        this.addButton = document.querySelector(".addButton");
        const editorDiv = document.createElement("div");
        this.editorContainer = editorDiv;
    }

    setUpEvents(): void{
        document.addEventListener("click", (e) => {
            // const funcTarg = e.target as HTMLElement;
            // if(funcTarg.classList.contains("submitButton")){
            //     const newNote = this.currentEditor?.getContents();
            //     this.viewMode();
            // }
            // if(funcTarg.classList.contains("cancelButton")){
            //     this.viewMode();
            // }
        })
    }

    returnEditorObject(): NoteObj{
        const editorObj = this.currentEditor?.getContents()!;
        return editorObj;
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
        if(this.addButton) this.hideButton(this.addButton);
        
        if(this.editorContainer){
            this.currentEditor = new NoteEditor(this.editorContainer);
            this.currentEditor.showEditor();
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

}