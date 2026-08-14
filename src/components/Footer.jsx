import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">

      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">

          <Link href="/" className="footer-logo">
            🎬 Movie Explorer
          </Link>

          <p>
            Discover movies, explore genres and find
            your next favorite film.
          </p>

        </div>


        {/* QUICK LINKS */}
        <div className="footer-links">

          <h3>Quick Links</h3>

          <Link href="/">
            Home
          </Link>

          <Link href="/movies">
            Movies
          </Link>

          <Link href="/ranking">
            Ranking
          </Link>

          <Link href="/about">
            About
          </Link>

        </div>


        {/* GENRES */}
        <div className="footer-links">

          <h3>Genres</h3>

          <Link href="/action">
            Action
          </Link>

          <Link href="/crime">
            Crime
          </Link>

          <Link href="/drama">
            Drama
          </Link>

          <Link href="/sci-fi">
            Sci-Fi
          </Link>

        </div>


        {/* ACCOUNT */}
        <div className="footer-links">

          <h3>Account</h3>

          <Link href="/login">
            Login
          </Link>

          <Link href="/signup">
            Sign Up
          </Link>

        </div>

      </div>


      {/* BOTTOM */}
      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} Movie Explorer.
          All rights reserved.
        </p>

        <p>
          Built with ❤️ using Next.js
        </p>

      </div>

    </footer>
  );
}