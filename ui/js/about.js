'use strict'
const url = 'http://localhost:4000'; 
const login = document.querySelector(".navLogIn");
const logout = document.querySelector(".navLogOut");
const signup = document.querySelector(".navSignUp");
/*  Un-registered user can view only index.html and about.html  
    Registered user and admin can view all pages, add questions and answers. 
    Below function is to check user login state. If user does not register and login => continute to
    let user view the page. If user has already registered and logged in => display logout on nav bar
*/
(async () => {
    // Check sessionStorage
    if (!sessionStorage.getItem('token') || !sessionStorage.getItem('user')) {
        console.log("This is unregistered user");
        return;
    }
    // Check if token is valid 
    try {
        const fetchOptions = {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        console.log(fetchOptions.headers);
        const response = await fetch(url + '/user/token', fetchOptions);
        if (!response.ok) {
            console.log((response));
            location.href = 'logout.html';
        } else {
            console.log("This is registered user");
            const json = await response.json();
            sessionStorage.setItem('user', JSON.stringify(json.user));
            login.style.visibility="hidden";
            signup.style.visibility="hidden";
            logout.style.display="inline-block";
            editProfile.style.display = "inline-block";
            logout.addEventListener("click",() => {
                console.log("clicked")
                location.href = 'logout.html';
            })
        }
    } catch (e) {
        console.log(e.message);
    }
})();