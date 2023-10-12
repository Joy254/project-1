document.getElementById("getBreedsButton").addEventListener("click", () => {
  fetchDogBreeds();
});

document.getElementById("searchButton").addEventListener("click", () => {
  searchDogBreed();
});

document.getElementById("backButton").addEventListener("click", () => {
  hideBreedList();
});

document.getElementById("clearSearchButton").addEventListener("click", () => {
  clearSearch();
});

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
      .catch(error => {
          hideLoadingIndicator();
          console.error('Error fetching dog breeds:', error);
      });
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