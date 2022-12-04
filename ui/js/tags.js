'use strict'
//Select existing HTML elements
const tagContainer = document.querySelector('#tagContainer');

//TODO tomorrow: add repsonsive for tags.html and check responsive for other pages



const createTagContainer = (tags) => {
    tagContainer.innerHTML = '';
    const tagH1 = document.createElement('h1');
    tagH1.innerText = 'List of tags';
    tagContainer.appendChild(tagH1);
    tags.forEach(tag => {
        //Create list of tags
        //TODO: fetch data as list of tag from back-end web server and display here
        //Code block is for illustration purporse only
        
        const tagCard = document.createElement('div');
        tagCard.className = 'tagCard';
        const tagCardH2 = document.createElement('h2');
        const tagContent = document.createElement('div');
        tagContent.className = 'tagContent';
        const tagContentH3 = document.createElement('h3');
        const tagContentBtn = document.createElement('button');


        //Assign value from JSON file tag for DOM elements
        tagCardH2.innerText =  '#' + tag.language;
        tagContentH3.innerText = 'Number of questions: ' + tag.quantity;
        tagContentBtn.innerText = 'View Questions';

        //Append list of tag into tag container

        tagContainer.appendChild(tagCard);
        tagCard.appendChild(tagCardH2);
        tagCard.appendChild(tagContent);
        tagContent.appendChild(tagContentH3);
        tagContent.appendChild(tagContentBtn);
    });
    
}
const exampleJson = 
[
	{
		language: "Javascript",
		quantity: 42
	},
	{
		language: "Python",
		quantity: 20
	},
	{
		language: "Nodejs",
		quantity: 150
	},
	{
		language: "Java",
		quantity: 420
	},
	{
		language: "Kotlin",
		quantity: 256
	},
	{
		language: "React",
		quantity: 320
	},
	{
		language: "Go",
		quantity: 5
	},
]

createTagContainer(exampleJson);