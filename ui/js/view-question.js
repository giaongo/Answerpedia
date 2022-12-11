'use strict'

const url = "http://localhost:4000"

const questionContainer = document.querySelector('.questionContainer');
const answerContainer = document.querySelector('.answerContainer');
const imgGallery = document.querySelector('.imgGallery');
const answerForm = document.querySelector("#addAnswerForm");
const questionVoteNumber = document.querySelector('.questionVoteNumber');
const thumbsUp = document.querySelector('.thumbsUp');
const thumbsDown = document.querySelector('.thumbsDown');
let isSelected = false;


const getQParam = (param) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
}
const user = JSON.parse(sessionStorage.getItem('user'));

const createImgGallery = (question) => {
    const mainView = document.querySelector(".mainView");
    const sideView = document.querySelector(".sideView");
    
    question.question_media.forEach((media,index) => {
        if (question.question_media.length > 0){
            const mainViewImg = document.createElement("img");
            if(index === 0) {
                mainViewImg.src = url + "/" + media;
                mainView.alt = `Main Question Image ${index}`;
                mainViewImg.setAttribute("id","mainViewImg");
                mainView.appendChild(mainViewImg);
            } 
            const sideViewImg = document.createElement("img");
            sideViewImg.src = url + "/" + media;
            sideViewImg.alt = `Side Question Image ${index}`;
            sideView.appendChild(sideViewImg);
            sideViewImg.addEventListener("click",() => {
                document.getElementById("mainViewImg").src = url + "/" + media;
            })
        }
    })
};


const createTagDisplay = (question) => {
    const tagDisplay = document.querySelector("#tagDisplay");
    question.question_tag.forEach(tag => {
        const tagBox = document.createElement("div");
        tagBox.classList.add("tagBox");
        tagBox.innerText = tag;
        tagDisplay.appendChild(tagBox);

    })
} 

const createQuestionCard = (question) => {
    const titleText = document.querySelector("#questionTitle");
    titleText.innerText = question.question_title;
    
    const userImg = document.querySelector(".profileImg");
    if(question.question_user_picture) {
        userImg.src = url + "/thumbnails/" + question.question_user_picture;
    } else {
        userImg.src = "http://placekitten.com/200/300";
    }
    
    userImg.alt = question.question_user;
    
    const userName = document.querySelector(".username");
    userName.innerText = question.question_user;
    
    const qDate = document.querySelector(".questionDate");
    const formatDate = new Date(question.question_date);
    qDate.innerText = `asked on ${formatDate.toDateString()}`;

    const qContent = document.querySelector(".questionContentDisplay");
    qContent.innerText = question.question_content;

    createImgGallery(question);
    createTagDisplay(question);
    // getQuestionVoteNumber(question);

    // Modify/delete buttons is only visible to admin or question owner
    const modifyQuestion = document.querySelector("#modify");
    const deleteQuestion = document.querySelector("#delete");

    if(user.id === question.question_user_id || user.user_type_id === 1) {
        modifyQuestion.style.visibility = "visible";
        deleteQuestion.style.visibility = "visible";
        modifyQuestion.addEventListener("click", () => {
            location.href = `modify-question.html?id=${question.id}&title=${question.question_title}&content=${question.question_content}`
        })
        deleteQuestion.addEventListener("click", async() => {
            console.log("you clicked on delete button");
            const fetchOptions = {
                method:"DELETE",
                headers: {
                    Authorization:"Bearer " + sessionStorage.getItem("token"),
                }
            };
            const response = await fetch(url + "/question/" + question.id, fetchOptions);
            const json = await response.json();
            alert(json.message);
            location.href = "index.html"
        })
    }
}


