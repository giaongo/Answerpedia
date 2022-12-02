'use strict'
const url = 'http://127.0.0.1:5500/ui';

// const serializeJson = require("./serialize");



//Select existing html elements
const signUpForm = document.querySelector('#sign-up-form');


//submit register form
signUpForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = serializeJson(signUpForm);
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
        },
        body: JSON.stringify(data),
    };
    const response = await fetch(url + '/signup.html', fetchOptions);
    const json = await response.json();
    alert(json.message);
})