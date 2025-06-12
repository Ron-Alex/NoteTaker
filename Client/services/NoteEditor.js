export class NoteEditor {
    constructor(nContainer) {
        this.container = nContainer;
    }
    initializeEditor() {
        this.quill = new Quill(this.container, {
            theme: 'snow'
        });
    }
    showEditor(newEditorDiv) {
        newEditorDiv.classList.add("editorElement");
        newEditorDiv.appendChild(this.container);
        this.initializeEditor();
    }
    removeEditor() {
        const toolbar = document.getElementsByClassName("ql-toolbar")[0];
        console.log(this.container, toolbar);
        this.destroy(this.container);
        this.destroy(toolbar);
    }
    getText() {
        return this.quill.getText();
    }
    setContent(content) {
        this.quill.setContents(content);
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
        if (!container) {
            console.warn("ALLAH");
        }
        container.remove();
    }
}
