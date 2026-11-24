"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { money } from "@/lib/products";
import { placeOrder, useShop } from "@/lib/store";
import { isValidCard } from "@/lib/validation";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, totalCents, hydrated } = useShop();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [card, setCard] = useState("");
  const [error, setError] = useState("");

  if (!hydrated) return null;

  if (lines.length === 0) {
    return (
      <>
        <h1>Checkout</h1>
        <p className="lead">There is nothing in your cart yet.</p>
        <Link href="/" className="button">
          Keep shopping
        </Link>
      </>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Enter your full name");
    if (!address.trim()) return setError("Enter your delivery address");
    if (!isValidCard(card)) return setError("Enter a valid 16-digit card number");
    placeOrder(name, address);
    router.push("/confirmation");
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <h1>Checkout</h1>
      <p className="muted">
        {lines.reduce((n, l) => n + l.qty, 0)} item(s), total <strong>{money(totalCents)}</strong>
      </p>
      <label>
        Full name
        <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
      </label>
      <label>
        Delivery address
        <input value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" />
      </label>
      <label>
        Card number
        <input value={card} onChange={(e) => setCard(e.target.value)} inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" />
      </label>
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className="button">
        Place order
      </button>
    </form>
  );
}