const createAnswerContainer = (answer,aContainer) => {
    const answerBox = document.createElement("div");
    answerBox.classList.add("answerBox")
    
    // create profileContainer
    const profileContainer = document.createElement("figure");
    profileContainer.classList.add("profileContainer");

    const profileImg = document.createElement("img");
    profileImg.classList.add("profileImg");

    if(answer.answer_user_picture) {
        profileImg.src = url + "/thumbnails/" + answer.answer_user_picture;
    } else {
        profileImg.src = "http://placekitten.com/200/300";
    }
    
    profileImg.alt = answer.answer_user;

    const username = document.createElement("p");
    username.classList.add("username");
    username.innerText = answer.answer_user;
    profileContainer.append(profileImg,username);

    //  Create answerInfo container
    const answerInfo = document.createElement("div");
    answerInfo.classList.add("answerInfo");
    const answerDate = document.createElement("p");
    answerDate.classList.add("answerDate");
    const formatDate = new Date(answer.answer_date);
    answerDate.innerText = `Posted on ${formatDate.toDateString()}`;
    const answerContent = document.createElement("p");
    answerContent.classList.add("answerContent");
    answerContent.innerText = answer.answer_content;
    answerInfo.append(answerDate,answerContent);
    
    // Create image collection
    const imgCollection = document.createElement("div");
    imgCollection.classList.add("imgCollection");

    answer.answer_media.forEach(media => {
        const answerImg = document.createElement('img');
        answerImg.classList.add("answerImg");
        answerImg.src = url + "/" + media;
        answerImg.alt = `answer ${answer.id}`
        imgCollection.appendChild(answerImg)
    })

    //Create vote display for answer box
    const voteDisplay = document.createElement("div");
    voteDisplay.classList.add("voteDisplay");   

    const btnThumbsUp = document.createElement("button");
    btnThumbsUp.classList.add("thumbsUp");
    btnThumbsUp.innerHTML += '<i class="fa-regular fa-thumbs-up"></i>';

    const btnThumbsDown = document.createElement("button");
    btnThumbsDown.innerHTML += '<i class="fa-regular fa-thumbs-down"></i>';


    const answerVoteNumber = document.createElement("p");
    answerVoteNumber.className = 'answerVoteNumber';

    let answer_vote = !answer.answer_votes ? 0 : answer.answer_votes;
    answerVoteNumber.innerText = answer_vote;
    const answer_id = answer.answer_id;
    let likeBtnCount = 0, dislikeBtnCount = 0;

    btnThumbsUp.addEventListener('click', async() => {
        likeBtnCount++;
        (likeBtnCount % 2 != 0) ? 
            (btnThumbsUp.innerHTML = '<i class="fa-solid fa-thumbs-up"></i>', 
            answer_vote++) : 
            (btnThumbsUp.innerHTML = '<i class="fa-regular fa-thumbs-up"></i>',answer_vote--);
        answerVoteNumber.innerText = answer_vote;
        const fetchOptions = {
            method:"PUT",
            headers:{
            'Content-Type' : 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('token')
        },
            body: JSON.stringify({
                answer_id: answer_id,
                vote: answer_vote
            }),
        };
        const response = await fetch(url + '/answer/'+ answer_id + '/votes',fetchOptions);
        const json = await response.json();
        console.log(json);
    })


    btnThumbsDown.addEventListener('click', async() => {
        dislikeBtnCount++;
        (dislikeBtnCount % 2 != 0) ? 
            (btnThumbsDown.innerHTML = '<i class="fa-solid fa-thumbs-down"></i>',answer_vote--): 
            (btnThumbsDown.innerHTML = '<i class="fa-regular fa-thumbs-down"></i>',answer_vote++);
        answerVoteNumber.innerText = answer_vote;
        const fetchOptions = {
            method:"PUT",
            headers:{
            'Content-Type' : 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('token')
        },
            body: JSON.stringify({
                answer_id : answer_id,
                vote: answer_vote
            }),
        };
        const response = await fetch(url + '/answer/'+ answer_id + '/votes',fetchOptions);
        const json = await response.json();
        console.log(json);
    })



    voteDisplay.append(btnThumbsUp,btnThumbsDown,answerVoteNumber);
    answerBox.append(profileContainer,answerInfo,imgCollection,voteDisplay);
    aContainer.appendChild(answerBox);    
}

// Function to check whether question is marked as favourite
const checkQuestionMarkedFavourite = async(question_id) => {
    const fetchOptions = {
        headers:{
            Authorization: 'Bearer ' + sessionStorage.getItem('token')
        },
    }
    const response = await fetch(url + "/saved/" + user.id + "/" + question_id, fetchOptions);
    const json = await response.json();
    return json;
}

// Function to add question to favourite 
const addQuestionToFavourite = async (user_id,question_id) => {
    const data = {question_id,user_id}
    const fetchOptions = {
        method:"POST",
        headers:{
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('token')
        },
        body: JSON.stringify(data)
    };
    const response = await fetch(url + "/saved", fetchOptions);
    const json = await response.json();
    alert(json.message);
}

// Function to remove question from favourite 
const removeQuestionFromFavourite = async (user_id,question_id) => {
    const fetchOptions = {
        method:"DELETE",
        headers:{
            Authorization: 'Bearer ' + sessionStorage.getItem('token')
        },
    };
    const response = await fetch(url + "/saved/" + user_id + "/" + question_id, fetchOptions);
    const json = await response.json();
    alert(json.message);
}

// Function to add styling for heeart 
const stylingHeart = (markedFavourite) => {
    const heartIcon = document.querySelector(".fa-heart");
    if(markedFavourite) {
        heartIcon.classList.remove("fa-regular");
        heartIcon.classList.add("fa-solid");
    } else {
        heartIcon.classList.remove("fa-solid");
        heartIcon.classList.add("fa-regular");
    }
    
}

