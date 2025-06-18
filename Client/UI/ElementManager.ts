export class ElementMananger{
    makeButton(text: string, newClass: string): HTMLElement{
        const newButton = document.createElement('button');
        newButton.classList.add("bodyButton", newClass);
        newButton.textContent = text;
        return newButton;
    }

    killButton(button: HTMLElement): void{
        button.remove();
    }

    hideButton(button: HTMLElement): HTMLElement{
        button.style.display = "none";
        return button;
    }

    viewButton(button: HTMLElement): HTMLElement{
        button.style.display = "";
        return button;
    }
    
    removeButtonArea(buttonArea: HTMLElement):void{
        buttonArea.remove();
    }
}