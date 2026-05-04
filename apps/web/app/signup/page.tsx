"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { API_BASE_URL, parseApiResponse, setAccessToken } from "@/lib/api";

type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      await parseApiResponse(
        await fetch(`${API_BASE_URL}/api/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password,
            full_name: fullName.trim() || undefined
          })
        })
      );

      const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      const payload = await parseApiResponse<LoginResponse>(loginResponse);

      setAccessToken(payload.access_token);
      window.localStorage.setItem("freepdf_refresh_token", payload.refresh_token);
      router.push("/#tools");
    } catch (signupError) {
      setError(
        signupError instanceof Error
          ? signupError.message
          : "Unable to create your account."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-navy">
      <Navbar />
      <section className="mx-auto max-w-md px-6 pb-20 pt-32">
        <h1 className="font-syne text-4xl font-bold">Create Account</h1>
        <p className="mt-3 text-sm text-navy/55">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-red-600 hover:text-red-700">
            Sign in
          </Link>
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="w-full rounded-md border border-zinc-200 px-4 py-3 outline-none transition focus:border-red-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-md border border-zinc-200 px-4 py-3 outline-none transition focus:border-red-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            className="w-full rounded-md border border-zinc-200 px-4 py-3 outline-none transition focus:border-red-500"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={8}
            className="w-full rounded-md border border-zinc-200 px-4 py-3 outline-none transition focus:border-red-500"
          />
          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-red-600 px-4 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </section>
      <Footer />
    </main>
  );
}
