
/**
 * TMDB Movies API helper
 *
 * This module exposes a tiny wrapper around The Movie Database (TMDB) REST API.
 * It provides:
 * - A central TMDB_CONFIG with base URL and headers.
 * - A fetchMovies function that either searches movies by a text query or fetches
 *   popular movies when no query is provided.
 *
 * Authentication & environment variables
 * - This client expects an environment variable EXPO_PUBLIC_MOVIE_API_KEY.
 * - It is used as a Bearer token (TMDB v4 style). Ensure your token has read access.
 * - In Expo, any env var prefixed with EXPO_PUBLIC_ is embedded in the app bundle.
 *   Do NOT put secrets there if you need to keep them private. Use secure storage
 *   strategies for true secrets in production apps.
 *
 * Notes
 * - The code prefers v3 endpoints with a v4 Authorization bearer header which TMDB supports.
 * - For search, we URL-encode the query to be safe.
 * - Errors include HTTP status to aid debugging.
 */

// Reference snippet copied from TMDB docs (kept here for context):
/*
const url = 'https://api.themoviedb.org/3/discover/movies?include_adult=false&language=en-US&page=1';
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer <YOUR_V4_ACCESS_TOKEN>'
    }
};

fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error(err));
*/

/**
 * Central configuration for TMDB requests.
 */
export const TMDB_CONFIG = {
    // Base REST API for TMDB v3
    BASE_URL: "https://api.themoviedb.org/3",

    // Expo will inline this into the bundle at build time if prefixed with EXPO_PUBLIC_
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,

    // Shared headers for all requests.
    headers: {
        accept: "application/json",
        // TMDB supports v4 auth using a Bearer token; ensure your key/token is valid.
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
    },
};

/**
 * Fetch a list of movies.
 *
 * Behavior
 * - If a non-empty query is provided, performs a text search on movie titles.
 * - If query is empty, returns a list of popular movies (sorted by popularity).
 *
 * @param {Object} params - Parameters object.
 * @param {string} params.query - Text to search for. Use empty string to get popular movies.
 * @returns {Promise<any[]>} Resolves to an array of movie objects (TMDB "results").
 * @throws {Error} When the HTTP response is not OK (status outside 200-299 range).
 *
 * Example:
 *   const movies = await fetchMovies({ query: "inception" });
 */
export const fetchMovies = async ({ query }: { query: string }): Promise<any[]> => {
    // Build endpoint dynamically based on presence of a search query.
    const endpoint = query
        ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

    // Execute the HTTP request with shared headers.
    const response = await fetch(endpoint, {
        method: "GET",
        headers: TMDB_CONFIG.headers,
    });

    // If the request failed, throw a helpful error including HTTP status.
    if (!response.ok) {
        const message = `Failed to fetch movies: ${response.status} ${response.statusText}`;
        throw new Error(message);
    }

    // Parse the JSON payload and return the "results" array.
    const data = await response.json();
    return data.results;
};


export const fetchMovieDetails = async (movieId: string): Promise<MovieDetails> => {
    try{
        const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`, {
            method: "GET",
            headers: TMDB_CONFIG.headers,
        })

        if(!response.ok){
            const message = `Failed to fetch movie details: ${response.status} ${response.statusText}`;
            throw new Error(message);
        }

        const data = await response.json();
        return data;
    }catch (error){
        console.log(error);
        throw error;
    }
}