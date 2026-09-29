

async function findMovie(query) {
    try {
        const response =  await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=60c36440`);
        const data = await response.json();

        if (data.Response === "False") {
            console.log("No results:", data.Error);
            return null;
        }

        const movie = data.Search;
        // console.log(movie);

        const imdbID = data.Search[0].imdbID;
        const movieResponse = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=60c36440&plot=full`);
        const movieData = await movieResponse.json();

        const movies = movieData;
        console.log(movies);
    }

    catch (err) {
        console.error("Failed to fetch the movie:", err);
    }

}

findMovie("Interstellar")