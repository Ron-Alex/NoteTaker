import { NoteEditor } from "./NoteEditor.js";

export class UIManager{

    private currentEditor: NoteEditor | null = null;

    makeButton(btnType: string, addClass: string): HTMLElement{
        const newBtn = document.createElement("button");
        newBtn.classList.add("bodyButton", addClass);
        newBtn.textContent = btnType;
        return newBtn;
    }

    removeButton(btn: HTMLElement): void{
        btn.remove();
    }

    insertMode(){
        const editorContainer = document.createElement("div");
        this.currentEditor = new NoteEditor(editorContainer);
        this.currentEditor?.showEditor();
        editorContainer.insertAdjacentElement("afterend", this.makeButton("Submit", "submitButton"));
        editorContainer.insertAdjacentElement("afterend", this.makeButton("Cancel", "cancelButton"));
        this.removeButton(document.querySelector(".addButton")!);
    }
}