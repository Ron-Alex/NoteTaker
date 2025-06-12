export class StorageService {
    static setNote(notes) {
        localStorage.setItem(this.NOTE_KEY, JSON.stringify(notes));
    }
    static loadNote() {
        const data = localStorage.getItem(this.NOTE_KEY);
        return data ? JSON.parse(data) : [];
    }
    static saveTheme(isDark) {
        localStorage.setItem(this.THEME_KEY, isDark ? '1' : '0');
    }
    static getTheme() {
        return localStorage.getItem("theme") || "false";
    }
}
StorageService.NOTE_KEY = "notes";
StorageService.THEME_KEY = "theme";
