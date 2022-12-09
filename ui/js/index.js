'use strict'
const url = 'http://localhost:4000'; 

const questionContainer = document.querySelector('.questionContainer');
const legendaryContainer = document.querySelector('.legendaryContainer');
const topTags = document.querySelector('.topTags');
const login = document.querySelector(".navLogIn");
const logout = document.querySelector(".navLogOut");
const signup = document.querySelector(".navSignUp");
const menuIcon = document.querySelector('.menuIcon');
const editProfile = document.querySelector('.navEditProfile');
const indexWrap = document.querySelector('#indexWrap');

/*Function to show top navigation bar after clicking at the menu icon*/
let count = 1;
const clickEvent = menuIcon.addEventListener('click', () => {
    count++;
    console.log('clicked');
    if (count % 2 == 0){
        indexWrap.style.display = 'none';
    } else{
        indexWrap.style.display = 'block';
    }
});



/*  Un-registered user can view only index.html and about.html  
    Registered user and admin can view all pages, add questions and answers. 
    Below function is to check user login state. If user does not register and login => continute to
    let user view the page. If user has already registered and logged in => display logout on nav bar
*/
(async () => {
    // Check sessionStorage
    if (!sessionStorage.getItem('token') || !sessionStorage.getItem('user')) {
        console.log("This is unregistered user");
        logout.style.visibility = 'hidden';
        login.style.display = 'inline-block';
        signup.style.display = 'inline-block';
        editProfile.style.visibility = 'hidden';
        return;
    } else {
        
        try {
            const fetchOptions = {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                },
            };
            console.log(fetchOptions.headers);
            const response = await fetch(url + '/user/token', fetchOptions);
            if (!response.ok) {
                console.log((response));
                location.href = 'logout.html';
            } else {
                console.log("This is registered user");
                const json = await response.json();
                sessionStorage.setItem('user', JSON.stringify(json.user));
                login.style.display="none";
                signup.style.display="none";
                logout.style.display="inline-block";
                logout.addEventListener("click",() => {
                    console.log("clicked")
                    location.href = 'logout.html';
                })
            }
        } catch (e) {
            console.log(e.message);
        }
    }
})();


// This function is for truncating the text to max 100 chars only
const truncateText = (text) => {
    const maxCharLength = 100;
    return text.slice(0,maxCharLength);
}
//Create questions cards/sections inside allQuestion article
const createQuestionCards = (questions,searchValue = null) => {
    questionContainer.innerHTML = "";
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

// This function is for creating data for question legendary
const createLegendaryQuestionCards = (questions) => {
    questions.forEach(question => {
        const questionId = question.id
        legendaryContainer.innerHTML += 
        `<p class="legendaryQuestion">
            <a target="blank"href="${url + "/question/" + questionId}">Question ${questionId}</a>
        </p>`
    })
}

// This function is to get all question tags, count number of duplicated tags and sort tags by number
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

// This function is to create list of tags for the aside tag container
const createTopTagCards = (tags) => {
    Object.keys(tags).forEach(tag => {
        const tagP = document.createElement("p");
        tagP.innerText = `#${tag}: ${tags[tag]}`;
        topTags.appendChild(tagP)

    })
}

// This function is to filter out the question data based on the search input value
const searchFunction = (questions,inputValue) => {
    const splitInput = inputValue.split(" ");
    const foundData = [];
    // For each found question object => append to foundData array
    splitInput.forEach(input => {
        const result = questions
        .filter(question => {
            return question.question_title.toLowerCase().includes(input) 
            || question.question_content.toLowerCase().includes(input)
        })

        foundData.push(...result);
    })
    // Remove the duplicated question objects from the foundData array
    const filteredQuestion = Object.values(foundData.reduce((acc,cur) => {
        acc[cur.id] = acc[cur.id] || {
            id:cur.id,
            question_title:cur.question_title,
            question_content:cur.question_content,
            question_date:cur.question_date,
            question_votes:cur.question_vote,
            question_user:cur.question_user,
            question_user_picture:cur.question_user_picture,
            question_tag:cur.question_tag
        }
        return acc;
    },{}))
    return filteredQuestion;
}

// This function is to fetch all question data from server and display to UI
const getAllQuestion = async() => {
    try {
        const response = await fetch(url + "/question");
        const questions = await response.json();
        createQuestionCards(questions);
        createLegendaryQuestionCards(questions);
        const measureTags = await measureTag(questions);
        createTopTagCards(measureTags);

        const searchBar = document.querySelector("#searchQuestions");

        //Register keyup listener for input on searchBar
        searchBar.addEventListener("keyup",() => {
            const inputValue = searchBar.value.toLowerCase();
            const result = searchFunction(questions,inputValue);
            console.log("result is",result);
            createQuestionCards(result)
        });
    } catch(error) {
        console.log("Error",error.message);
    }
};


getAllQuestion();


