"use strict";
const url = "http://localhost:4000";

const login = document.querySelector(".navLogIn");
const logout = document.querySelector(".navLogOut");
const signup = document.querySelector(".navSignUp");
const editProfile = document.querySelector(".navEditProfile");
const indexWrap = document.querySelector('#indexWrap');
const menuIcon = document.querySelector('.menuIcon');

/*Function to show top navigation bar after clicking at the menu icon*/
let count = 0;
const clickEvent = menuIcon.addEventListener('click', () => {
    count++;
    console.log('clicked');
    indexWrap.style.display = 'block';
    indexWrap.style.width = '100%';
    if (count % 2 == 0){
        indexWrap.style.display = 'none';
    }
});



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
const liveUser = JSON.parse(sessionStorage.getItem("user"));
console.log(liveUser.id);

const createUserCards = (users) =>{
  users.forEach((user) =>{
    if(user.id == liveUser.id){
      const imgDiv = document.querySelector("#profile-pic");
const infoDiv = document.querySelector("#profile-info");


    const img = document.createElement("img");
if (!user.picture_name) {
  img.src = "https://place-puppy.com/300x300";
} else {
  img.src = url + "/thumbnails/" + user.picture_name;
  img.alt = user.username;
}
img.style.height = "200px";
img.style.width = "200px";
img.classList.add("resp");
imgDiv.appendChild(img);

const headingUsername = document.createElement("h2");
headingUsername.id = 'headingUsername';
const username = document.createElement("p");
username.id = 'username';
const headingEmail = document.createElement("h2");
headingEmail.id = 'headingEmail';
const email = document.createElement("p");
email.id = 'email';
const headingBio = document.createElement("h2");
headingBio.id = 'headingBio';
const bio = document.createElement("p");
bio.id = 'bio';

headingUsername.textContent = "Username";
username.textContent = user.username;
headingEmail.textContent = "Email";
email.textContent = user.email;
headingBio.textContent = "User Bio";
bio.textContent = user.description;

if (bio.textContent == ''){
  bio.textContent = 'Write something here';
}

infoDiv.appendChild(headingUsername);
infoDiv.appendChild(username);
infoDiv.appendChild(headingEmail);
infoDiv.appendChild(email);
infoDiv.appendChild(headingBio);
infoDiv.appendChild(bio);

    };
  })
};


/**
 * For displaying the user details in the profile.html
 */

// AJAX call
const getUser = async () => {
  try {
    const fetchOptions = {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    
    const response = await fetch(url + '/user', fetchOptions);
    const users = await response.json();
    createUserCards(users);
  } catch (e) {
    console.log(e.message);
  }
};

getUser();

