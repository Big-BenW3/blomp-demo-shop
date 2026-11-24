"use client";

import Link from "next/link";
import { money } from "@/lib/products";
import { setQuantity, useShop } from "@/lib/store";

export default function CartPage() {
  const { lines, totalCents, hydrated } = useShop();
  if (!hydrated) return null;

  if (lines.length === 0) {
    return (
      <>
        <h1>Your cart</h1>
        <p className="lead">Your cart is empty.</p>
        <Link href="/" className="button">
          Keep shopping
        </Link>
      </>
    );
  }

  return (
    <>
      <h1>Your cart</h1>
      <ul className="lines">
        {lines.map(({ product, qty }) => (
          <li key={product.id} className="line">
            <span className="icon" aria-hidden="true">
              {product.icon}
            </span>
            <span className="grow">
              <strong>{product.name}</strong>
              <span className="muted"> {money(product.cents)} each</span>
            </span>
            <span className="qty">
              <button type="button" aria-label={`Remove one ${product.name}`} onClick={() => setQuantity(product.id, qty - 1)}>
                −
              </button>
              <span aria-label={`Quantity of ${product.name}`}>{qty}</span>
              <button type="button" aria-label={`Add one ${product.name}`} onClick={() => setQuantity(product.id, qty + 1)}>
                +
              </button>
            </span>
            <span className="line-total">{money(product.cents * qty)}</span>
          </li>
        ))}
      </ul>
      <p className="total">
        Total <strong>{money(totalCents)}</strong>
      </p>
      <Link href="/checkout" className="button">
        Checkout
      </Link>
    </>
  );
}
