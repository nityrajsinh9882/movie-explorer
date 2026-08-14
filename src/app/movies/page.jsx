"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MovieGrid from "@/components/MovieGrid";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const API_URL = "https://api.themoviedb.org/3";

function MoviesContent() {
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("search") || "";

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        setError("");
        setPage(1);

        if (!API_KEY) {
          throw new Error(
            "TMDB API key is missing in .env.local"
          );
        }

        const url = searchQuery.trim()
          ? `${API_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
              searchQuery
            )}&page=1&include_adult=false`
          : `${API_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `TMDB API Error: ${response.status}`
          );
        }

        const data = await response.json();

        setMovies(
          Array.isArray(data.results)
            ? data.results
            : []
        );
      } catch (err) {
        console.error("TMDB Error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load movies"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [searchQuery]);

  async function handleLoadMore() {
    try {
      setLoadingMore(true);
      setError("");

      if (!API_KEY) {
        throw new Error(
          "TMDB API key is missing in .env.local"
        );
      }

      const nextPage = page + 1;

      const url = searchQuery.trim()
        ? `${API_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
            searchQuery
          )}&page=${nextPage}&include_adult=false`
        : `${API_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${nextPage}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `TMDB API Error: ${response.status}`
        );
      }

      const data = await response.json();

      const newMovies = Array.isArray(data.results)
        ? data.results
        : [];

      setMovies((previousMovies) => [
        ...previousMovies,
        ...newMovies,
      ]);

      setPage(nextPage);
    } catch (err) {
      console.error("TMDB Load More Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load more movies"
      );
    } finally {
      setLoadingMore(false);
    }
  }

  if (loading) {
    return (
      <main className="movies-page">
        <div className="movies-loading">
          <h2>
            {searchQuery
              ? `Searching for "${searchQuery}"...`
              : "Loading Movies..."}
          </h2>

          <p>
            Fetching movies from TMDB.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="movies-page">

      {/* =========================
          MOVIES HEADER
      ========================== */}

      <section className="movies-header">

        <div>

          <span className="movies-tag">
            🎬 MOVIE EXPLORER
          </span>

          <h1>
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : "Explore Movies"}
          </h1>

          <p>
            {searchQuery
              ? `Movies matching "${searchQuery}"`
              : "Discover popular movies powered by TMDB."}
          </p>

        </div>

        <div className="movie-count">
          {movies.length} Movies
        </div>

      </section>

      {/* =========================
          ERROR
      ========================== */}

      {error && (
        <div className="movies-error">

          <h3>Something went wrong</h3>

          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

        </div>
      )}

      {/* =========================
          NO RESULTS
      ========================== */}

      {!error && movies.length === 0 && (
        <section className="no-results">

          <h2>
            {searchQuery
              ? "No Movies Found"
              : "No Movies Available"}
          </h2>

          <p>
            {searchQuery
              ? `We couldn't find any movies matching "${searchQuery}".`
              : "No movies are available right now."}
          </p>

          <Link
            href="/movies"
            className="back-to-movies"
          >
            Browse Popular Movies
          </Link>

        </section>
      )}

      {/* =========================
          MOVIE GRID
      ========================== */}

      {!error && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} />

          {/* =========================
              LOAD MORE
          ========================== */}

          <div className="load-more-container">

            <button
              type="button"
              className="load-more-btn"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore
                ? "Loading..."
                : "Load More"}
            </button>

          </div>
        </>
      )}

      {/* =========================
          TMDB CREDIT
      ========================== */}

      <footer className="tmdb-credit">
        This product uses the TMDB API but is not
        endorsed or certified by TMDB.
      </footer>

    </main>
  );
}

/* =========================
   PAGE + SUSPENSE
========================= */

export default function MoviesPage() {
  return (
    <Suspense
      fallback={
        <main className="movies-page">
          <div className="movies-loading">
            <h2>Loading Movies...</h2>
            <p>Preparing movie explorer...</p>
          </div>
        </main>
      }
    >
      <MoviesContent />
    </Suspense>
  );
}