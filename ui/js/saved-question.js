"use strict";
const url = "http://localhost:4000"


const user = JSON.parse(sessionStorage.getItem('user'));

const createQuestionCard = (favouriteQuestion) => {
    const savedQuestionContainer = document.querySelector("#savedQuestionContainer");
    const questionCard = document.createElement("div");
    questionCard.classList.add("questionCard");
    questionCard.innerHTML = `
        <h2>No ${favouriteQuestion.id}</h2>
        <section>
            <h3>${favouriteQuestion.question_title}</h3>
            <p>${favouriteQuestion.question_content}</p>
            <p>asked by ${favouriteQuestion.username}, on ${new Date(favouriteQuestion.date).toDateString()}</p>
        </section>
    `
    savedQuestionContainer.append(questionCard);
    questionCard.style.cursor = "pointer";
    questionCard.addEventListener("click", () => {
        location.href = "view-question.html?id=" + favouriteQuestion.id;
    })
}

const getFavouriteQuestions = async(user_id) => {
    const fetchOptions = {
        headers:{
            Authorization: 'Bearer ' + sessionStorage.getItem('token')
        },
    }
    const response = await fetch(url + "/saved/" + user_id,fetchOptions);
    const favouriteQuestions = await response.json();
    favouriteQuestions.forEach(favouriteQuestion => {
        createQuestionCard(favouriteQuestion)})

}
getFavouriteQuestions(user.id);