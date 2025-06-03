export class NoteEditor {
    constructor(container) {
        this.container = container;
    }
    initializeEditor() {
        this.quill = new Quill(this.container, {
            theme: 'snow'
        });
    }
    ;
    showEditor() {
        const editorArea = document.querySelector("#editorArea");
        editorArea.appendChild(this.container);
        this.initializeEditor();
    }
    removeEditor() {
        const toolbar = document.getElementsByClassName("ql-toolbar")[0];
        this.destroy(this.container);
        this.destroy(toolbar);
    }
    getContents() {
        return this.quill.getContents();
    }
    getHTML() {
        return this.quill.getSemanticHTML();
    }
    clear() {
        this.quill.setText('');
    }
    destroy(container) {
        container.remove();
    }
}
