import { Note } from "../models/Note.js";

export class StorageService{
    // private static NOTE_KEY = "notes";
    private static THEME_KEY = "theme";

    // static setNote(notes: Note[]): void {
    //     localStorage.setItem(this.NOTE_KEY, JSON.stringify(notes));
    // }

    // static loadNote(): Note[] {
    //     const data = localStorage.getItem(this.NOTE_KEY);
    //     return data ? JSON.parse(data) : [];
    // }

    static saveTheme(isDark: boolean): void {
        localStorage.setItem(this.THEME_KEY, isDark ? '1' : '0');
    }

    static getTheme(): string{
        return localStorage.getItem("theme") || "false";
    }
}
 
