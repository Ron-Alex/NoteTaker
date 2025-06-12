import { StorageService } from "./StorageService";
export class BackGroundService {
    constructor() {
        this.theme = false;
        this.theme = StorageService.getTheme();
        this.initialize();
    }
    initialize() {
        var _a;
        if (this.theme)
            (_a = document.querySelector(".docBody")) === null || _a === void 0 ? void 0 : _a.classList.add(".bodyDarkMode");
    }
}
