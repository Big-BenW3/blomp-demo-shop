"use client";

import { useState } from "react";
import { PRODUCTS, money } from "@/lib/products";
import { addToCart } from "@/lib/store";

export default function HomePage() {
  const [added, setAdded] = useState<string | null>(null);

  return (
    <>
      <h1>Everyday gear</h1>
      <p className="lead">Four things we like, priced plainly.</p>
      <ul className="grid">
        {PRODUCTS.map((p) => (
          <li key={p.id} className="card">
            <div className="icon" aria-hidden="true">
              {p.icon}
            </div>
            <h2>{p.name}</h2>
            <p className="muted">{p.blurb}</p>
            <p className="price">{money(p.cents)}</p>
            <button
              type="button"
              className="button"
              onClick={() => {
                addToCart(p.id);
                setAdded(p.name);
              }}
            >
              Add to carts
            </button>
          </li>
        ))}
      </ul>
      <p className="status" role="status">
        {added ? `Added ${added} to your cart.` : ""}
      </p>
    </>
  );
}
