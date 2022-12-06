"use strict";
const url = "http://localhost:4000";

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

let input = document.getElementById("inputTag");
let imageName = document.getElementById("imageName");

input.addEventListener("change", () => {
  let inputImage = document.querySelector("input[type=file]").files[0];

  imageName.innerText = inputImage.name;
});
