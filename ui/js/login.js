'use strict';
const url = 'http://localhost:4000'; 

const logInForm = document.querySelector('#log-in-form');

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
        sessionStorage.setItem('token', json.token);
        sessionStorage.setItem('user', JSON.stringify(json.user));
        location.href = 'index.html';
    }
});

