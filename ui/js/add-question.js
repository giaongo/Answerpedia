"use strict";
const url = "http://localhost:4000"
const addQuestionForm = document.querySelector("#addQuestionForm");

addQuestionForm.addEventListener("submit", async(event) => {
    event.preventDefault();
    const fd = new FormData(addQuestionForm);
    const fetchOptions = {
        method:"POST",
        headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
        body:fd
    };
    const response = await fetch(url + "/question",fetchOptions);
    const json = await response.json();
    alert(json.message);
    location.href = "index.html";
})
