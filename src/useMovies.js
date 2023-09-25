import { useState, useEffect } from "react";

export function useMovies(query) {

    const KEY = '7bc31346';

    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(function () {
        // callback?.();

        const controller = new AbortController(); // browser Api which controls all the signal 

        async function fetchMovies() {
            try {
                setIsLoading(true)
                setError("");
                const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}
          `, { signal: controller.signal })
                if (!res.ok) throw new Error("Something went wrong with fetching movies");

                const data = await res.json()

                if (data.Response === "False") throw new Error("Movie Not Found");
                setMovies(data.Search);
                setError("");
                // console.log(data.Search);
            } catch (err) {
                // console.log(err.message);
                if (err.name !== "AbortError") { setError(err.message) };
            } finally {
                setIsLoading(false)
            }
        }

        if (query.length < 3) {
            setMovies([]);
            setError('');
            return;
        }

        // handleCloseMovie();
        fetchMovies();

        return function () {   //clean up function
            controller.abort()
        };

    }, [query]);

    return { movies, isLoading, error };

}