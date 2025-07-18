import { Note } from "../models/Note";
import { NoteObj } from "../models/NoteObj";
import { StorageService } from "./StorageService.js";

export class DBStorage{

    static async getAllNotes(): Promise<any>{
        const token =  StorageService.getToken();
        if(token){
            const notes = await fetch("http://localhost:4000/notes", {
                method: "get",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${token}`  //If token is null its handled in the backend
                }
            });
            if(!notes.ok) throw new Error("Failed to fetch notes");
            const rawData = await notes.json();
            // console.log(rawData);
            const parsedNotes = rawData.map((note: any) => ({
                storedID: note.storedid,
                content: JSON.parse(note.content),
                created: new Date(note.createddate),
                edited: new Date(note.editeddate)
            }));
            return parsedNotes;
        }
    }

    static async get_curr_Note(current_ID: string): Promise<Note> {
        const token = StorageService.getToken();
        const cur_Note = await fetch("http://localhost:4000/notes/" + current_ID, {
            method: 'get',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`  //If token is null its handled in the backend
            }
        });
        if(!cur_Note.ok){
            throw new Error("Failed to get note");
        }
        const parsedNote = await cur_Note.json();
        return {
            storedID: parsedNote[0].storedid,
            content: JSON.parse(parsedNote[0].content),
            created: new Date(parsedNote[0].createddate),
            edited: new Date(parsedNote[0].editeddate)
        };
    }

    static async delete_curr_Note(current_ID: string): Promise<void>{
        const token = StorageService.getToken();
        const response = await fetch("http://localhost:4000/notes/" + current_ID, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        if(!response.ok) throw new Error("Could not delete Note");
    }

    static async add_Note(newNote: Note): Promise<void>
    {
        const token = StorageService.getToken();
        const response = await fetch("http://localhost:4000/notes/", {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                storedid: newNote.storedID,
                content: newNote.content,
                createddate: newNote.created,
                editeddate: newNote.edited
            })
        })
        if(!response.ok) throw new Error("Could not create Note");
    }

    static async edit_Note(content: NoteObj, edited: Date, current_ID: string){
        const response = await fetch("http://localhost:4000/notes/" + current_ID, {
            method: "put",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: JSON.stringify(content),
                editeddate: edited
            })
        })
        if(!response.ok) throw new Error("Could not edit note");
    }
}