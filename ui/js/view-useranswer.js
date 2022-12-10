'use strict';
const url = "http://localhost:4000";
const container = document.querySelector("#userAnswerContainer");
const liveUser = JSON.parse(sessionStorage.getItem("user"));

const truncateText = (text) => {
  const maxCharLength = 15;
  return text.slice(0,maxCharLength);
}

const createQuestionCards = (answers) => {
  container.innerHTML = "";
  const heading = document.createElement("h1");
  heading.innerHTML= "My answers";
  container.append(heading);
  answers.forEach ((answer,i) => {
    console.log(answer.user_id);
    
    const answerCard = document.createElement("div");
    answerCard.classList.add("answerCard");
    answerCard.innerHTML = `
        <h2>No ${i+1}</h2>
        <section>
            <h3>${answer.question_content}</h3>
            <p>${answer.answer_content}</p>
            <p>answered on ${new Date(answer.date).toDateString()}</p>
        </section>
    `
    container.append(answerCard);
    answerCard.style.cursor = "pointer";
    answerCard.addEventListener("click", () => {
        location.href = "view-question.html?id=" + answer.question_id;
    })
    
  });

};


//AJAX Call
const getAnswersByUser = async () => {
    try {
      const fetchOptions = {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      
      const response = await fetch(url + "/answer", fetchOptions);
      const result = await response.json();
      const answers = result[0];
      console.log(answers)
      createQuestionCards(answers);
    } catch (e) {
      console.log(e.message);
    }
  };
  
  getAnswersByUser();