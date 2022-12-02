'use strict'
// changed the url to localhost, sorry about that  
const url = 'localhost:4000';

// const serializeJson = require("./serialize");



//Select existing html elements
const signUpForm = document.querySelector('#sign-up-form');


//submit register form
signUpForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(signUpForm);
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
        },
        body: data,
    };
    const response = await fetch(url + '/auth/register', fetchOptions);
    const json = await response.json();
    alert(json.message);
})