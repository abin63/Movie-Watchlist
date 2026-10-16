
const searchButton = document.getElementById("search-btn")
const searchInput = document.getElementById("search-movie")
const movieLists = document.querySelector(".movie-lists")
const introDetails = document.querySelector(".Intro-details")
const introDetailsWatchList = document.querySelector(".Intro-details-watchlist")
const watchListContainer = document.querySelector(".movie-lists-watchlist")

async function findMovie(query) {
    try {
        movieLists.innerHTML = ""
        const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=60c36440`)
        const data = await response.json()

        if(data.Response === "False") {
            console.log("No Results", data.Error)
            return []
        }

        const movies = data.Search
        console.log(movies)

        movies.forEach((movie) => {

            const movieEl = document.createElement("div")
            movieEl.classList.add("movie-list")

            movieEl.innerHTML = `
               <img id="movie-img" src="${movie.Poster}" alt="Movie Poster">
                <div class="movie-details">
                    <div class="name-rating">
                        <h4 id="movie-name">${movie.Title}</h4>
                        <p id="rating">⭐ 8</p>
                    </div>
                    <div class="extra-details">
                        <p id="time">${movie.Year}</p>
                        <p id="category">${movie.Type}</p>
                        <p class="watchlist-add">
                            <a href="#"><span style="display:inline-flex; align-items:center; justify-content:center; width:24px; height:24px; background-color:black; color:white; border-radius:50%; font-weight:bold;">+</span>
                            Watchlist
                            </a>
                        </p>
                        <p class="added-watchlist">
                            <a href="#"><span style="color: black; font-size: 24px;">&#10003;</span>
                            Added to Watchlist
                            </a>
                        </p>
                    </div>
                    <div class="description">
                        <p>The movie name is ${movie.Title} released in ${movie.Year}.</p>
                    </div>
                </div> 
            `

            const addBtn = movieEl.querySelector(".watchlist-add")
            const addedMsg = movieEl.querySelector(".added-watchlist")

            const saved = JSON.parse(localStorage.getItem("watchlist")) || []
            const alreadySaved = saved.some((item) => item.imdbID === movie.imdbID)
            addBtn.style.display = alreadySaved ? "none" : "block"
            addedMsg.style.display = alreadySaved ? "block" : "none"

            addBtn.querySelector("a").addEventListener("click", (e) => {
                e.preventDefault()
                addToWatchList(movie)
                addBtn.style.display = "none"
                addedMsg.style.display = "block"
            })

            movieLists.appendChild(movieEl)
            movieLists.style.display = "block"

        })

    }
    catch (error){
        console.log("Fetch failed: ", error)
    }
}


function addToWatchList(movie) {

    let watchList = JSON.parse(localStorage.getItem("watchlist")) || []
    const alreadyExists = watchList.some((item) => item.imdbID === movie.imdbID)

    if(alreadyExists) {
        console.log("Movie already exists")
        return
    }

    watchList.push(movie)
    localStorage.setItem("watchlist", JSON.stringify(watchList))
    console.log("Added to watchlist ", movie.Title)
}

function removeFromWatchlist(imdbID) {
    const watchList = JSON.parse(localStorage.getItem("watchlist")) || []
    const updated = watchList.filter((item) => item.imdbID !== imdbID)
    localStorage.setItem("watchlist", JSON.stringify(updated))
}

function loadWatchList() {
    const watchList = JSON.parse(localStorage.getItem("watchlist")) || []
    watchListContainer.innerHTML = ""

    if(watchList.length === 0) {
        introDetailsWatchList.style.display = "block"
        watchListContainer.style.display = "none"
        return
    }

    introDetailsWatchList.style.display = "none"
    watchListContainer.style.display = "block"

    watchList.forEach((movie) => {
        const movieEl = document.createElement("div")
        movieEl.classList.add("movie-list")

        movieEl.innerHTML =  `
            <img id="movie-img" src="${movie.Poster}" alt="Movie Poster">
                <div class="movie-details">
                    <div class="name-rating">
                        <h4 id="movie-name">${movie.Title}</h4>
                        <p id="rating">⭐ 8</p>
                    </div>
                    <div class="extra-details">
                        <p id="time">${movie.Year}</p>
                        <p id="category">Action, Drama</p>
                        <p id="remove-watchlist">
                            <a href="#"><span style="display:inline-flex; align-items:center; justify-content:center; width:24px; height:24px; background-color:black; color:white; border-radius:50%; font-weight:bold;">-</span>
                            Remove
                            </a>
                        </p>
                    </div>
                    <div class="description">
                        <p>
                           This movie named ${movie.Title} is released in ${movie.Year}
                        </p>
                    </div>
                </div>
        `

        movieEl.querySelector("#remove-watchlist a").addEventListener("click", (e) => {
            e.preventDefault()
            removeFromWatchlist(movie.imdbID)
            loadWatchList()
        })

        watchListContainer.appendChild(movieEl)

    })

    }

    if(searchButton) {
        searchButton.addEventListener("click", () => {
            findMovie(searchInput.value)
            searchInput.value = ""
            introDetails.style.display = "none"
    })
    }

    if(watchListContainer) {
        loadWatchList()
    }