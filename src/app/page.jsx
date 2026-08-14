"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MovieGrid from "@/components/MovieGrid";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const TMDB_API = "https://api.themoviedb.org/3";

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);

  const [currentHero, setCurrentHero] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        setError("");

        if (!API_KEY) {
          throw new Error(
            "TMDB API key is missing in .env.local"
          );
        }

        const [
          trendingResponse,
          popularResponse,
          topRatedResponse,
        ] = await Promise.all([
          fetch(
            `${TMDB_API}/trending/movie/week?api_key=${API_KEY}`
          ),

          fetch(
            `${TMDB_API}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
          ),

          fetch(
            `${TMDB_API}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
          ),
        ]);

        if (!trendingResponse.ok) {
          throw new Error("Failed to load trending movies");
        }

        if (!popularResponse.ok) {
          throw new Error("Failed to load popular movies");
        }

        if (!topRatedResponse.ok) {
          throw new Error("Failed to load top rated movies");
        }

        const trendingData = await trendingResponse.json();
        const popularData = await popularResponse.json();
        const topRatedData = await topRatedResponse.json();

        const trending = Array.isArray(trendingData.results)
          ? trendingData.results
          : [];

        const popular = Array.isArray(popularData.results)
          ? popularData.results
          : [];

        const topRated = Array.isArray(topRatedData.results)
          ? topRatedData.results
          : [];

        setTrendingMovies(trending);
        setPopularMovies(popular);
        setTopRatedMovies(topRated);
      } catch (err) {
        console.error("TMDB Error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  /*
    HERO MOVIES

    Only movies with a backdrop image are used.
    This prevents broken/poor hero backgrounds.
  */
  const heroMovies = [
    ...trendingMovies,
    ...popularMovies,
    ...topRatedMovies,
  ]
    .filter(
      (movie) =>
        movie &&
        movie.id &&
        movie.backdrop_path &&
        movie.title
    )
    .filter(
      (movie, index, array) =>
        array.findIndex(
          (item) => item.id === movie.id
        ) === index
    )
    .slice(0, 8);

  /*
    Automatically change hero movie every 5 seconds
  */
  useEffect(() => {
    if (heroMovies.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentHero((previous) =>
        previous === heroMovies.length - 1
          ? 0
          : previous + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroMovies.length]);

  /*
    Reset hero index if the movie list changes
  */
  useEffect(() => {
    setCurrentHero(0);
  }, [trendingMovies.length]);

  if (loading) {
    return (
      <main className="home-page">
        <section className="home-loading">
          <div className="loading-spinner"></div>

          <h2>Loading Movies...</h2>

          <p>Fetching movies from TMDB.</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="home-page">
        <section className="home-error">
          <h2>Unable to Load Movies</h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </section>
      </main>
    );
  }

  const heroMovie = heroMovies[currentHero];

  return (
    <main className="home-page">

      {/* =========================
          HERO SECTION
      ========================== */}

      {heroMovie && (
        <section
          className="home-hero"
          style={{
            backgroundImage: `url("https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}")`,
          }}
        >
          <div className="hero-overlay"></div>

          <div className="hero-content">

            <span className="hero-tag">
              🎬 MOVIE EXPLORER
            </span>

            <h1 key={heroMovie.id}>
              {heroMovie.title}
            </h1>

            <div className="hero-meta">

              <span>
                ⭐{" "}
                {heroMovie.vote_average
                  ? Number(
                    heroMovie.vote_average
                  ).toFixed(1)
                  : "N/A"}
              </span>

              <span>
                {heroMovie.release_date
                  ? heroMovie.release_date.substring(0, 4)
                  : "N/A"}
              </span>

              <span>TMDB</span>

            </div>

            <p>
              {heroMovie.overview ||
                "Discover trending and popular movies."}
            </p>

            <div className="hero-buttons">

              <Link
                href={`/movies/${heroMovie.id}`}
                className="hero-btn primary"
              >
                View Movie
              </Link>

              <Link
                href="/movies"
                className="hero-btn secondary"
              >
                Explore Movies
              </Link>

            </div>

          </div>
        </section>
      )}


      {/* =========================
    FEATURED MOVIE SLIDER
========================== */}

      {heroMovies.length > 0 && (
        <section id="featured" className="featured-section">

          <div className="section-heading">

            <div>
              <span>FEATURED</span>
              <h2>Movie of the Week</h2>
            </div>

            <Link href="/movies">
              View all movies →
            </Link>

          </div>

          <div
            className="featured-card"
            key={heroMovie.id}
          >

            <div className="featured-image">

              <img
                src={`https://image.tmdb.org/t/p/w780${heroMovie.poster_path}`}
                alt={heroMovie.title}
              />

            </div>

            <div className="featured-info">

              <span className="featured-label">
                ⭐ TOP RATED
              </span>

              <h3>{heroMovie.title}</h3>

              <div className="featured-meta">

                <span>
                  {heroMovie.release_date
                    ? heroMovie.release_date.substring(0, 4)
                    : "N/A"}
                </span>

                <span>•</span>

                <span>TMDB</span>

                <span>•</span>

                <span>
                  {heroMovie.vote_average
                    ? `${Number(heroMovie.vote_average).toFixed(1)} / 10`
                    : "N/A"}
                </span>

              </div>

              <p>
                {heroMovie.overview ||
                  "Discover this amazing movie on Movie Explorer."}
              </p>

              <div className="rating-box">

                <strong>
                  {heroMovie.vote_average
                    ? Number(heroMovie.vote_average).toFixed(1)
                    : "N/A"}
                </strong>

                <span>/ 10</span>

                <small>TMDB Rating</small>

              </div>

              <Link
                href={`/movies/${heroMovie.id}`}
                className="watch-btn"
              >
                Explore Movie
                <span>→</span>
              </Link>

            </div>

          </div>

          {/* SLIDER DOTS */}

          <div className="slider-dots">

            {heroMovies.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={
                  index === currentHero
                    ? "slider-dot active"
                    : "slider-dot"
                }
                onClick={() => setCurrentHero(index)}
                aria-label={`Show ${item.title}`}
              ></button>
            ))}

          </div>

          {/* MOVIE NAMES */}

          <div className="slider-movie-names">

            {heroMovies.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={
                  index === currentHero
                    ? "slider-movie-name active"
                    : "slider-movie-name"
                }
                onClick={() => setCurrentHero(index)}
              >
                {item.title}
              </button>
            ))}

          </div>

        </section>
      )}


      {/* =========================
          TRENDING MOVIES
      ========================== */}

      <section className="movie-section">

        <div className="section-header">

          <div>
            <span className="section-label">
              THIS WEEK
            </span>

            <h2>Trending Movies</h2>
          </div>

          <Link
            href="/movies"
            className="view-all"
          >
            View All →
          </Link>

        </div>

        <MovieGrid
          movies={trendingMovies.slice(0, 10)}
        />

      </section>


      {/* =========================
          POPULAR MOVIES
      ========================== */}

      <section className="movie-section">

        <div className="section-header">

          <div>
            <span className="section-label">
              MOST WATCHED
            </span>

            <h2>Popular Movies</h2>
          </div>

          <Link
            href="/movies"
            className="view-all"
          >
            View All →
          </Link>

        </div>

        <MovieGrid
          movies={popularMovies.slice(0, 10)}
        />

      </section>


      {/* =========================
          TOP RATED MOVIES
      ========================== */}

      <section className="movie-section">

        <div className="section-header">

          <div>
            <span className="section-label">
              HIGHLY RATED
            </span>

            <h2>Top Rated Movies</h2>
          </div>

          <Link
            href="/ranking"
            className="view-all"
          >
            View Ranking →
          </Link>

        </div>

        <MovieGrid
          movies={topRatedMovies.slice(0, 10)}
        />

      </section>


      {/* =========================
          GENRES
      ========================== */}

      <section className="genres-section">

        <div className="section-header">

          <div>
            <span className="section-label">
              EXPLORE
            </span>

            <h2>Browse By Genre</h2>
          </div>

        </div>

        <div className="genre-grid">

          <Link
            href="/action"
            className="genre-card"
          >
            <span>💥</span>
            <h3>Action</h3>
            <p>Exciting & intense</p>
          </Link>

          <Link
            href="/crime"
            className="genre-card"
          >
            <span>🔫</span>
            <h3>Crime</h3>
            <p>Dark & thrilling</p>
          </Link>

          <Link
            href="/drama"
            className="genre-card"
          >
            <span>🎭</span>
            <h3>Drama</h3>
            <p>Emotional stories</p>
          </Link>

          <Link
            href="/sci-fi"
            className="genre-card"
          >
            <span>🚀</span>
            <h3>Sci-Fi</h3>
            <p>Beyond imagination</p>
          </Link>

        </div>

      </section>

    </main>
  );
}