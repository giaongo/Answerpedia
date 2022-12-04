'use strict'
const url = "http://localhost:4000"

const questionContainer = document.querySelector('.questionContainer');
const answerContainer = document.querySelector('.answerContainer');
const imgGallery = document.querySelector('.imgGallery');
const answerForm = document.querySelector("#addAnswerForm");

const getQParam = (param) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
}

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
    userImg.src = url + "/thumbnails/" + question.question_user_picture;
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

    const modifyQuestion = document.querySelector("#modify");
    const deleteQuestion = document.querySelector("#delete");
    modifyQuestion.addEventListener("click", () => {
        location.href = `modify-question.html?id=${question.id}&title=${question.question_title}&content=${question.question_content}`
    })


}

const createAnswerContainer = (answer,aContainer) => {
    const answerBox = document.createElement("div");
    answerBox.classList.add("answerBox")
    
    // create profileContainer
    const profileContainer = document.createElement("figure");
    profileContainer.classList.add("profileContainer");

    const profileImg = document.createElement("img");
    profileImg.classList.add("profileImg");

    profileImg.src = url + "/thumbnails/" + answer.answer_user_picture;
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
    console.log("voteDisplay",voteDisplay);

    const btnThumbsUp = document.createElement("button");
    btnThumbsUp.classList.add("thumbsUp");
    btnThumbsUp.innerHTML += '<i class="fa-regular fa-thumbs-up"></i>';

    const btnThumbsDown = document.createElement("button");
    btnThumbsDown.innerHTML += '<i class="fa-regular fa-thumbs-down"></i>';

    const voteNumber = document.createElement("p");
    voteNumber.className = 'voteNumber';
    voteNumber.innerText = '100K';

    voteDisplay.append(btnThumbsUp,btnThumbsDown,voteNumber);
    answerBox.append(profileContainer,answerInfo,imgCollection,voteDisplay);
    aContainer.appendChild(answerBox);    
}


// createAnswerContainer();

const getQuestionById = async() => {
    const question_id = getQParam('id');
    try {
        const response = await fetch(url + "/question/" + question_id);
        const question = await response.json();
        console.log(question);
        createQuestionCard(question);
        console.log("There are  answer", question.answer.length);
        if(question.answer.length && question.answer[0].answer_id) {
            question.answer.forEach(answer => {
                const aContainer = document.querySelector(".answerContainer");
                console.log("Comtainer",aContainer);
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


