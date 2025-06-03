export class NoteList {
    constructor(noteContainer) {
        this.notes = [];
        this.noteContainer = noteContainer;
    }
    render(notes) {
        this.notes = notes;
        this.noteContainer.innerHTML = '';
        this.notes.forEach(note => this.renderNote(note));
    }
    renderNote(note) {
        const noteDiv = document.createElement("div");
        noteDiv.className = "note-item";
        noteDiv.dataset.id = note.storedID;
        this.noteContainer.appendChild(noteDiv);
    }
}
