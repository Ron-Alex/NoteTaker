import { NoteObj } from "../models/NoteObj";

declare const Quill: any;

export class TempEditor{ 
        returnHTMLFromObj(content: NoteObj): any{ //Change Content: any to delta
        const tempDiv = document.createElement("div");
        const tempEditor = new Quill(tempDiv, {
            theme: 'snow'
        });
        tempEditor.setContents(content);
        
        const HTMLData = tempEditor.getSemanticHTML();        
        return HTMLData;
    }
}