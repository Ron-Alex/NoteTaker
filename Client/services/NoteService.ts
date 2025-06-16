import { Note } from "../models/Note.js";
import { NoteObj } from "../models/NoteObj.js";
import { DBStorage } from "./DBStorage.js";

export class NoteService {

    addNote(content: NoteObj): Note{
        const note: Note = {
            storedID: crypto.randomUUID(),
            content: content,
            created: new Date(),
            edited: new Date()
        }
        console.log(note);
        DBStorage.add_Note(note);
        return note;
    }

    deleteNote(id: string): void{
        DBStorage.delete_curr_Note(id);
    }

    hideNote(note: HTMLElement): void{
        note.style.display = "none";
    }

    showNote(note: HTMLElement): void{
        note.style.display = "";
    }
}