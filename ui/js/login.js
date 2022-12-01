'use strict';
const url = 'http://127.0.0.1:5500/ui'; //Change when uploading to server

const serializeJson = require("./serialize");

//select existing elements
const logInForm = document.querySelector('#log-in-form');


//log in
logInForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = serializeJson(logInForm);
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
        },
        body: JSON.stringify(data),
    };

    const response = await fetch(url + '/login/html', fetchOptions);
    const json = await response.json();
    console.log('login response', json);
    if (!json.user) {
        alert(json.message);
    } else {
        //TODO: add save token code block here
    }
});

