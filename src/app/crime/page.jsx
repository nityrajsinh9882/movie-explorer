// src/app/crime/page.jsx
"use client";

import { useEffect, useState } from "react";
import MovieGrid from "@/components/MovieGrid";

export default function CrimePage() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  async function getMovies(pageNumber) {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY || "",
        with_genres: "80",
        sort_by: "popularity.desc",
        page: pageNumber.toString(),
      });

      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?${params}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Crime movies");
      }

      const data = await response.json();

      if (pageNumber === 1) {
        setMovies(data.results || []);
      } else {
        setMovies((prev) => [...prev, ...(data.results || [])]);
      }
    } catch (error) {
      console.error("Crime movie fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMovies(1);
  }, []);

  function handleLoadMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    getMovies(nextPage);
  }

  return (
    <main className="genre-page">
      <section className="genre-hero">
        <div className="genre-hero-content">
          <span className="hero-tag">🎬 MOVIE EXPLORER</span>
          <h1>Crime Movies</h1>
          <p>
            Enter a world of criminals, investigations, mysteries and
            unforgettable crime stories.
          </p>
        </div>
      </section>

      <section className="movie-section">
        <div className="section-heading">
          <h2>Crime Movies</h2>
          <p>Popular crime movies from TMDB</p>
        </div>

        <MovieGrid movies={movies} />

        {!loading && movies.length > 0 && (
          <div className="load-more-container">
            <button className="load-more-btn" onClick={handleLoadMore}>
              Load More
            </button>
          </div>
        )}

        {loading && <p>Loading...</p>}
      </section>
    </main>
  );
}