"use strict";
const url = "http://localhost:4000"
const modifyForm = document.querySelector("#modifyQuestionForm");
const editTitle = document.querySelector("#editTitle");
const editContent = document.querySelector("#editContent");

const getQParam = (param) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
}
const question_id = getQParam("id");
const question_title = getQParam("title");
const question_content = getQParam("content");

editTitle.value = question_title;
editContent.value = question_content;

modifyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = serializeJson(modifyForm);
    for (const [prop, value] of Object.entries(data)) {
        if (value === '') {
            delete data[prop];
        }
    }
    const fetchOptions = {
        method: "PUT",
        headers:{
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('token')
        },
        body:JSON.stringify(data),
    };

    console.log(fetchOptions);
    const response = await fetch(url + "/question/" + question_id,fetchOptions);
    const json = await response.json();
    if (json.error) {
        alert(json.error.message);
      } else {
        alert(json.message);
      }

     location.href = "view-question.html?id=" + question_id;
})

