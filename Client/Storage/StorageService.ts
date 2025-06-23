import { Note } from "../models/Note.js";

export class StorageService{
    private static NOTE_KEY = "notes";
    private static THEME_KEY = "theme";
    private static TOKEN_KEY = "jwt_token";

    static setNote(notes: Note[]): void {
        localStorage.setItem(this.NOTE_KEY, JSON.stringify(notes));
    }

    static loadNote(): Note[] {
        const data = localStorage.getItem(this.NOTE_KEY);
        return data ? JSON.parse(data) : [];
    }

    static saveTheme(isDark: boolean): void {
        localStorage.setItem(this.THEME_KEY, isDark ? '1' : '0');
    }

    static getTheme(): string{
        return localStorage.getItem("theme") || "false";
    }

    static saveToken(user_token: string): void{
        localStorage.setItem(this.TOKEN_KEY, user_token);
    }

    static getToken(): string | null{
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static clearToken(): void{
        localStorage.removeItem(this.TOKEN_KEY);
    }
}
 
