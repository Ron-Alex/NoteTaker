import { StorageService } from "./StorageService.js";
export class NoteService {
    constructor() {
        this.notes = [];
        this.notes = StorageService.loadNote();
    }
    addNote(content) {
        const note = {
            storedID: crypto.randomUUID(),
            content: content,
            created: new Date(),
            edited: new Date()
        };
        this.notes.push(note);
        StorageService.setNote(this.notes);
        return note;
    }
    deleteNote(id) {
        this.notes = this.notes.filter(note => note.storedID !== id);
        StorageService.setNote(this.notes);
    }
    hideNote(note) {
        note.style.display = "none";
    }
    showNote(note) {
        note.style.display = "";
    }
    getAllNotes() {
        return StorageService.loadNote();
    }
}
