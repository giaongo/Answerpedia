'use strict';
const url = "http://localhost:4000";
const container = document.querySelector("#tagContainer");
const liveUser = JSON.parse(sessionStorage.getItem("user"));

const createTagCards = (tags) => {
    container.innerHTML = "";
    const heading = document.createElement("h1");
    heading.innerHTML= "Tags";
    container.append(heading);
    Object.keys(tags).forEach ((tag,i) => {

      const tagCard = document.createElement("div");
     tagCard.classList.add("tagCard");
      tagCard.innerHTML = `
	  <h2>No ${i+1}</h2>
          <section>
              <h1>Tag: ${tag}</h1>
              <h1>No of times tag used: ${tags[tag]}</h1>
          </section>
      `
      container.append(tagCard);
      tagCard.style.cursor = "pointer";
      tagCard.addEventListener("click", () => {
          location.href = "index.html";
      })

    });
  
  };


const getTags = async () => {
    try {
      const fetchOptions = {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      
      const response = await fetch(url + "/tag/", fetchOptions);
      const results = await response.json();
      const userTags = results[0];
      const userTagsSet = new Set();
      userTags.forEach (userTag => {
          userTagsSet.add(userTag.tag);
      })
      const counts = {};
      userTags.forEach(function(x){counts[x.tag] = (counts[x.tag] || 0) + 1;});
      
      console.log(counts);
      
      createTagCards(counts);
    } catch (e) {
      console.log(e.message);
    }
  };
  
  getTags();

