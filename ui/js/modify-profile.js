"use strict";
const url = "http://localhost:4000";

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
      logout.style.visibility = 'hidden';
      login.style.display = 'inline-block';
      signup.style.display = 'inline-block';
      editProfile.style.visibility = 'hidden'
      return;
  } else {
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
              login.style.display="none";
              signup.style.display="none";
              logout.style.display="inline-block";
              logout.addEventListener("click",() => {
                  console.log("clicked")
                  location.href = 'logout.html';
              })
          }
      } catch (e) {
          console.log(e.message);
      }
  }
})();


const user = JSON.parse(sessionStorage.getItem("user"));
console.log("working on edit profile");
console.log(user);

const imgDiv = document.querySelector("#modify-profile-img");
const infoDiv = document.querySelector("#profile-info");

const img = document.createElement("img");
if (!user.picture_name) {
  img.src = "https://place-puppy.com/300x300";
} else {
  img.src = url + "/thumbnails/" + user.picture_name;
  img.alt = user.username;
}

img.classList.add("resp");
imgDiv.appendChild(img);
