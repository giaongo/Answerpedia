'use strict';
const url = "http://localhost:4000";
const container = document.querySelector("#userQuestionContainer");
const liveUser = JSON.parse(sessionStorage.getItem("user"));


const truncateText = (text) => {
  const maxCharLength = 100;
  return text.slice(0,maxCharLength);
}

const createQuestionCards = (questions) => {
  
  container.innerHTML = "";
  const heading = document.createElement('h1');
  heading.innerText = "My asked questions";
    container.append(heading);

  questions.forEach ((question,i) => {
    const article = document.createElement('article');
    const questionP = document.createElement('p');
    const questionDiv = document.createElement('div');
    const questionDivH3 = document.createElement('h3');
    const questionDivP = document.createElement('p');
    const askedDate = document.createElement('p');

    article.classList.add("question");
    askedDate.classList.add("smallDate");

    const questionContent = question.question_content;
    
    questionP.innerText= i+1;
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

    container.appendChild(article);

    article.addEventListener("click",() => {
        location.href = "view-question.html?id=" + question.id;
    })  
      
    
  });

};


//AJAX Call
const getQuestionsByUser = async () => {
    try {
      const fetchOptions = {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      
      const response = await fetch(url + "/question/byuser", fetchOptions);
      const questions = await response.json();
      console.log(questions);
      createQuestionCards(questions);
    } catch (e) {
      console.log(e.message);
    }
  };
  
  getQuestionsByUser();