"use strict";
const url = "http://localhost:4000";

const user = JSON.parse(sessionStorage.getItem("user"));
console.log("working on edit profile");
console.log(user);

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
const username = document.createElement("p");
const headingEmail = document.createElement("h2");
const email = document.createElement("p");
const headingBio = document.createElement("h2");
const bio = document.createElement("p");

headingUsername.textContent = "Username";
username.textContent = user.username;
headingEmail.textContent = "Email";
email.textContent = user.email;
headingBio.textContent = "User Bio";
bio.textContent = user.description;

infoDiv.appendChild(headingUsername);
infoDiv.appendChild(username);
infoDiv.appendChild(headingEmail);
infoDiv.appendChild(email);
infoDiv.appendChild(headingBio);
infoDiv.appendChild(bio);
