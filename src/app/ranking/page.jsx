"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const API_URL =
  "https://api.themoviedb.org/3/movie/top_rated";

const IMAGE_URL =
  "https://image.tmdb.org/t/p/w500";

export default function RankingPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRanking() {
      try {
        setLoading(true);
        setError("");

        if (!API_KEY) {
          throw new Error(
            "TMDB API key is missing in .env.local"
          );
        }

        const response = await fetch(
          `${API_URL}?api_key=${API_KEY}&language=en-US&page=1`
        );

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
        console.error("Ranking Error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load ranking"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRanking();
  }, []);

  if (loading) {
    return (
      <main className="ranking-page">
        <section className="movies-loading">
          <h2>Loading Movie Ranking...</h2>
          <p>Fetching top-rated movies from TMDB.</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="ranking-page">
        <section className="movies-error">
          <h2>Unable to Load Ranking</h2>
          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="ranking-page">

      <section className="ranking-header">

        <Link
          href="/"
          className="back-button"
        >
          ← Home
        </Link>

        <span className="section-label">
          MOVIE RANKINGS
        </span>

        <h1>🏆 Movie Ranking</h1>

        <p>
          Discover the highest-rated movies powered by TMDB.
        </p>

      </section>

      <section className="ranking-section">

        {movies.map((movie, index) => (

          <Link
            href={`/movies/${movie.id}`}
            className="ranking-card"
            key={movie.id}
          >

            <div className="rank-number">
              #{index + 1}
            </div>

            <div className="ranking-poster">

              {movie.poster_path ? (
                <img
                  src={`${IMAGE_URL}${movie.poster_path}`}
                  alt={movie.title}
                />
              ) : (
                <div className="no-poster">
                  No Image
                </div>
              )}

            </div>

            <div className="ranking-info">

              <h2>{movie.title}</h2>

              <div className="ranking-meta">

                <span>
                  📅{" "}
                  {movie.release_date
                    ? movie.release_date.substring(0, 4)
                    : "N/A"}
                </span>

                <span>
                  ⭐{" "}
                  {movie.vote_average
                    ? Number(
                        movie.vote_average
                      ).toFixed(1)
                    : "N/A"}
                </span>

              </div>

              <p>
                {movie.overview ||
                  "No description available."}
              </p>

            </div>

            <div className="ranking-rating">

              <span>⭐</span>

              <strong>
                {movie.vote_average
                  ? Number(
                      movie.vote_average
                    ).toFixed(1)
                  : "N/A"}
              </strong>

            </div>

          </Link>

        ))}

      </section>

    </main>
  );
}