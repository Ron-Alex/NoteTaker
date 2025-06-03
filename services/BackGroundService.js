import { StorageService } from "./StorageService.js";
export class BackGroundService {
    constructor() {
        this.isDark = false;
        this.isDark = StorageService.getTheme();
        this.applyTheme();
    }
    //use of Initialize??
    applyTheme() {
        const body = document.querySelector(".docBody");
        const themeSwitch = document.querySelector(".themeToggle");
        if (this.isDark) {
            body === null || body === void 0 ? void 0 : body.classList.add("bodyDarkMode");
            themeSwitch.checked = true;
        }
        else {
            body === null || body === void 0 ? void 0 : body.classList.remove("bodyDarkMode");
            themeSwitch.checked = false;
        }
    }
    toggleTheme() {
        this.isDark = !this.isDark;
        StorageService.saveTheme(this.isDark);
        this.applyTheme();
    }
    returnTheme() {
        return this.isDark;
    }
}
