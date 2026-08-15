"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");

    if (!savedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error("Invalid user data:", error);
      localStorage.removeItem("loggedInUser");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="profile-loading">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="profile-page">

      <div className="profile-container">

        {/* PROFILE HEADER */}
        <div className="profile-header">

          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>

        </div>

        {/* USER INFORMATION */}
        <div className="profile-section">

          <h2>Personal Information</h2>

          <div className="profile-info">

            <div className="info-item">
              <span>Name</span>
              <strong>{user.name}</strong>
            </div>

            <div className="info-item">
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>

            <div className="info-item">
              <span>User ID</span>
              <strong>{user.id}</strong>
            </div>

          </div>

        </div>

        {/* FUTURE FEATURES */}
        <div className="profile-section">

          <h2>My Movies</h2>

          <div className="profile-movie-placeholder">

            <div>
              <h3>Watchlist</h3>
              <p>Your saved movies will appear here.</p>
            </div>

            <div>
              <h3>Liked Movies</h3>
              <p>Your liked movies will appear here.</p>
            </div>

          </div>

        </div>

        {/* BACK BUTTON */}
        <button
          className="profile-back-button"
          onClick={() => router.push("/")}
        >
          Back to Home
        </button>

      </div>

    </main>
  );
}