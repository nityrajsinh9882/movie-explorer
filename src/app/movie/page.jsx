import Link from "next/link";
import { notFound } from "next/navigation";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const API_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

export default async function MovieDetailsPage({
  params,
}) {
  const { id } = await params;

  if (!API_KEY) {
    throw new Error(
      "TMDB API key is missing in .env.local"
    );
  }

  const response = await fetch(
    `${API_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    notFound();
  }

  const movie = await response.json();

  if (!movie?.id) {
    notFound();
  }

  return (
    <main className="movie-details-page">

      <div className="movie-details-container">

        <Link
          href="/movies"
          className="back-button"
        >
          ← Back to Movies
        </Link>

        <section className="movie-details">

          <div className="movie-details-poster">

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

          <div className="movie-details-info">

            <span className="section-label">
              {movie.genres?.length
                ? movie.genres
                    .map((genre) => genre.name)
                    .join(" • ")
                : "MOVIE"}
            </span>

            <h1>{movie.title}</h1>

            {movie.tagline && (
              <p className="movie-tagline">
                {movie.tagline}
              </p>
            )}

            <div className="movie-details-meta">

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

              <span>
                ⏱️{" "}
                {movie.runtime
                  ? `${movie.runtime} min`
                  : "N/A"}
              </span>

            </div>

            <p className="movie-description">
              {movie.overview ||
                "No description available."}
            </p>

            <div className="movie-actions">

              <Link
                href="/movies"
                className="hero-button"
              >
                ← Browse Movies
              </Link>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}