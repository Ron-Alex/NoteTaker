//all functions for the NoteList including Drag and Drop
import { Note } from "../models/Note.js";

export class NoteList{
    private notes: Note[] = [];
    private noteContainer: HTMLElement;

    constructor(noteContainer: HTMLElement){ 
        this.noteContainer = noteContainer;
    }

    render(notes: Note[]): void{
        this.notes = notes;
        this.noteContainer.innerHTML = '';
        this.notes.forEach(note => this.renderNote(note));
    }

    renderNote(note: Note): void{
        const noteDiv = document.createElement("div");
        noteDiv.className = "note-item";
        noteDiv.dataset.id = note.storedID;
        this.noteContainer.appendChild(noteDiv);
    }
}