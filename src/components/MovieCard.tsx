// src/components/MovieCard.tsx

import Link from "next/link";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
};

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  const year = movie.release_date
    ? movie.release_date.substring(0, 4)
    : "Unknown";

  const rating =
    typeof movie.vote_average === "number"
      ? movie.vote_average.toFixed(1)
      : "N/A";

  return (
    <Link href={`/movies/${movie.id}`} className="movie-card">
      <div className="movie-card-image">
        <img
          src={posterUrl}
          alt={movie.title || "Movie"}
          className="movie-poster"
        />

        <div className="movie-rating">
          ⭐ {rating}
        </div>
      </div>

      <div className="movie-card-content">
        <h3>{movie.title}</h3>

        <div className="movie-meta">
          <span>{year}</span>
          <span>Movie</span>
        </div>
      </div>
    </Link>
  );
}