const movieForm = document.getElementById("movieForm");
const movieTitleInput = document.getElementById("movieTitle");
const movieInfoContainer = document.getElementById("movieInfo");
const resetBtn = document.getElementById("resetBtn");

const apiKey = "2493c63d2b1f119a80a5b73028cada5f"; // Replace with your actual API key

movieForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const movieTitle = movieTitleInput.value.trim();

  if (movieTitle !== "") {
    searchMovie(movieTitle);
  }
});

resetBtn.addEventListener("click", () => {
  movieForm.reset();
  movieInfoContainer.innerHTML = "";
});

async function searchMovie(title) {
  const cachedData = getCachedData(title);

  if (cachedData) {
    displayMovieInfo(cachedData);
  } else {
    const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${title}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const movie = data.results[0];
        displayMovieInfo(movie);

        // Cache the data in localStorage
        cacheData(title, movie);
      } else {
        movieInfoContainer.innerHTML = "<p>No results found.</p>";
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
}

function getCachedData(title) {
  const cachedData = localStorage.getItem(title);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  return null;
}

function cacheData(title, data) {
  localStorage.setItem(title, JSON.stringify(data));
}

function displayMovieInfo(movie) {
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  const movieInfo = `
        <h2>${movie.title}</h2>
        <img src="${imageUrl}" alt="${movie.title} Poster">
        <p>${movie.overview}</p>
        <p>Release Date: ${movie.release_date}</p>
        <p>Vote Average: ${movie.vote_average}</p>
    `;

  movieInfoContainer.innerHTML = movieInfo;
}
