"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AdminLogin() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Invalid username or password");
        return;
      }

      // Save JWT token
      localStorage.setItem("adminToken", result.token);

      // Save admin information
      localStorage.setItem(
        "adminUser",
        JSON.stringify(result.admin)
      );

      // Go to dashboard
      router.push("/admin/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* ================= LOGIN CARD ================= */}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">

          {/* LOGO / TITLE */}

          <div className="text-center mb-8">

            <h1 className="text-3xl font-bold text-gray-900">
              Digifine Academy
            </h1>

            <p className="text-gray-500 mt-2">
              Admin Panel
            </p>

          </div>


          {/* LOGIN TITLE */}

          <div className="mb-6">

            <h2 className="text-2xl font-semibold text-gray-900">
              Admin Login
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Login to manage career enquiries
            </p>

          </div>


          {/* ERROR MESSAGE */}

          {error && (

            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>

          )}


          {/* FORM */}

          <form onSubmit={handleLogin}>

            {/* USERNAME */}

            <div className="mb-5">

              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

            </div>


            {/* PASSWORD */}

            <div className="mb-6">

              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >

              {loading ? "Logging in..." : "Login"}

            </button>

          </form>

        </div>


        {/* FOOTER */}

        <p className="text-center text-sm text-gray-500 mt-6">
          Digifine Academy Admin Panel
        </p>

      </div>

    </div>
  );
}