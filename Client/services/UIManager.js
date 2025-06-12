import { NoteEditor } from "./NoteEditor.js";
import { StorageService } from "./StorageService.js";
import { TempEditor } from "./TempEditor.js";
export class UIManager {
    constructor() {
        this.currentEditor = null;
        this.mode = "viewMode";
        this.tempEditor = new TempEditor;
        this.contentEditable = true;
        this.buttons = {
            submit: null,
            cancel: null,
            accept: null,
            delete: null
        };
        this.addButton = null;
        this.editorContainer = null;
        this.editorParent = null;
        this.clickedNoteObj = null;
        this.buttonContainer = null;
        this.noteChange = "";
        this.initialize();
    }
    initialize() {
        this.addButton = document.querySelector(".addButton");
        this.editorContainer = document.createElement("div");
        this.currentEditor = new NoteEditor(this.editorContainer);
        this.makeButtonArea();
        this.buttons.submit = this.makeButton("Submit", "submitButton");
        this.buttons.cancel = this.makeButton("Cancel", "cancelButton");
        this.buttons.accept = this.makeButton("Accept", "acceptButton");
        this.buttons.delete = this.makeButton("Delete Note", "deleteButton");
    }
    makeButtonArea() {
        const newContainer = document.createElement("div");
        this.buttonContainer = newContainer;
    }
    removeButtonArea(buttonArea) {
        buttonArea.remove();
    }
    returnEditorObject() {
        var _a;
        const editorObj = (_a = this.currentEditor) === null || _a === void 0 ? void 0 : _a.getContents();
        return editorObj;
    }
    returnEditorHTML() {
        var _a;
        const editorObj = (_a = this.currentEditor) === null || _a === void 0 ? void 0 : _a.getHTML();
        return editorObj;
    }
    returnEditorText() {
        var _a;
        return (_a = this.currentEditor) === null || _a === void 0 ? void 0 : _a.getText();
    }
    makeButton(text, newClass) {
        const newButton = document.createElement('button');
        newButton.classList.add("bodyButton", newClass);
        newButton.textContent = text;
        return newButton;
    }
    killButton(button) {
        button.remove();
    }
    hideButton(button) {
        button.style.display = "none";
        return button;
    }
    viewButton(button) {
        button.style.display = "";
        return button;
    }
    insertMode() {
        var _a, _b, _c;
        if (this.mode === "insertMode")
            return;
        this.mode = "insertMode";
        this.editorParent = document.querySelector("#editorArea");
        if (this.addButton)
            this.hideButton(this.addButton);
        if (this.buttonContainer) {
            this.editorParent.insertAdjacentElement("afterend", this.buttonContainer);
        }
        if (this.editorContainer && this.buttons.cancel && this.buttons.submit) {
            (_a = this.buttonContainer) === null || _a === void 0 ? void 0 : _a.appendChild(this.buttons.cancel);
            (_b = this.buttonContainer) === null || _b === void 0 ? void 0 : _b.appendChild(this.buttons.submit);
        }
        if (this.editorContainer) {
            this.currentEditor.showEditor(this.editorParent);
            (_c = this.currentEditor) === null || _c === void 0 ? void 0 : _c.clear();
        }
    }
    viewMode() {
        var _a, _b, _c;
        if (this.mode === "viewMode")
            return;
        if (this.addButton)
            this.viewButton(this.addButton);
        this.contentEditable = true;
        if (this.buttonContainer)
            this.removeButtonArea(this.buttonContainer);
        if (this.mode === "insertMode") {
            this.mode = "viewMode";
            if (this.editorContainer) {
                (_a = this.currentEditor) === null || _a === void 0 ? void 0 : _a.clear();
                (_b = this.currentEditor) === null || _b === void 0 ? void 0 : _b.removeEditor();
            }
            if (this.buttons.cancel && this.buttons.submit) {
                this.killButton(this.buttons.cancel);
                this.killButton(this.buttons.submit);
            }
            if (this.buttonContainer)
                this.removeButtonArea(this.buttonContainer);
        }
        if (this.mode === "editorMode") {
            this.mode = "viewMode";
            if (this.buttons.delete && this.buttons.accept && this.buttons.cancel) {
                this.killButton(this.buttons.delete);
                this.killButton(this.buttons.accept);
                this.killButton(this.buttons.cancel);
            }
            (_c = this.currentEditor) === null || _c === void 0 ? void 0 : _c.removeEditor();
            if (this.clickedNoteObj) {
                this.editorParent.innerHTML = this.tempEditor.returnHTMLFromObj(this.clickedNoteObj);
            }
        }
    }
    editorMode(clickedNote) {
        var _a, _b, _c, _d, _e;
        if (this.mode === "editorMode")
            return;
        if (this.contentEditable === false)
            return;
        this.mode = "editorMode";
        this.editorParent = clickedNote;
        if (this.addButton)
            this.hideButton(this.addButton);
        const divID = clickedNote.getAttribute("data-id");
        if (divID)
            this.noteChange = divID;
        const notes = StorageService.loadNote();
        clickedNote.textContent = '';
        for (let i = 0; i < notes.length; i++) {
            if (divID === notes[i].storedID) {
                (_a = this.currentEditor) === null || _a === void 0 ? void 0 : _a.showEditor(this.editorParent);
                this.clickedNoteObj = notes[i].content;
                (_b = this.currentEditor) === null || _b === void 0 ? void 0 : _b.setContent(notes[i].content);
                break;
            }
        }
        if (this.buttonContainer)
            clickedNote.insertAdjacentElement('afterend', this.buttonContainer);
        if (this.buttons.cancel && this.buttons.accept && this.buttons.delete) {
            (_c = this.buttonContainer) === null || _c === void 0 ? void 0 : _c.appendChild(this.buttons.delete);
            (_d = this.buttonContainer) === null || _d === void 0 ? void 0 : _d.appendChild(this.buttons.cancel);
            (_e = this.buttonContainer) === null || _e === void 0 ? void 0 : _e.appendChild(this.buttons.accept);
        }
    }
    searchMode(searchedText) {
        var _a;
        console.log("Called");
        const allNotes = document.getElementsByClassName("addedNote");
        const lowerCaseSearch = searchedText.toLowerCase();
        for (let i = 0; i < allNotes.length; i++) {
            console.log("Looped");
            const lowerCaseNote = (_a = allNotes[i].textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            const note = allNotes[i];
            if (!(lowerCaseNote === null || lowerCaseNote === void 0 ? void 0 : lowerCaseNote.includes(lowerCaseSearch))) {
                note.style.display = "none";
            }
            else {
                note.style.display = "";
            }
        }
    }
}
