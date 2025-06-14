import { Note } from "../models/Note";

export class DBStorage{
    static async getAllNotes(): Promise<any>{
        const notes = await fetch("http://localhost:4000/notes", {
            method: "get"
        });
        if(!notes.ok) throw new Error("Failed to fetch notes");
        const rawData = await notes.json();
        const parsedNotes = rawData.map((note: any) => ({
            ...note,
            content: JSON.parse(note.content)
        }));
        return parsedNotes;
    }
}   