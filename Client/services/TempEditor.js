export class TempEditor {
    returnHTMLFromObj(content) {
        const tempDiv = document.createElement("div");
        const tempEditor = new Quill(tempDiv, {
            theme: 'snow'
        });
        tempEditor.setContents(content);
        const HTMLData = tempEditor.getSemanticHTML();
        return HTMLData;
    }
}
