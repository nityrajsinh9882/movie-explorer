"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("movieUser");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("movieUser");
      }
    }
  }, []);

  function handleSearch(e) {
    e.preventDefault();

    const value = search.trim();

    if (!value) {
      router.push("/movies");
      return;
    }

    router.push(`/movies?search=${encodeURIComponent(value)}`);
  }

  function handleLogout() {
    localStorage.removeItem("movieUser");
    setUser(null);
    setShowMenu(false);
    router.push("/");
  }

  return (
    <header className="site-header">
      <div className="header-container">

        <Link href="/" className="logo">
          🎬 Movie Explorer
        </Link>

        <nav className="main-nav">
          <Link href="/">Home</Link>
          <Link href="/movies">Movies</Link>
          <Link href="/ranking">Ranking</Link>
          <Link href="/about">About</Link>
        </nav>

        <form
          className="header-search"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit" aria-label="Search movies">
            🔍
          </button>
        </form>

        {user ? (
          <div className="user-menu">

            <button
              type="button"
              className="user-button"
              onClick={() => setShowMenu(!showMenu)}
            >
              <span className="user-avatar">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </span>

              <span className="user-name">
                {user.name}
              </span>

              <span className="user-arrow">
                {showMenu ? "▲" : "▼"}
              </span>
            </button>

            {showMenu && (
              <div className="user-dropdown">

                <div className="user-info">
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                </div>

                <button
                  type="button"
                  className="logout-button"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </div>
            )}

          </div>
        ) : (
          <div className="auth-links">
            <Link href="/login">Login</Link>

            <Link
              href="/signup"
              className="signup-link"
            >
              Sign Up
            </Link>
          </div>
        )}

      </div>
    </header>
  );
}