// Function to display heart icon button and register click event listener for the button
const displayFavoriteBtn = async(question_id) => {
    const favouriteBtn = document.querySelector("#favouriteBtn");
    let questionExistResult = await checkQuestionMarkedFavourite(question_id);
    stylingHeart(questionExistResult.question_exist);
    favouriteBtn.addEventListener("click", async() => {
        stylingHeart(!questionExistResult.question_exist);
        if(!questionExistResult.question_exist) {
            await addQuestionToFavourite(user.id.toString(), question_id);
        } else {
            await removeQuestionFromFavourite(user.id.toString(),question_id);    
        }
        questionExistResult.question_exist = !questionExistResult.question_exist;
    })
}

//Function to add styling for like button
const stylingLike = (marked) => {
    const likeIcon = document.querySelector('.fa-thumbs-up');
    if (marked){
        likeIcon.classList.remove('fa-regular');
        likeIcon.classList.add('fa-solid');
    } else {
        likeIcon.classList.remove('fa-solid');
        likeIcon.classList.add('fa-regular');
    }
}

//Function to add styling for dislike button
const stylingDislike = (marked) => {
    const dislikeIcon = document.querySelector('.fa-thumbs-down');
    if (marked){
        dislikeIcon.classList.remove('fa-regular');
        dislikeIcon.classList.add('fa-solid');
    } else {
        dislikeIcon.classList.remove('fa-solid');
        dislikeIcon.classList.add('fa-regular');
    }
}
 
// Main function of this js file to get question data from server and register event listeners
/*function for getting vote numbers from each questions */
const getQuestionVoteNumber = async() => {
    let likeBtnCount = 0, dislikeBtnCount = 0;
    const question_id = getQParam('id');
    try {
        const fetchOptions = {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const voteNumber = await fetch(url + '/question/' + question_id,fetchOptions);
        const response = await voteNumber.json();
        let question_vote = !response.question_votes ? 0 : response.question_votes;
        questionVoteNumber.innerText = question_vote;

        //event listener to increase the vote number and paste new value to backend database
        thumbsUp.addEventListener('click', async() => {
            likeBtnCount++;
            //Condition to check whether the button has been presses or not, if yes, icon turns into black color and vote number increase by 1. 
            //With second click, icon turns to normal and vote number return to original number
            (likeBtnCount % 2 != 0) ? 
                (stylingLike(true),question_vote++) : 
                (stylingLike(false),question_vote--);
            questionVoteNumber.innerText = question_vote;
            const fetchOptions = {
                method:"PUT",
                headers:{
                'Content-Type' : 'application/json',
                Authorization: 'Bearer ' + sessionStorage.getItem('token')
            },
                body: JSON.stringify({vote: question_vote}),
            };
            const response = await fetch(url + '/question/' + question_id + '/votes',fetchOptions);
            const json = await response.json();    
        })


        thumbsDown.addEventListener('click', async() => {
            dislikeBtnCount++;
            (dislikeBtnCount % 2 != 0) ? 
                (stylingDislike(true),question_vote--): 
                (stylingDislike(false),question_vote++);
            questionVoteNumber.innerText = question_vote;
            const fetchOptions = {
                method:"PUT",
                headers:{
                'Content-Type' : 'application/json',
                Authorization: 'Bearer ' + sessionStorage.getItem('token')
            },
                body: JSON.stringify({vote: question_vote}),
            };
            const response = await fetch(url + '/question/' + question_id + '/votes',fetchOptions);
            const json = await response.json();
            console.log(json);
        })
    } catch (error) {
        console.log("error: ", error.message);
    }
}


getQuestionVoteNumber();

const getQuestionById = async() => {
    const question_id = getQParam('id');
    try {
        const fetchOptions = {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const response = await fetch(url + "/question/" + question_id,fetchOptions);
        const question = await response.json();
        createQuestionCard(question);
        await displayFavoriteBtn(question_id);

        if(question.answer.length && question.answer[0].answer_id) {
            question.answer.forEach(answer => {
                const aContainer = document.querySelector(".answerContainer");
                createAnswerContainer(answer,aContainer);  
            })

        }
        answerForm.addEventListener("submit",async(event) => {
            event.preventDefault();
            const fd = new FormData(answerForm);
             const fetchOptions = {
                method:"POST",
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                },
                body:fd
            };
            console.log("test",fetchOptions.headers);
            const response = await fetch(url + "/question/" + question.id + "/answer",fetchOptions);
            const json = await response.json();
            alert(json.message);
            location.href = "view-question.html?id=" + question.id;
        })

    } catch(error) {
        console.log("error",error.message);
    }
}

getQuestionById()




