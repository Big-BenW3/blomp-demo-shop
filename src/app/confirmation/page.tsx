"use client";

import Link from "next/link";
import { money } from "@/lib/products";
import { useShop } from "@/lib/store";

export default function ConfirmationPage() {
  const { lastOrder, hydrated } = useShop();
  if (!hydrated) return null;

  if (!lastOrder) {
    return (
      <>
        <h1>No recent order</h1>
        <Link href="/" className="button">
          Keep shopping
        </Link>
      </>
    );
  }

  return (
    <>
      <h1>Order confirmed</h1>
      <p className="lead">
        Order #{lastOrder.number} is on its way, {lastOrder.name}.
      </p>
      <ul className="lines">
        {lastOrder.items.map((i) => (
          <li key={i.name} className="line">
            <span className="grow">{i.name}</span>
            <span>× {i.qty}</span>
          </li>
        ))}
      </ul>
      <p className="total">
        Paid <strong>{money(lastOrder.totalCents)}</strong>
      </p>
      <p className="muted">Delivering to {lastOrder.address}</p>
      <Link href="/" className="button">
        Continue shopping
      </Link>
    </>
  );
}
