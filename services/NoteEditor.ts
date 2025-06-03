export class NoteEditor{
    private quill: any;
    private container: HTMLElement;

    constructor(container: HTMLElement){
        this.container = container;
    }

    initializeEditor(): void{
        this.quill = new Quill(this.container, {
        theme: 'snow'
        })
    };

    showEditor(): void{
        const editorArea: HTMLElement = document.querySelector("#editorArea")!;
        editorArea.appendChild(this.container);
        this.initializeEditor();
    }

    removeEditor(): void{
        const toolbar = document.getElementsByClassName("ql-toolbar")[0] as HTMLElement;
        this.destroy(this.container);
        this.destroy(toolbar);
    }

    getContents(): object{
        return this.quill.getContents();
    }

    getHTML(): string{
        return this.quill.getSemanticHTML();
    }

    clear(): void{
        this.quill.setText('');
    }

    destroy(container: HTMLElement): void{
        container.remove();
    }
}