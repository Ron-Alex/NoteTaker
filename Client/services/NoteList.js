import { TempEditor } from "./TempEditor.js";
export class NoteList {
    constructor(noteContainer) {
        this.notes = [];
        this.tempEditor = new TempEditor;
        this.noteContainer = noteContainer;
    }
    deleteNoteDiv(noteDiv) {
        noteDiv.remove();
    }
    render(notes) {
        this.notes = notes;
        this.noteContainer.innerHTML = '';
        this.notes.forEach(note => this.renderNote(note));
    }
    renderNote(note) {
        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note-item", "addedNote");
        noteDiv.dataset.id = note.storedID;
        noteDiv.innerHTML = this.tempEditor.returnHTMLFromObj(note.content);
        this.noteContainer.appendChild(noteDiv);
    }
}
