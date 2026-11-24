"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "@/lib/store";
import { isValidEmail, isValidPassword } from "@/lib/validation";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Enter your name");
    if (!isValidEmail(email)) return setError("Enter a valid email address");
    if (!isValidPassword(password)) return setError("Password must be at least 8 characters");
    const result = signUp(name, email, password);
    if (!result.ok) return setError(result.error);
    router.push("/");
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <h1>Create your account</h1>
      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
      </label>
      <label>
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
      </label>
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className="button">
        Create account
      </button>
      <p className="muted">
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </form>
  );
}
