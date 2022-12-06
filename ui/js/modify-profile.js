"use strict";
const url = "http://localhost:4000";

const modifyUserForm = document.querySelector('#modify-profile-form');
const user = JSON.parse(sessionStorage.getItem("user"));
console.log("working on edit profile");
console.log(user);


const infoDiv = document.querySelector("#profile-info");

console.log("working on edit profile");
const liveUser = JSON.parse(sessionStorage.getItem("user"));
console.log(liveUser.id);

const createUserCards = (users) =>{
  users.forEach((user) =>{
    if(user.id == liveUser.id){
      const imgDiv = document.querySelector("#modify-profile-img");
      // Displaying the pre saved image of the user
const img = document.createElement("img");
if (!user.picture_name) {
  img.src = "https://place-puppy.com/300x300";
} else {
  img.src = url + "/thumbnails/" + user.picture_name;
  img.alt = user.username;
}

img.classList.add("resp");
imgDiv.appendChild(img);
    };
  })
};



// For the upload picture button
let input = document.getElementById("inputTag");
let imageName = document.getElementById("imageName");

input.addEventListener("change", () => {
  let inputImage = document.querySelector("input[type=file]").files[0];

  imageName.innerText = inputImage.name;
});

// Catching the data inserted by the user
modifyUserForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = new FormData(modifyUserForm);
    // // remove empty properties
    for (const [prop, value] of Object.entries(data)) {
      if (value === '') {
        delete data[prop];
      }
    }
    const fetchOptions = {
      method: 'PUT',
      headers: {
        //Content Type has been removed because it does not let me upload picture for user
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
      body: data, // body data type must match "Content-Type" header
    };
  
    const response = await fetch(url + '/user/modify', fetchOptions);
    console.log(fetchOptions);
    const json = await response.json();
    if (json.error) {
      alert(json.error.message);
    } else {
      alert(json.message);
    }
    location.href = 'profile.html';
  });

  /**
   * For getting user from database to display the user picture
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

