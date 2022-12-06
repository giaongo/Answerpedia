(async () => {
    'use strict';
    const url = 'http://localhost:4000'; //Change when uploading to server 
    const navLogOut = document.querySelector(".navLogOut"); 
    const navEditProfile = document.querySelector(".navEditProfile");
    // Check sessionStorage
    if (!sessionStorage.getItem('token') || !sessionStorage.getItem('user')) {
        console.log("user is not logged in yet");
        location.href = 'login.html';
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
            const json = await response.json();
            sessionStorage.setItem('user', JSON.stringify(json.user));
            console.log("user is logged in");
            navLogOut.style.display = "inline-block";
            navEditProfile.style.display = "inline-block";
        }
    } catch (e) {
        console.log(e.message);
    }
})();