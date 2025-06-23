import { Note } from "../models/Note.js";
import { NoteObj } from "../models/NoteObj.js";
import { DBStorage } from "../Storage/DBStorage.js";
import { StorageService } from "../Storage/StorageService.js";

export class NoteService {

    makeNote(content: NoteObj): Note{
        const note: Note = {
            storedID: crypto.randomUUID(),
            content: content,
            created: new Date(),
            edited: new Date()
        }
        return note;
    }
    
    deleteDBNote(id: string): void{
        DBStorage.delete_curr_Note(id);
    }

    deleteLSNote(id: string): void{
        const notes = StorageService.loadNote();
        for (let index = 0; index < notes.length; index++) {
            if(notes[index].storedID === id){
                notes.splice(index, 1);
            }
        }
        StorageService.setNote(notes);
    }

    editNote(content: NoteObj, edited: Date, id: string){
        const notes = StorageService.loadNote();
        for (let index = 0; index < notes.length; index++) {
            if(notes[index].storedID === id){
                notes[index].content = content;
                notes[index].edited = edited;
            }
        }
        StorageService.setNote(notes);
    }

    hideNote(note: HTMLElement): void{
        note.style.display = "none";
    }

    showNote(note: HTMLElement): void{
        note.style.display = "";
    }
}