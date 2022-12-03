'use strict'
const url = "http://localhost:4000"

const questionContainer = document.querySelector('.questionContainer');
const answerContainer = document.querySelector('.answerContainer');
const imgGallery = document.querySelector('.imgGallery');

const getQParam = (param) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
}

const createQuestionCard = (question) => {
    const h1 = document.querySelector("#questionTitle");
    h1.innerText = question.question_title;


}

const getQuestionById = async() => {
    const question_id = getQParam('id');
    try {
        const response = await fetch(url + "/question/" + question_id);
        const question = await response.json();
        console.log(question);
        createQuestionCard(question)
    } catch(error) {
        console.log("error",error.message);
    }
}

getQuestionById()



// //Create question view with DOM elements
// const createImgGallery = (questionImg) => {
//         //Clear div before appending new ones
//         imgGallery.innerHTML = ''
//         //Creating the main view for question view
//         const mainView = document.createElement('div');
//         mainView.className = 'mainView';
//         const mainViewImg = document.createElement('img');
//         mainViewImg.src = 'https://cdn.pixabay.com/photo/2022/11/23/18/06/colorful-7612604__480.png';


//         //Append mainView div to its container
//         imgGallery.appendChild(mainView);
//         mainView.appendChild(mainViewImg);


//         //Creating side view for question view
//         //TODO: write for each and fetch data type (img, videos, text) from answer and display here
//         //This code block is for illustration purpose only
//         const sideView = document.createElement('div');
//         sideView.className = 'sideView';
//         const sideViewImg1 = document.createElement('img');
//         sideViewImg1.src = 'https://cdn.pixabay.com/photo/2017/08/10/08/47/laptop-2620118__480.jpg';
//         const sideViewImg2 = document.createElement('img');
//         sideViewImg2.src = 'https://cdn.pixabay.com/photo/2012/10/29/15/36/ball-63527__480.jpg';

//         //Append sideView div to its container
//         imgGallery.appendChild(sideView);
//         sideView.appendChild(sideViewImg1);
//         sideView.appendChild(sideViewImg2);



//         //Creating tag display for question view
//         //TODO: write a forEach to create DOM element and append tags from each questions
//         //Current code block is just temporary/for illustration purposes
//         const tagDisplay = document.createElement('div');
//         tagDisplay.id = 'tagDisplay';
//         const tagBox1 = document.createElement('div');
//         tagBox1.className = 'tagBox';
//         const tagBoxP = document.createElement('p');
//         tagBoxP.innerText = 'Javascript';
//         const tagBox2 = document.createElement('div');
//         tagBox1.className = 'tagBox';
//         const tagBoxp = document.createElement('p');
//         tagBoxp.innerText = 'Nodejs';


//         //Append tagDisplay div and its content to container
//         imgGallery.appendChild(tagDisplay);
//         tagDisplay.appendChild(tagBox1);
//         tagDisplay.appendChild(tagBox2);
//         tagBox1.appendChild(tagBoxP);
//         tagBox2.appendChild(tagBoxp);


//         //Create vote display for question view
//         //TODO: write a forEach to create DOM element and fetch vote data from each question
//         //Current code block is just temporary/for illustration purposes
//         const voteDisplay = document.createElement('div');
//         voteDisplay.className = 'voteDisplay';
//         const btnThumbsUp = document.createElement('button');
//         btnThumbsUp.className = 'thumbsUp';
//         const btnThumbsUpIcon = document.createElement('i');
//         btnThumbsUpIcon.className = 'fa-regular fa-thumbs-up'
//         const btnThumbsDown = document.createElement('button');
//         btnThumbsDown.className = 'thumbsDown';
//         const btnThumbsDownIcon = document.createElement('i');
//         btnThumbsDownIcon.className = 'fa-regular fa-thumbs-down'
//         const voteNumber = document.createElement('p');
//         voteNumber.className = 'voteNumber';
//         voteNumber.innerText = '100K';


//         //Append voteDisplay and its content to container
//         imgGallery.appendChild(voteDisplay);
//         voteDisplay.appendChild(btnThumbsUp);
//         voteDisplay.appendChild(btnThumbsDown);
//         voteDisplay.appendChild(voteNumber);
//         btnThumbsUp.appendChild(btnThumbsUpIcon);
//         btnThumbsDown.appendChild(btnThumbsDownIcon);


