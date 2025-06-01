// const addButton = document.body.getElementsByClassName("addButton")[0];
const mainContent = document.body.getElementsByClassName("mainContent")[0];
// const noteAdded = document.getElementsByClassName("addedNote");
const searchBar = document.getElementsByClassName("searchBar")[0];
const darkModeToggle = (<HTMLInputElement>document.getElementsByClassName("themeToggle")[0]);
const mainPage = document.getElementsByClassName("mainPage")[0];

declare var Quill: any;

interface saveData {
    ops: {
        0: {
            insert: string;
        }
    },
    storedID: string
}

const editorForLoading = (saveData: any) => {
    const tempDiv = document.createElement("div");
    const tempQuill = new Quill(tempDiv, {
        theme: 'snow'
    });
    tempQuill.setContents(saveData);
    const HTMLData = tempQuill.getSemanticHTML();
    return HTMLData;
}

const createSubmitButton = () => {
    const submitButton = document.createElement("button");
    submitButton.setAttribute("class", "submitButton");
    submitButton.textContent = "Submit";
    mainPage.getElementsByClassName("cancelBtn")[0].insertAdjacentElement('afterend', submitButton);
}

function removeInputCancelSubmitBtn() //removal of input bar and cancel button after note addded/cancel button clicked - called in addNote func
{
    document.getElementById("editor")!.remove();
    document.getElementsByClassName("ql-toolbar")[0].remove();
    mainPage.getElementsByClassName("cancelBtn")[0].remove();
    mainPage.getElementsByClassName("submitButton")[0].remove();
    const newAddButton = document.createElement("button");
    newAddButton.setAttribute("class", "addButton");
    newAddButton.textContent = "Add Note";
    mainContent.insertAdjacentElement("afterend", newAddButton);
}

const addJSONNote = (saveData: saveData) => { //add JSON array to localStorage
    let local: string[] = [];
    const localNote = localStorage.getItem("notes");
    const noteToBeAdded = JSON.stringify(saveData); 
    if(localNote) local = JSON.parse(localNote);
    local.push(noteToBeAdded);
    const noteToBePushed = JSON.stringify(local);
    localStorage.setItem("notes", noteToBePushed);
    // const allNotes = mainContent.querySelectorAll("p");
    // allNotes[allNotes.length - 1].classList.add("addedNote");
    // allNotes[allNotes.length - 1].setAttribute("draggable", "true");
}   

const addNotePrep = (saveData: saveData, htmlData: string) => {
    // const parsedData = JSON.parse(saveData);
    console.log(saveData);
    if(saveData.ops[0].insert === "\n")
    {
        alert("Input cannot be empty");
        return;
    }
    const noteArea = document.createElement("div");
    noteArea.setAttribute("draggable", "true");
    console.log(saveData);
    const localNote = localStorage.getItem("notes");
    if(!localNote)
    {
        localStorage.setItem("noteNum", "0");
    }
    let noteNumStr = localStorage.getItem("noteNum")!;
    let noteNum = parseInt(noteNumStr);
    saveData.storedID = '' + noteNum;
    noteArea.setAttribute("data-id", saveData.storedID);
    noteNum += 1;
    localStorage.setItem("noteNum", '' + noteNum);
    mainContent.appendChild(noteArea);
    noteArea.innerHTML += htmlData;
    noteArea.setAttribute("class", "addedNote")

    // const allNotes = mainContent.querySelectorAll("p");
    // allNotes[allNotes.length - 1].classList.add("addedNote");
    // allNotes[allNotes.length - 1].setAttribute("draggable", "true");
    addJSONNote(saveData);
    removeInputCancelSubmitBtn();
}

const loadingJSONNote = () => { //load all notes from Local Storage
    const localNote = localStorage.getItem("notes");
    let delta: any = [];
    if(localNote) {
        delta = JSON.parse(localNote);
    }
    else
    {
        return;
    }
    // const tempDiv = document.createElement("div");
    // document.body.appendChild(tempDiv);
    // const tempQuill = new Quill(tempDiv, {
    //     theme: 'snow'
    // });
    for(let i = 0; i < delta.length; i++)
    {
        const deltaObj = JSON.parse(delta[i]);
        // console.log(delta[i]);
        const ops = deltaObj.ops;
        const noteNum = localStorage.getItem("noteNum");
        // tempQuill.setContents(ops);
        const JSONElement = editorForLoading(ops);
        const newNoteArea = document.createElement("div");
        newNoteArea.setAttribute("class", "addedNote");
        newNoteArea.setAttribute("draggable", "true");
        newNoteArea.setAttribute("data-id", '' + deltaObj.storedID);
        mainContent.appendChild(newNoteArea);
        newNoteArea.innerHTML += JSONElement;
    }

    // const allNotes = mainContent.querySelectorAll("p");
    // for(let i = 0; i < allNotes.length; i++)
    // {
    //     allNotes[i].classList.add("addedNote");
    //     allNotes[i].setAttribute("draggable", "true");
    // }
}

 //initialize quill editor and add it to #editor
 /* = new Quill('#editor', {
    theme: 'snow'
});*/

