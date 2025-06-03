import { NoteEditor } from "./NoteEditor.js";
export class UIManager {
    constructor() {
        this.currentEditor = null;
    }
    makeButton(btnType, addClass) {
        const newBtn = document.createElement("button");
        newBtn.classList.add("bodyButton", addClass);
        newBtn.textContent = btnType;
        return newBtn;
    }
    removeButton(btn) {
        btn.remove();
    }
    insertMode() {
        var _a;
        const editorContainer = document.createElement("div");
        this.currentEditor = new NoteEditor(editorContainer);
        (_a = this.currentEditor) === null || _a === void 0 ? void 0 : _a.showEditor();
        editorContainer.insertAdjacentElement("afterend", this.makeButton("Submit", "submitButton"));
        editorContainer.insertAdjacentElement("afterend", this.makeButton("Cancel", "cancelButton"));
        this.removeButton(document.querySelector(".addButton"));
    }
}
