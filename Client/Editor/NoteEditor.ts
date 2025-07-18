import { NoteObj } from "../models/NoteObj";

declare const Quill: any;

export class NoteEditor{
    private quill: any;
    private container: HTMLElement;

    constructor(nContainer: HTMLElement){
        this.container = nContainer;
    }

    initializeEditor(): void{
        this.quill = new Quill(this.container, {
            theme: 'snow'
        })
    }

    showEditor(newEditorDiv: HTMLElement): void{
        newEditorDiv.classList.add("editorElement")
        newEditorDiv.appendChild(this.container);
        this.initializeEditor();
    }

    removeEditor(): void{
        const toolbar = document.getElementsByClassName("ql-toolbar")[0] as HTMLElement;
        this.destroy(this.container);
        this.destroy(toolbar);
    }

    getText(): string{
        return this.quill.getText();
    }

    setContent(content: NoteObj): void{
        this.quill.setContents(content);
    }

    getContents(): NoteObj{
        return this.quill.getContents();
    }

    getHTML(): string{
        return this.quill.getSemanticHTML();
    }

    clear(): void{
        this.quill.setText('');
    }

    destroy(container: HTMLElement): void{
        // if(!container)
        // {
        //     console.warn("ALLAH");
        // }
        container.remove();
    }
}