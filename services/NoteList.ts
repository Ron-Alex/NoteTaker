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
        noteDiv.classList.add("note-item", "addedNote");
        noteDiv.dataset.id = note.storedID;
        noteDiv.textContent = note.content.ops[0].insert;
        this.noteContainer.appendChild(noteDiv);
    }
}