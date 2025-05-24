"use strict";
const addButton = document.body.getElementsByClassName("addButton")[0];
const mainContent = document.body.getElementsByClassName("mainContent")[0];
const noteAdded = document.getElementsByClassName("addedNote");
const searchBar = document.getElementsByClassName("searchBar")[0];
const darkModeToggle = document.getElementsByClassName("themeToggle")[0];
const quill = new Quill('#editor', {
    theme: 'snow'
});
const setTheme = () => {
    const themeNum = localStorage.getItem("theme");
    if (themeNum === "1") {
        document.getElementsByClassName("docBody")[0].classList.toggle("bodyDarkMode");
        darkModeToggle.checked = true;
        return;
    }
};
function addingFromLocal() {
    let notes = [];
    const storedNotes = localStorage.getItem("notes");
    if (storedNotes) {
        notes = JSON.parse(storedNotes);
    }
    for (let i = 0; i < notes.length; i++) {
        let localNote = document.createElement("p");
        localNote.textContent = notes[i];
        localNote.setAttribute("class", "addedNote");
        localNote.setAttribute("draggable", "true");
        mainContent.insertBefore(localNote, addButton);
    }
}
function addingToLocal(noteValue) {
    let notes = [];
    const storedNotes = localStorage.getItem("notes");
    if (storedNotes) {
        notes = JSON.parse(storedNotes);
    }
    notes.push(noteValue);
    localStorage.setItem("notes", JSON.stringify(notes));
}
function removeInputCancelBtn() {
    mainContent.getElementsByClassName("textInput")[0].remove();
    mainContent.getElementsByClassName("cancelBtn")[0].remove();
    addButton.textContent = "Add Note";
}
function addNote() {
    const noteValue = mainContent.getElementsByClassName("textInput")[0].value;
    if (noteValue == null || noteValue == "") {
        alert("Input cannot be empty");
        return;
    }
    const addedNote = document.createElement("p");
    addedNote.setAttribute("class", "addedNote");
    addedNote.setAttribute("draggable", "true");
    addedNote.textContent = noteValue;
    addingToLocal(noteValue);
    mainContent.insertBefore(addedNote, addButton);
    removeInputCancelBtn();
}
function createCancelBtn() {
    const cancelBtn = document.createElement("button");
    cancelBtn.setAttribute("class", "cancelBtn");
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", removeInputCancelBtn);
    mainContent.insertBefore(cancelBtn, addButton);
}
function addInput() {
    const textInput = document.createElement("input");
    textInput.setAttribute("class", "textInput");
    textInput.setAttribute("placeholder", "Add a Note");
    addButton.textContent = "Add";
    textInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            addNote();
        }
    });
    if (mainContent.getElementsByClassName("textInput").length > 0) {
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
mainContent.addEventListener("click", function (e) {
    const funcTarg = e.target;
    if (funcTarg.classList.contains("addedNote")) {
        let notes = [];
        const storedNotes = localStorage.getItem("notes");
        notes = JSON.parse(storedNotes);
        const index = notes.indexOf(funcTarg.textContent);
        if (index > -1) {
            notes.splice(index, 1);
        }
        localStorage.setItem("notes", JSON.stringify(notes));
        funcTarg.remove();
    }
});
searchBar.addEventListener("input", function (e) {
    var _a;
    let allNotes = mainContent.getElementsByClassName("addedNote");
    let noteArray = Array.from(allNotes);
    for (let i = 0; i < noteArray.length; i++) {
        let caseInsNote = ((_a = noteArray[i].textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "";
        const funcWord = e.target;
        let searchToLower = funcWord.value.toLowerCase();
        if (caseInsNote.search(searchToLower) == -1) {
            allNotes[i].style.display = "none";
        }
        else {
            allNotes[i].style.display = "";
        }
    }
});
darkModeToggle.addEventListener("change", function (e) {
    const body = document.getElementsByClassName("docBody")[0];
    body.classList.toggle("bodyDarkMode");
    if (body.classList.contains("bodyDarkMode")) {
        localStorage.setItem("theme", "1");
        darkModeToggle.checked = true;
    }
    else {
        localStorage.setItem("theme", "0");
        darkModeToggle.checked = false;
    }
});
let dragged = null;
mainContent.addEventListener("dragstart", (e) => {
    const funcTarg = e.target;
    if (funcTarg.classList.contains("addedNote")) {
        dragged = funcTarg;
    }
});
mainContent.addEventListener("dragover", (e) => {
    e.preventDefault();
});
mainContent.addEventListener("dragenter", (e) => {
    e.preventDefault();
    const funcTarg = e.target;
    if (funcTarg.classList.contains("addedNote")) {
        funcTarg.classList.add("hoveredOver");
    }
});
mainContent.addEventListener("dragleave", (e) => {
    e.preventDefault();
    const funcTarg = e.target;
    if (funcTarg.classList.contains("addedNote")) {
        funcTarg.classList.remove("hoveredOver");
    }
});
mainContent.addEventListener("drop", (e) => {
    e.preventDefault();
    const funcTarg = e.target;
    console.log(funcTarg);
    if (funcTarg.classList.contains("addedNote") && e.target != dragged) {
        const bounding = funcTarg.getBoundingClientRect();
        const offset = e.clientY - bounding.top;
        let local = [];
        const noteArray = localStorage.getItem("notes");
        if (!noteArray)
            return;
        local = JSON.parse(noteArray);
        const draggedText = (dragged === null || dragged === void 0 ? void 0 : dragged.textContent) || "";
        const droppedText = funcTarg.textContent || "";
        console.log(draggedText);
        console.log(droppedText);
        console.log(local);
        const draggedTextIndex = local.indexOf(draggedText);
        const droppedTextIndex = local.indexOf(droppedText);
        console.log(draggedTextIndex);
        console.log(droppedTextIndex);
        if (offset > bounding.height / 2) {
            local.splice(droppedTextIndex + 1, 0, draggedText);
            if (draggedTextIndex < droppedTextIndex) {
                local.splice(draggedTextIndex, 1);
            }
            else {
                local.splice(draggedTextIndex + 1, 1);
            }
            funcTarg.insertAdjacentElement("afterend", dragged);
        }
        else {
            local.splice(droppedTextIndex, 0, draggedText);
            if (draggedTextIndex > droppedTextIndex) {
                local.splice(draggedTextIndex + 1, 1);
            }
            else {
                local.splice(draggedTextIndex, 1);
            }
            funcTarg.insertAdjacentElement("beforebegin", dragged);
        }
        localStorage.setItem("notes", JSON.stringify(local));
    }
    funcTarg.classList.remove("hoveredOver");
});
