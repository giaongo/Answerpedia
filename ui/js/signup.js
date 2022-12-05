'use strict'
// changed the url to localhost, sorry about that  
const url = 'http://localhost:4000';



//Select existing html elements
const signUpForm = document.querySelector('#sign-up-form');


//submit register form
signUpForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    // const data = new serializeJson(signUpForm);
    const data = serializeJson(signUpForm);
    console.log(data);
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
        },
        body: JSON.stringify(data),
    };
    const response = await fetch(url + '/auth/register', fetchOptions);
    const json = await response.json();
    alert(json.message);
})