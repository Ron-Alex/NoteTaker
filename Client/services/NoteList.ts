//all functions for the NoteList including Drag and Drop
import { Note } from "../models/Note.js";
import { TempEditor } from "../Editor/TempEditor.js";

export class NoteList{
    private noteContainer: HTMLElement;
    private tempEditor = new TempEditor;

    constructor(noteContainer: HTMLElement){ 
        this.noteContainer = noteContainer;
    }

    deleteNoteDiv(noteDiv: HTMLDivElement): void{
        noteDiv.remove();
    }

    clearNotes(notes: HTMLElement[]): void{
        for(let item of notes) {
            item.remove();
        }
    }

    render(notes: Note[]): void{
        this.noteContainer.innerHTML = '';
        notes.forEach(note => this.renderNote(note));
    }

    renderNote(note: Note): void{
        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note-item", "addedNote");
        noteDiv.dataset.id = note.storedID;
        noteDiv.innerHTML = this.tempEditor.returnHTMLFromObj(note.content);
        this.noteContainer.appendChild(noteDiv);
    }
}