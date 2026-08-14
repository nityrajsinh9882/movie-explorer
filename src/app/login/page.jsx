"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleLogin(e) {
    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      return;
    }

    const users =
      JSON.parse(localStorage.getItem("movieUsers")) || [];

    const user = users.find(
      (item) =>
        item.email.toLowerCase() ===
          form.email.toLowerCase() &&
        item.password === form.password
    );

    if (!user) {
      setError("Invalid email or password.");
      return;
    }

    localStorage.setItem(
      "movieUser",
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
      })
    );

    router.push("/");
  }

  return (
    <main className="auth-page">

      <div className="auth-card">

        {/* HEADER */}
        <div className="auth-header">

          <span className="auth-icon">
            🎬
          </span>

          <h1>Welcome Back</h1>

          <p>
            Login to continue exploring movies.
          </p>

        </div>


        {/* FORM */}
        <form onSubmit={handleLogin}>

          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
            />

          </div>


          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />

          </div>


          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}


          <button
            type="submit"
            className="auth-button"
          >
            Login
          </button>

        </form>


        {/* FOOTER */}
        <div className="auth-footer">

          <p>
            Don't have an account?
          </p>

          <Link href="/signup">
            Create Account
          </Link>

        </div>

      </div>

    </main>
  );
}