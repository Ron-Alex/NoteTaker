import { StorageService } from "./StorageService.js";

export class BackGroundService{
    private isDark: boolean = false;

    constructor(){
        this.isDark = (StorageService.getTheme() === "1" ? true : false);
        this.applyTheme();
    }

    //use of Initialize??
    private applyTheme(): void{ 
        const body = document.querySelector(".docBody");
        const themeSwitch = document.querySelector(".themeToggle") as HTMLInputElement;
        if(this.isDark){
            body?.classList.add("bodyDarkMode");
            themeSwitch.checked = true;
        }
        else{
            body?.classList.remove("bodyDarkMode");
            themeSwitch.checked = false;
        }
    }

    toggleTheme(): void{
        this.isDark = !this.isDark;
        StorageService.saveTheme(this.isDark);
        this.applyTheme();
    }

    returnTheme(): boolean{
        return this.isDark;
    }

}