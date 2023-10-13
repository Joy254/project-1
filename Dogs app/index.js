document.addEventListener('DOMContentLoaded', (e) => {
  e.preventDefault()


  let getBreedsBtn=document.getElementById("getBreedsButton")
  getBreedsBtn.addEventListener("click",fetchDogBreeds);

  let searchButton=document.getElementById("searchButton")
  searchButton.addEventListener("click",searchDogBreed);

  let getBackButton=document.getElementById("backButton")
  getBackButton.addEventListener("click", hideBreedList)

function fetchDogBreeds() {
  showLoadingIndicator();
  fetch('https://dog.ceo/api/breeds/list/all')
      .then(response => response.json())
      .then(data => {
          const breeds = data.message;
          displayBreeds(breeds);
      })
      .catch(error => {
          hideLoadingIndicator();
          console.error('Error fetching dog breeds:', error);
      });
}

function searchDogBreed() {
  const breedSearchInput = document.getElementById("breedSearch");
  const searchTerm = breedSearchInput.value.toLowerCase();

  showLoadingIndicator();
  fetch('https://dog.ceo/api/breeds/list/all')
      .then(response => response.json())
      .then(data => {
          const breeds = data.message;
          const filteredBreeds = filterBreeds(breeds, searchTerm);
          displayBreeds(filteredBreeds);
      })

}

function filterBreeds(breeds, searchTerm) {
  const filteredBreeds = {};

  for (const breed in breeds) {
      if (breed.toLowerCase().includes(searchTerm) || breeds[breed].some(subBreed => subBreed.toLowerCase().includes(searchTerm)) || breed === searchTerm) {
          filteredBreeds[breed] = breeds[breed];
      }
  }

  return filteredBreeds;
}

function displayBreeds(breeds) {
  const breedList = document.getElementById("breedList");
  const backButton = document.getElementById("backButton");
  breedList.innerHTML = ""; // Clear previous content

  for (const breed in breeds) {
      if (breeds[breed].length === 0) {
          fetchRandomBreedImage(breed, breedList);
      } else {
          for (const subBreed of breeds[breed]) {
              fetchRandomBreedImage(subBreed + '/' + breed, breedList);
          }
      }
  }

  backButton.classList.remove("hidden");
}

function fetchRandomBreedImage(breedName, breedList) {
  fetch(`https://dog.ceo/api/breed/${breedName}/images/random`)
      .then(response => response.json())
      .then(data => {
          breedList.innerHTML += `
              <div class="breed-item">
                  <img src="${data.message}" alt="${breedName}">
                  <p>${breedName}</p>
              </div>`;
      })
      .catch(error => console.error('Error fetching breed image:', error));
}

function hideBreedList() {
  const breedList = document.getElementById("breedList");
  const backButton = document.getElementById("backButton");
  breedList.innerHTML = "";
  backButton.classList.add("hidden");
}

function clearSearch() {
  const breedSearchInput = document.getElementById("breedSearch");
  breedSearchInput.value = "";
  fetchDogBreeds(); // Fetch all breeds after clearing the search
}

function showLoadingIndicator() {
  const breedList = document.getElementById("breedList");
  breedList.innerHTML = '<p>Loading...</p>';
}

function hideLoadingIndicator() {
  const breedList = document.getElementById("breedList");
  breedList.innerHTML = '';
}
function commentSection(commentData) {
  //creating a div for the comment section 
  let commentDiv = document.createElement('div');
  //adding a bootstrap class
  commentDiv.classList.add('comment');
  //Adding the comment box
  let commentArea = document.createElement('p');
  commentArea.textContent = commentData.text;
  //creating a div for the buttons and added comments
  let actionsDiv = document.createElement('div');
  actionsDiv.classList.add('actions');
  //creating the edit button to edit comments
  let editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.classList.add('edit-button')};
  //Edit comment actions
  editButton.addEventListener('click', (e) => {
      e.preventDefault()
      editInput.classList.remove('hidden');
      editInput.value = commentData.text;
      editInput.addEventListener('keydown', (event) => {
          event.preventDefault()
          if (event.key === 'Enter') {
              //updating text
              let editedText = editInput.value;
              let commentId = commentData.id;
              //using PATCH to edit a comment from the server
              fetch(`http://localhost:3000/comments/${commentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: editedText }),
            })
            .then(response => response.json())
            .then(data => {
            })
            //catching error from server
            .catch(error => {
                console.error('Error:', error);
            });
            commentArea.textContent = editedText;
            editInput.classList.add('hidden');
                }
            });
        });

        function loadComments() {
          fetch('http://localhost:3000/comments')
          .then(response => response.json())
          .then(data => {
              data.forEach(commentData => {
                  const commentDiv = commentSection(commentData);
                  commentList.appendChild(commentDiv);
              });
          })
          //catching error from the server
          .catch(error => {
              console.error('Error:', error);
          });
      }

      commentSubmitButton.classList.add('btn', 'btn-primary');
      commentSubmitButton.addEventListener('click', (e) => {      
          e.preventDefault()
          //I used trim() to remove whitespace characters from the beginning and end of a string 
          const commentArea = commentInput.value.trim();
          if (commentArea !== '') {
              fetch('http://localhost:3000/comments', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ text: commentArea }),
              })
              .then(response => response.json())
              .then(commentData => {
                  const commentDiv = commentSection(commentData);
                  commentList.appendChild(commentDiv);
              })
              //catching error from the server
              .catch(error => {
                  console.error(error);
              });
              commentInput.value = '';
          }
      });
    });