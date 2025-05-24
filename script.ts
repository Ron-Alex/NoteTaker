const addButton = document.body.getElementsByClassName("addButton")[0];
const mainContent = document.body.getElementsByClassName("mainContent")[0];
const noteAdded = document.getElementsByClassName("addedNote");
const searchBar = document.getElementsByClassName("searchBar")[0];
const darkModeToggle = (<HTMLInputElement>document.getElementsByClassName("themeToggle")[0]);

declare var Quill: any;
const quill = new Quill('#editor', {
    theme: 'snow'
});

const setTheme = () => {
    const themeNum = localStorage.getItem("theme");
    if(themeNum === "1")
    {
        document.getElementsByClassName("docBody")[0].classList.toggle("bodyDarkMode");
        darkModeToggle.checked = true;
        return;
    }
}

function addingFromLocal() //render all notes from localstorage
{
    let notes: string[]  = [];
    const storedNotes = localStorage.getItem("notes");
    if(storedNotes)
    {
        notes = JSON.parse(storedNotes) as string[];
    }
    for(let i = 0; i < notes.length; i++)
    {
        let localNote = document.createElement("p");
        localNote.textContent = notes[i];
        localNote.setAttribute("class", "addedNote");
        localNote.setAttribute("draggable", "true");
        mainContent.insertBefore(localNote, addButton);
    }
} 

function addingToLocal(noteValue: string) //adding to localstorage - called at addNote func
{
    let notes: string[] = [];
    const storedNotes = localStorage.getItem("notes");
    if(storedNotes)
    {
        notes = JSON.parse(storedNotes) as string[];
    }
    notes.push(noteValue);
    localStorage.setItem("notes", JSON.stringify(notes));
}

function removeInputCancelBtn() //removal of input bar and cancel button after note addded/cancel button clicked - called in addNote func
{
    mainContent.getElementsByClassName("textInput")[0].remove();
    mainContent.getElementsByClassName("cancelBtn")[0].remove();
    addButton.textContent = "Add Note";
}

function addNote() //adding Note - create inout, cancel button, render added note
{
    const noteValue: string = (<HTMLInputElement>mainContent.getElementsByClassName("textInput")[0]).value;
    if(noteValue == null || noteValue == "")
    {
        alert("Input cannot be empty");
        return;
    }
    const addedNote = document.createElement("p");
    addedNote.setAttribute("class", "addedNote")
    addedNote.setAttribute("draggable", "true");
    addedNote.textContent = noteValue;
    addingToLocal(noteValue);
    mainContent.insertBefore(addedNote, addButton);
    removeInputCancelBtn();
}

function createCancelBtn() //creating cancel button
{
    const cancelBtn = document.createElement("button");
    cancelBtn.setAttribute("class", "cancelBtn");
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", removeInputCancelBtn);
    mainContent.insertBefore(cancelBtn, addButton);
}

function addInput()  //creating input bar 
{
    const textInput = document.createElement("input");
    textInput.setAttribute("class", "textInput");
    textInput.setAttribute("placeholder", "Add a Note");
    addButton.textContent = "Add";
    textInput.addEventListener("keydown", function(e) {
        if(e.key === "Enter"){
            addNote();
        }
    })   
    if(mainContent.getElementsByClassName("textInput").length > 0)
    {   
        addNote();
        return;
    }
    mainContent.insertBefore(textInput, addButton);
    textInput.focus();
    createCancelBtn(); //Calls Cancel Button Func
}

addingFromLocal();
setTheme();

addButton.addEventListener("click", addInput);
mainContent.addEventListener("click", function(e) {
    const funcTarg = e.target as HTMLElement;
    if(funcTarg.classList.contains("addedNote"))
    {
        let notes = [];
        const storedNotes = localStorage.getItem("notes") as string;
        notes = JSON.parse(storedNotes);
        const index = notes.indexOf(funcTarg.textContent);
        if(index > -1)
        {
            notes.splice(index, 1);
        }
        localStorage.setItem("notes", JSON.stringify(notes));
        funcTarg.remove();
    }
});

searchBar.addEventListener("input", function(e: Event) {
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
darkModeToggle.addEventListener("change", function(e) {
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

let dragged: HTMLElement | null = null;

mainContent.addEventListener("dragstart", (e: Event) => {
    const funcTarg = e.target as HTMLElement;
    if(funcTarg.classList.contains("addedNote"))
    {
        dragged = funcTarg;
    }
})

mainContent.addEventListener("dragover", (e) => {
    e.preventDefault();

})

mainContent.addEventListener("dragenter", (e) => {
    e.preventDefault();
    const funcTarg = e.target as HTMLElement;
    if(funcTarg.classList.contains("addedNote"))
    {
        funcTarg.classList.add("hoveredOver");
    }
})

mainContent.addEventListener("dragleave", (e) => {
    e.preventDefault();
    const funcTarg = e.target as HTMLElement;
    if(funcTarg.classList.contains("addedNote"))
    {
        funcTarg.classList.remove("hoveredOver");
    }
})

mainContent.addEventListener("drop", (e: Event) => {
    e.preventDefault();
    const funcTarg = e.target as HTMLElement;
    console.log(funcTarg)
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

        console.log(draggedText);
        console.log(droppedText);
        console.log(local);

        const draggedTextIndex = local.indexOf(draggedText);
        const droppedTextIndex = local.indexOf(droppedText);

        console.log(draggedTextIndex);
        console.log(droppedTextIndex);

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