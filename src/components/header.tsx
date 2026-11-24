"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logOut, useShop } from "@/lib/store";

export function Header() {
  const { account, count, hydrated } = useShop();
  const router = useRouter();

  return (
    <header className="header">
      <Link href="/" className="brand">
        Blomp Demo Shop
      </Link>
      <nav className="nav" aria-label="Main">
        {hydrated && account ? (
          <>
            <span className="greeting">Hi, {account.name}</span>
            <button
              type="button"
              className="link"
              onClick={() => {
                logOut();
                router.push("/");
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Log in</Link>
            <Link href="/signup">Sign up</Link>
          </>
        )}
        <Link href="/cart" className="cart-link">
          Cart ({hydrated ? count : 0})
        </Link>
      </nav>
    </header>
  );
}