const setTheme = () => { //load site theme from localStorage
    const themeNum = localStorage.getItem("theme");
    if(themeNum === "1")
    {
        document.getElementsByClassName("docBody")[0].classList.toggle("bodyDarkMode");
        darkModeToggle.checked = true;
        return;
    }
}

// function addingFromLocal() //render all notes from localstorage
// {
//     let notes: string[]  = [];
//     const storedNotes = localStorage.getItem("notes");
//     if(storedNotes)
//     {
//         notes = JSON.parse(storedNotes) as string[];
//     }
//     for(let i = 0; i < notes.length; i++)
//     {
//         let localNote = document.createElement("p");
//         localNote.textContent = notes[i];
//         localNote.setAttribute("class", "addedNote");
//         localNote.setAttribute("draggable", "true");
//         mainContent.appendChild(localNote);
//         // mainPage.insertBefore(localNote, addButton);
//     }
// } 

// function addingToLocal(noteValue: string) //adding to localstorage - called at addNote func
// {
//     let notes: string[] = [];
//     const storedNotes = localStorage.getItem("notes");
//     if(storedNotes)
//     {
//         notes = JSON.parse(storedNotes) as string[];
//     }
//     notes.push(noteValue);
//     localStorage.setItem("notes", JSON.stringify(notes));
// }



// function addNote() //adding Note - create inout, cancel button, render added note
// {
//     const noteValue: string = (<HTMLInputElement>mainPage.getElementsByClassName("textInput")[0]).value;
//     console.log(noteValue);
//     if(noteValue == null || noteValue == "")
//     {
//         alert("Input cannot be empty");
//         return;
//     }
//     const addedNote = document.createElement("p");
//     addedNote.setAttribute("class", "addedNote")
//     addedNote.setAttribute("draggable", "true");
//     addedNote.textContent = noteValue;
//     addingToLocal(noteValue);
//     mainContent.appendChild(addedNote);
//     // mainPage.insertBefore(addedNote, addButton);
//     removeInputCancelSubmitBtn();
// }

function createCancelBtn() //creating cancel button
{
    const cancelBtn = document.createElement("button");
    cancelBtn.setAttribute("class", "cancelBtn");
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", removeInputCancelSubmitBtn);
    mainPage.insertBefore(cancelBtn, mainPage.getElementsByClassName("addButton")[0]);
}

function addInput()  //creating input bar and call addNote if submitted
{
    // const textInput = document.createElement("input");
    // textInput.setAttribute("class", "textInput");
    // textInput.setAttribute("placeholder", "Add a Note");
    // addButton.textContent = "Add";
    // textInput.addEventListener("keydown", function(e) {
    //     if(e.key === "Enter"){
    //         addNote();
    //     }
    // })   
    // if(mainPage.getElementsByClassName("textInput").length > 0)
    // {   
    //     addNote();
    //     return;
    // }
    // mainPage.insertBefore(textInput, addButton);
    // textInput.focus();
    // createCancelBtn(); //Calls Cancel Button Func

    const textEditor = document.createElement("div");
    textEditor.setAttribute("id", "editor");
    mainPage.insertBefore(textEditor, mainPage.getElementsByClassName("addButton")[0]);
    const newQuill = new Quill(textEditor, {
        theme: 'snow'
    });
    createCancelBtn();
    createSubmitButton();
    mainPage.getElementsByClassName("addButton")[0].remove();
    textEditor.focus();


        //     const htmlData = newQuill.getSemanticHTML();
        // const saveData: object = newQuill.getContents();
    // textEditor.addEventListener("paste", (e) => {
    //     e.preventDefault();
    //     let text = e.clipboardData?.getData("text/plain");
 
    // } )

    const localNum = localStorage.getItem("noteNum");

    
    mainPage.getElementsByClassName("submitButton")[0].addEventListener("click", () => {
        const htmlData = newQuill.getSemanticHTML();
        const saveData = newQuill.getContents();
                console.log(htmlData);
                console.log(saveData);    
        addNotePrep(saveData, htmlData);
    });

    textEditor.addEventListener("keydown", (e) => {
    if(e.key === "Enter")
    {
                 const htmlData = newQuill.getSemanticHTML();
        const saveData = newQuill.getContents();
                console.log(htmlData);
                console.log(saveData);    
        addNotePrep(saveData, htmlData);
        newQuill.setText("");
    }
    })
}

loadingJSONNote();
// addingFromLocal();
setTheme();

mainPage.addEventListener("click", (e) => {
    const funcTarg = e.target as HTMLElement;
    if(funcTarg.classList.contains("addButton"))
    {
        addInput();
    }
}); //add Note button detector

