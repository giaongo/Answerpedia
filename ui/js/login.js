'use strict';
// changed the url to localhost, sorry about that  
const url = 'localhost:4000'; //Change when uploading to server

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
    

    const response = await fetch(url + '/auth/login', fetchOptions);
    const json = await response.json();
    console.log('login response', json);
    if (!json.user) {
        alert(json.message);
    } else {
        //TODO: add save token code block here
        sessionStorage.setItem('token', json.token);
    sessionStorage.setItem('user', JSON.stringify(json.user));
    location.href = 'index.html';
    }
});

