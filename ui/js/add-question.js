"use strict";
const url = "http://localhost:4000"
const addQuestionForm = querySelector("#addQuestionForm");
const submitButton = querySelector("#submitNewQuestion");

submit.addEventListener("submit", async(event) => {
    event.preventDefault();
    const fd = new FormData(addQuestionForm);
    // TODO : Add session storage token when login works
    const fetchOptions = {
        method:"POST",
        headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
        body:fd
    };
    const response = await fetch(url + "/question",fetchOptions);
    const json = await response.json();
    // console.log(json);
    // alert(json.message);
    // location.href = "index.html";
})
