"use strict";
const url = "http://localhost:4000"
const modifyForm = document.querySelector("#modifyQuestionForm");

const getQParam = (param) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
}
const question_id = getQParam("id");
console.log("form", modifyForm);


modifyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = serializeJson(modifyForm);
  // remove empty properties
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

