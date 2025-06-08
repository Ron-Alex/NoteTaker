import { NoteObj } from "../models/NoteObj";

export class TempEditor{
        returnHTMLFromObj(content: NoteObj): any{
        const tempDiv = document.createElement("div");
        const tempEditor = new Quill(tempDiv, {
            theme: 'snow'
        });
        tempEditor.setContents(content);
        
        const HTMLData = tempEditor.getSemanticHTML();
        return HTMLData;
    }
}