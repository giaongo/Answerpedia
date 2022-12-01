'use strict'
const url = 'http://127.0.0.1:5500/ui/' //Change url when uploading to server

//Select existing html element
const questionContainer = document.querySelector('.questionContainer');

//Create questions cards/sections inside allQuestion article
const createQuestionCards = (questions) => {
    //Clear questionList before appending new ones
    questionContainer.innerHTML = '';
    questions.forEach(question => {
        //Create elements with DOM methods
        const article = document.createElement('article');
        article.className = 'question';
        const questionP = document.createElement('p');
        const questionDiv = document.createElement('div');
        article.appendChild(questionP);
        questionP.innerText='Testing';
        article.appendChild(questionDiv);
        const questionDivH3 = document.createElement('h3');
        const questionDivP = document.createElement('p');
        questionDiv.appendChild(questionDivH3);
        questionDiv.appendChild(questionDivP);
        questionDivH3.innerText='Question Title';
        questionDivP.innerText = 'Question description';
        questionContainer.appendChild(article);
    });
    // questionContainer.appendChild(question);
    console.log(questionContainer.innerHTML);
}


createQuestionCards([
    {
    },
    {},
    {},
    {},
    {}
])