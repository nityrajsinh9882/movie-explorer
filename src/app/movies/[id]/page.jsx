"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_API = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p";

export default function MovieDetails() {
  const params = useParams();
  const id = params?.id;

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);
        setError("");

        if (!API_KEY) {
          throw new Error(
            "TMDB API key is missing in .env.local"
          );
        }

        if (!id) {
          throw new Error("Movie ID is missing");
        }

        const response = await fetch(
          `${TMDB_API}/movie/${id}?api_key=${API_KEY}&language=en-US`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load movie (${response.status})`
          );
        }

        const data = await response.json();

        setMovie(data);
      } catch (err) {
        console.error("Movie Details Error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load movie details"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <main className="movie-detail-page">
        <section className="home-loading">
          <div className="loading-spinner"></div>

          <h2>Loading Movie...</h2>

          <p>Fetching movie details from TMDB.</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="movie-detail-page">
        <section className="home-error">
          <h2>Unable to Load Movie</h2>

          <p>{error}</p>

          <Link href="/movies">
            ← Back to Movies
          </Link>
        </section>
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="movie-detail-page">
        <section className="home-error">
          <h2>Movie Not Found</h2>

          <Link href="/movies">
            ← Back to Movies
          </Link>
        </section>
      </main>
    );
  }

  const releaseYear = movie.release_date
    ? movie.release_date.substring(0, 4)
    : "N/A";

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${
        movie.runtime % 60
      }m`
    : "N/A";

  return (
    <main className="movie-detail-page">

      {/* HERO */}

      <section
        className="movie-detail-hero"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url("${IMAGE_URL}/original${movie.backdrop_path}")`
            : "none",
        }}
      >

        <div className="movie-detail-overlay"></div>

        <div className="movie-detail-content">

          <Link
            href="/movies"
            className="back-movies"
          >
            ← Back to Movies
          </Link>

          <div className="movie-detail-layout">

            {/* POSTER */}

            <div className="movie-detail-poster">

              {movie.poster_path ? (
                <img
                  src={`${IMAGE_URL}/w500${movie.poster_path}`}
                  alt={movie.title}
                />
              ) : (
                <div className="poster-placeholder">
                  No Image
                </div>
              )}

            </div>

            {/* DETAILS */}

            <div className="movie-detail-info">

              <span className="movie-detail-label">
                🎬 MOVIE DETAILS
              </span>

              <h1>{movie.title}</h1>

              {movie.tagline && (
                <p className="movie-tagline">
                  {movie.tagline}
                </p>
              )}

              <div className="movie-detail-meta">

                <span>
                  ⭐{" "}
                  {movie.vote_average
                    ? Number(
                        movie.vote_average
                      ).toFixed(1)
                    : "N/A"}
                </span>

                <span>•</span>

                <span>{releaseYear}</span>

                <span>•</span>

                <span>{runtime}</span>

              </div>

              {/* GENRES */}

              {movie.genres?.length > 0 && (
                <div className="movie-genres">

                  {movie.genres.map((genre) => (
                    <span key={genre.id}>
                      {genre.name}
                    </span>
                  ))}

                </div>
              )}

              {/* OVERVIEW */}

              <div className="movie-overview">

                <h2>Overview</h2>

                <p>
                  {movie.overview ||
                    "No description available."}
                </p>

              </div>

              {/* EXTRA INFO */}

              <div className="movie-extra-info">

                <div>
                  <span>Language</span>

                  <strong>
                    {movie.original_language
                      ? movie.original_language.toUpperCase()
                      : "N/A"}
                  </strong>
                </div>

                <div>
                  <span>Popularity</span>

                  <strong>
                    {movie.popularity
                      ? Math.round(movie.popularity)
                      : "N/A"}
                  </strong>
                </div>

                <div>
                  <span>Votes</span>

                  <strong>
                    {movie.vote_count
                      ? movie.vote_count.toLocaleString()
                      : "N/A"}
                  </strong>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* PRODUCTION */}

      {movie.production_companies?.length > 0 && (
        <section className="movie-detail-bottom">

          <div className="production-section">

            <span className="section-label">
              PRODUCTION
            </span>

            <h2>Production Companies</h2>

            <div className="production-list">

              {movie.production_companies
                .slice(0, 5)
                .map((company) => (
                  <div
                    className="production-company"
                    key={company.id}
                  >

                    {company.logo_path ? (
                      <img
                        src={`${IMAGE_URL}/w200${company.logo_path}`}
                        alt={company.name}
                      />
                    ) : (
                      <span>
                        {company.name}
                      </span>
                    )}

                  </div>
                ))}

            </div>

          </div>

          <div className="movie-detail-actions">

            <Link
              href="/movies"
              className="movie-back-btn"
            >
              ← Browse More Movies
            </Link>

          </div>

        </section>
      )}

    </main>
  );
}