//         //Create question modify/delete for question view
//         const questionModify = document.createElement('div');
//         questionModify.className = 'questionModify';
//         const btnModify = document.createElement('button');
//         btnModify.id = 'modify';
//         btnModify.innerText = 'Modify Question';
//         const btnDelete = document.createElement('button');
//         btnDelete.id = 'delete';
//         btnDelete.innerText = 'Delete Question';

//         //Append question modify div to container
//         imgGallery.appendChild(questionModify);
//         questionModify.appendChild(btnModify);
//         questionModify.appendChild(btnDelete);

// };

// createImgGallery();


// const createAnswerContainer = (answer) => {
//     answerContainer.innerHTML = '';

//     //Create answer box 
//     const answerBox = document.createElement('div');
//     answerBox.className = 'answerBox';


//     //Create figure that is insde answer box
//     const profileContainer = document.createElement('figure');
//     profileContainer.className = 'profileContainer';
//     const profileImg = document.createElement('img');
//     profileImg.className = 'profileImg';
//     profileImg.src = 'https://cdn.pixabay.com/photo/2022/04/16/01/36/woman-7135489_1280.jpg';
//     profileImg.alt = 'profile_image';
//     const username = document.createElement('p');
//     username.className = 'username';
//     username.innerText = 'Elena Soini';


//     //Append figure and its content to answer box
//     answerBox.appendChild(profileContainer);
//     profileContainer.appendChild(profileImg);
//     profileContainer.appendChild(username);


//     //Create answer information that is inside answer box
//     //TODO: fetch data real data from answer from database and display it inside this div section
//     //This code block is for illustration purpose only
//     const answerInfo = document.createElement('div');
//     answerInfo.className = 'answerInfo';
//     const answerDate = document.createElement('p');
//     answerDate.className = 'answerDate';
//     answerDate.innerText = 'Posted on 24/11/2022'
//     const answerContent = document.createElement('p');
//     answerContent.className = 'answerContent';
//     answerContent.innerText = 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source';


//     //Append answerInfo and its content to answer box
//     answerBox.appendChild(answerInfo);
//     answerInfo.appendChild(answerDate);
//     answerInfo.appendChild(answerContent);


//     //Create image collection for answer box
//     //TODO: write an for each and fetch data(media files, text, imgs, video,etc) from user answer and display here
//     //This code block is for illustration purpose only
//     const imgCollection = document.createElement('div');
//     imgCollection.className = 'imgCollection';
//     const answerImg = document.createElement('img');
//     answerImg.className = 'answerImg';
//     answerImg.src = 'https://cdn.pixabay.com/photo/2022/11/16/15/52/mushrooms-7596258_640.jpg';

//     //Append image collection into answer box
//     answerBox.appendChild(imgCollection);
//     imgCollection.appendChild(answerImg);


//     //Create vote display for answer box
//     const voteDisplay = document.createElement('div');
//     voteDisplay.className = 'voteDisplay';
//     const btnThumbsUp = document.createElement('button');
//     btnThumbsUp.className = 'thumbsUp';
//     const btnThumbsUpIcon = document.createElement('i');
//     btnThumbsUpIcon.className = 'fa-regular fa-thumbs-up'
//     const btnThumbsDown = document.createElement('button');
//     btnThumbsDown.className = 'thumbsDown';
//     const btnThumbsDownIcon = document.createElement('i');
//     btnThumbsDownIcon.className = 'fa-regular fa-thumbs-down'
//     const voteNumber = document.createElement('p');
//     voteNumber.className = 'voteNumber';
//     voteNumber.innerText = '100K';


//     //Append voteDisplay and its content to container
//     answerBox.appendChild(voteDisplay);
//     voteDisplay.appendChild(btnThumbsUp);
//     voteDisplay.appendChild(btnThumbsDown);
//     voteDisplay.appendChild(voteNumber);
//     btnThumbsUp.appendChild(btnThumbsUpIcon);
//     btnThumbsDown.appendChild(btnThumbsDownIcon);


//     //Append everything from answer box to answer container
//     answerContainer.appendChild(answerBox);
    
// }


// // createAnswerContainer();
