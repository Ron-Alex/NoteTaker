//all functions for the NoteList including Drag and Drop
import { Note } from "../models/Note.js";
import { TempEditor } from "./TempEditor.js";

export class NoteList{
    private notes: Note[] = [];
    private noteContainer: HTMLElement;
    private tempEditor = new TempEditor;

    constructor(noteContainer: HTMLElement){ 
        this.noteContainer = noteContainer;
    }

    deleteNoteDiv(noteDiv: HTMLDivElement): void{
        noteDiv.remove();
    }

    render(notes: Note[]): void{
        this.notes = notes;
        console.log(notes);
        this.noteContainer.innerHTML = '';
        this.notes.forEach(note => this.renderNote(note));
    }

    renderNote(note: Note): void{
        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note-item", "addedNote");
        noteDiv.dataset.id = note.storedID;
        noteDiv.innerHTML = this.tempEditor.returnHTMLFromObj(note.content);
        this.noteContainer.appendChild(noteDiv);
    }
}