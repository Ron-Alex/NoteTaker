import { Note } from "../models/Note.js";
import { NoteObj } from "../models/NoteObj.js";
import { StorageService } from "./StorageService.js";

export class NoteService {
    private notes: Note[] = [];

    constructor(){
        this.notes = StorageService.loadNote();
    }

    addNote(content: NoteObj): Note{
        const note: Note = {
            storedID: crypto.randomUUID(),
            content: content,
            created: new Date(),
            edited: new Date()
        }
        this.notes.push(note);
        StorageService.setNote(this.notes);
        return note;
    }

    deleteNote(id: string): void{
        this.notes = this.notes.filter(note => note.storedID !== id);
        StorageService.setNote(this.notes);
    }

    getAllNotes(): Note[] {
        return StorageService.loadNote();
    }
}