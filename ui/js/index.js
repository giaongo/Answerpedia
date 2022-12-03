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
    questions.forEach(question => {
        const article = document.createElement('article');
        const questionP = document.createElement('p');
        const questionDiv = document.createElement('div');
        const questionDivH3 = document.createElement('h3');
        const questionDivP = document.createElement('p');
        const askedDate = document.createElement('p');

        article.classList.add("question");
        askedDate.classList.add("smallDate");

        const questionContent = question.question_content;
        questionP.innerText= question.id;
        questionDivH3.innerText= question.question_title;
        questionDivP.innerText = truncateText(questionContent) +"...";
        const date = new Date(question.question_date);
        askedDate.innerText = `asked on ${date.toDateString()} by ${question.question_user}` ;

        questionDiv.append(questionDivH3,questionDivP,askedDate);
        question.question_tag.forEach(tag => {
            const tagText = document.createElement("p");
            tagText.innerText = tag
            tagText.classList.add("questionTagBox");
            questionDiv.appendChild(tagText);
        })
        article.append(questionP,questionDiv);
        questionContainer.appendChild(article);

        article.addEventListener("click",() => {
            location.href = "view-question.html?id=" + question.id;
        })
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
    .sort((a,b) => measureOutput[b] - measureOutput[a])
    .reduce((acc,cur) => {
        acc[cur] = measureOutput[cur]
        return acc;
    },{});
    return sortingResult;
}

const createTopTagCards = (tags) => {
    Object.keys(tags).forEach(tag => {
        const tagP = document.createElement("p");
        tagP.innerText = `#${tag}: ${tags[tag]}`;
        topTags.appendChild(tagP)

    })

}

const getAllQuestion = async() => {
    try {
        const response = await fetch(url + "/question");
        const questions = await response.json();
        createQuestionCards(questions);
        createLegendaryQuestionCards(questions);
        const measureTags = await measureTag(questions);
        createTopTagCards(measureTags);
    } catch(error) {
        console.log("Error",error.message);
    }

};

getAllQuestion();