mainContent.addEventListener("click", function(e) { //when addedNote is clicked, allow edits
    const funcTarg = e.target as HTMLElement;
    const parentNote = funcTarg.closest(".addedNote");
    if(!parentNote)
    {
        return;
    }
    const localNote = localStorage.getItem("notes");
    if(!localNote)
    {
        return;
    }
    const localNoteParsed = JSON.parse(localNote);
    const selectedDivIndex = parentNote.getAttribute('data-id');
    console.log(localNoteParsed);
    console.log(selectedDivIndex);
    // localNoteParsed.splice(selectedDivIndex, 1);
    for(let i = 0; i < localNoteParsed.length; i++)
        {
            const indivNote = JSON.parse(localNoteParsed[i]);
            if(selectedDivIndex === indivNote.storedID)
            {
                localNoteParsed.splice(i, 1);
            }
        }
    localStorage.setItem("notes", JSON.stringify(localNoteParsed));
    parentNote.remove();

    
});

searchBar.addEventListener("input", function(e: Event) { //when a change is detected on the search bar
    let allNotes = mainContent.getElementsByClassName("addedNote") as HTMLCollectionOf<HTMLElement>;
    let noteArray = Array.from(allNotes);
    for(let i = 0; i < noteArray.length; i++)
    {
        let caseInsNote: string = noteArray[i].textContent?.toLowerCase() || "";
        const funcWord = e.target as HTMLInputElement;
        let searchToLower: string = funcWord.value.toLowerCase();
        if(caseInsNote.search(searchToLower) == -1)
        {
            allNotes[i].style.display = "none";
        }
        else
        {
           allNotes[i].style.display = "";
        }
    }
})
darkModeToggle.addEventListener("change", function(e) { //Dark Mode toggle button is changed
    const body = document.getElementsByClassName("docBody")[0];
    body.classList.toggle("bodyDarkMode");
    if(body.classList.contains("bodyDarkMode"))
    {
        localStorage.setItem("theme", "1");
        darkModeToggle.checked = true;
    }
    else
    {
        localStorage.setItem("theme", "0");
        darkModeToggle.checked = false;
    }
})

let dragged: HTMLElement | null = null; //Initialize dragged element

mainContent.addEventListener("dragstart", (e: Event) => { //dragged element drag start
    const funcTarg = e.target as HTMLElement;
    if(funcTarg.classList.contains("addedNote"))
    {
        dragged = funcTarg;
    }
})


mainContent.addEventListener("dragover", (e) => { //dragged element drag over
    e.preventDefault();

})

mainContent.addEventListener("dragenter", (e) => { //when dragged element goes over an addedNote - enters area
    e.preventDefault();
    const funcTarg = e.target as HTMLElement;
    if(funcTarg.classList.contains("addedNote"))
    {
        funcTarg.classList.add("hoveredOver");
    }
})

mainContent.addEventListener("dragleave", (e) => { //when dragged element goes over an addedNote - leaves area
    e.preventDefault();
    const funcTarg = e.target as HTMLElement;
    if(funcTarg.classList.contains("addedNote"))
    {
        funcTarg.classList.remove("hoveredOver");
    }
})

mainContent.addEventListener("drop", (e: Event) => { //when dragged element is dropped over an addedNote
    e.preventDefault();
    const funcTarg = e.target as HTMLElement;
    if(funcTarg.classList.contains("addedNote") && e.target != dragged)
    {
        const bounding = funcTarg.getBoundingClientRect();
        const offset = (<MouseEvent>e).clientY - bounding.top;
        let local: string[] = [];
        const noteArray = localStorage.getItem("notes");
        if(!noteArray) return;
        local = JSON.parse(noteArray);

        const draggedText = dragged?.textContent || "";
        const droppedText = funcTarg.textContent || "";

        const draggedTextIndex = local.indexOf(draggedText);
        const droppedTextIndex = local.indexOf(droppedText);

        if(offset > bounding.height/2)
        {

            local.splice(droppedTextIndex + 1, 0, draggedText);
            if(draggedTextIndex < droppedTextIndex)
            {
                local.splice(draggedTextIndex, 1);
            }
            else
            {
                local.splice(draggedTextIndex + 1, 1);
            }
            funcTarg.insertAdjacentElement("afterend", dragged!);
        }
        else
        {
            local.splice(droppedTextIndex, 0 , draggedText);
            if(draggedTextIndex > droppedTextIndex)
            {
                local.splice(draggedTextIndex + 1, 1);
            }
            else
            {
                local.splice(draggedTextIndex, 1);
            }
            funcTarg.insertAdjacentElement("beforebegin", dragged!);
        }
        localStorage.setItem("notes", JSON.stringify(local));
    }
    funcTarg.classList.remove("hoveredOver");
})



// const secondSubmit: Element = document.getElementById('secondSubmit')!;
// secondSubmit.addEventListener("click", () => {
//     const saveData: object = quill.getContents();
//     console.log(saveData)
//     const htmlData = quill.getSemanticHTML();
//     mainContent.innerHTML += htmlData;
//     const allNotes = mainContent.querySelectorAll("p");
//     allNotes[allNotes.length - 1].classList.add("addedNote");
//     allNotes[allNotes.length - 1].setAttribute("draggable", "true");
//     addJSONNote(saveData);
// })