'use strict'
const url = 'http://localhost:4000'; //Change url when uploading to server

//Select existing html element
const questionContainer = document.querySelector('.questionContainer');
const legendaryContainer = document.querySelector('.legendaryContainer');
const topTags = document.querySelector('.topTags');

const truncateText = (text) => {
    const maxCharLength = 100;
    return text.slice(0,maxCharLength);
}
//Create questions cards/sections inside allQuestion article
const createQuestionCards = (questions) => {
    //Clear questionList before appending new ones
    questionContainer.innerHTML = '';
    questions.forEach(question => {
        const questionContent = question.question_content;
        const article = document.createElement('article');
        article.classList.add("question");
        const questionP = document.createElement('p');
        questionP.innerText= question.id;
        const questionDiv = document.createElement('div');
        const questionDivH3 = document.createElement('h3');
        const questionDivP = document.createElement('p');
        const askedDate = document.createElement('p');
        askedDate.classList.add("smallDate");
        questionDivH3.innerText= question.question_title;
        questionDivP.innerText = truncateText(questionContent) +"...";
        const date = new Date(question.question_date);
        askedDate.innerText = `asked on ${date.toDateString()} by ${question.question_user}` ;
        questionDiv.append(questionDivH3,questionDivP,askedDate);
        article.append(questionP,questionDiv);
        questionContainer.appendChild(article);
    });
}

const createLegendaryQuestionCards = (questions) => {
    questions.forEach(question => {
        const questionId = question.id
        legendaryContainer.innerHTML += 
        `<p class="legendaryQuestion">
            <a target="blank"href="${url + "/question/" + questionId}">Question ${questionId}</a>
        </p>`
    })
}

const measureTag = async(questions) => {
    const tags = questions.map(question => question.question_tag);
    const tagSelection = [];
    tags.forEach(tag => {
        tag.forEach(element => tagSelection.push(element));
    });
    // count number of tag appearance per tag.
    const measureOutput = tagSelection.reduce((accumulator,current) => {
        if(Object.keys(accumulator).includes(current)) {
            ++accumulator[current];
        } else {
            accumulator[current] = 1;
        }
        return accumulator;
    },{})

    // Do the sorting for measure output value
    const sortingResult = Object.keys(measureOutput)
    .sort((a,b) => measureOutput[a] - measureOutput[b])
    .reduce((acc,cur) => {
        acc[cur] = measureOutput[cur]
        return acc;
    },{});
    return sortingResult;
}

const createTopTagCards = (tags) => {
    Object.keys(tags).forEach(tsg => {
        const tagP = document.createElement("p");



    })
    // topTags.innerHTML = '';
    // for (let i = 1; i <= 5; i++) {
    //     const topTagsP = document.createElement('p');
    //     topTagsP.innerText = "#Tags " + i;
    //     topTags.appendChild(topTagsP);
    // }


}

const getAllQuestion = async() => {
    try {
        const response = await fetch(url + "/question");
        const questions = await response.json();
        createQuestionCards(questions);
        createLegendaryQuestionCards(questions);
        await measureTag(questions);
    } catch(error) {
        console.log("Error",error.message);
    }

};

getAllQuestion();
