import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="about-page">

      {/* HEADER */}
      <section className="about-hero">

        <Link href="/" className="back-button">
          ← Home
        </Link>

        <span className="section-label">
          ABOUT THE PROJECT
        </span>

        <h1>🎬 About Movie Explorer</h1>

        <p>
          A movie discovery platform designed to make
          exploring movies simple, enjoyable and easy.
        </p>

      </section>


      {/* PROJECT INFO */}
      <section className="about-section">

        <div className="about-card">

          <span className="about-icon">
            🎥
          </span>

          <h2>What is Movie Explorer?</h2>

          <p>
            Movie Explorer is a web application where users
            can discover movies, browse different genres,
            check movie details and explore movie rankings.
          </p>

          <p>
            The project is built using modern web
            technologies and is designed with reusable
            components for a better development experience.
          </p>

        </div>


        <div className="about-card">

          <span className="about-icon">
            ⚡
          </span>

          <h2>Features</h2>

          <ul>
            <li>🎬 Browse movies</li>
            <li>🔎 Search movies</li>
            <li>🎭 Explore movie genres</li>
            <li>⭐ View movie ratings</li>
            <li>🏆 Movie rankings</li>
            <li>📖 Movie details</li>
            <li>👤 User login and signup</li>
          </ul>

        </div>

      </section>


      {/* TECHNOLOGY */}
      <section className="technology-section">

        <span className="section-label">
          TECHNOLOGY
        </span>

        <h2>Built With</h2>

        <div className="technology-grid">

          <div className="technology-card">
            <span>⚛️</span>
            <h3>React</h3>
            <p>Component-based UI</p>
          </div>

          <div className="technology-card">
            <span>▲</span>
            <h3>Next.js</h3>
            <p>Modern React framework</p>
          </div>

          <div className="technology-card">
            <span>🎨</span>
            <h3>CSS</h3>
            <p>Responsive interface</p>
          </div>

          <div className="technology-card">
            <span>🎬</span>
            <h3>TMDB API</h3>
            <p>Movie information</p>
          </div>

        </div>

      </section>


      {/* DEVELOPER */}
      <section className="developer-section">

        <span className="section-label">
          DEVELOPER
        </span>

        <h2>About the Developer</h2>

        <div className="developer-card">

          <div className="developer-avatar">
            G
          </div>

          <div>
            <h3>Gohil Nityrajsinh</h3>

            <p>
              Developer of Movie Explorer
            </p>

            <p>
              Built with ❤️ and modern web technologies.
            </p>
          </div>

        </div>

      </section>


      {/* FOOTER CTA */}
      <section className="about-cta">

        <h2>
          Ready to explore movies?
        </h2>

        <p>
          Find your next favorite movie today.
        </p>

        <Link
          href="/movies"
          className="hero-button"
        >
          Explore Movies →
        </Link>

      </section>

    </main>
  );
}