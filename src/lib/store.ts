"use client";

import { useMemo, useSyncExternalStore } from "react";
import { findProduct, type Product } from "./products";

/*
 * The whole shop lives in this browser's localStorage: accounts, the signed-in user, the cart and the last order.
 * That keeps the demo free of servers and databases, so the only thing that can break is the shop's own code.
 */

export interface Account {
  name: string;
  email: string;
  password: string;
}
export type Cart = Record<string, number>;
export interface Order {
  number: number;
  name: string;
  address: string;
  totalCents: number;
  items: { name: string; qty: number }[];
}

const KEYS = { accounts: "shop.accounts", session: "shop.session", cart: "shop.cart", order: "shop.lastOrder", seq: "shop.orderSeq" } as const;
const EVENT = "shop-change";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage blocked: the shop still works until the tab closes, nothing else to do
  }
  window.dispatchEvent(new Event(EVENT));
}

function remove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // see write()
  }
  window.dispatchEvent(new Event(EVENT));
}

export type SignUpResult = { ok: true } | { ok: false; error: string };

export function signUp(name: string, email: string, password: string): SignUpResult {
  const accounts = read<Account[]>(KEYS.accounts, []);
  const clean = email.trim().toLowerCase();
  if (accounts.some((a) => a.email === clean)) return { ok: false, error: "An account with that email already exists" };
  write(KEYS.accounts, [...accounts, { name: name.trim(), email: clean, password }]);
  write(KEYS.session, clean);
  return { ok: true };
}

export function logIn(email: string, password: string): SignUpResult {
  const clean = email.trim().toLowerCase();
  const account = read<Account[]>(KEYS.accounts, []).find((a) => a.email === clean && a.password === password);
  if (!account) return { ok: false, error: "Wrong email or password" };
  write(KEYS.session, clean);
  return { ok: true };
}

export function logOut() {
  remove(KEYS.session);
}

export function addToCart(id: string) {
  const cart = read<Cart>(KEYS.cart, {});
  write(KEYS.cart, { ...cart, [id]: (cart[id] ?? 0) + 1 });
}

export function setQuantity(id: string, qty: number) {
  const cart = { ...read<Cart>(KEYS.cart, {}) };
  if (qty <= 0) delete cart[id];
  else cart[id] = qty;
  write(KEYS.cart, cart);
}

export function placeOrder(name: string, address: string): Order {
  const lines = cartLines(read<Cart>(KEYS.cart, {}));
  const number = read<number>(KEYS.seq, 1000) + 1;
  const order: Order = {
    number,
    name: name.trim(),
    address: address.trim(),
    totalCents: lines.reduce((sum, l) => sum + l.product.cents * l.qty, 0),
    items: lines.map((l) => ({ name: l.product.name, qty: l.qty })),
  };
  write(KEYS.seq, number);
  write(KEYS.order, order);
  remove(KEYS.cart);
  return order;
}

export interface CartLine {
  product: Product;
  qty: number;
}

export function cartLines(cart: Cart): CartLine[] {
  return Object.entries(cart).flatMap(([id, qty]) => {
    const product = findProduct(id);
    return product && qty > 0 ? [{ product, qty }] : [];
  });
}

const EMPTY = JSON.stringify([null, null, null, null]);

function snapshot(): string {
  try {
    return JSON.stringify([
      localStorage.getItem(KEYS.session),
      localStorage.getItem(KEYS.cart),
      localStorage.getItem(KEYS.order),
      localStorage.getItem(KEYS.accounts),
    ]);
  } catch {
    return EMPTY;
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

const noopSubscribe = () => () => {};

/** Live view of the shop's state. `hydrated` is false on the server and for the first client render. */
export function useShop() {
  const snap = useSyncExternalStore(subscribe, snapshot, () => EMPTY);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return useMemo(() => {
    const [session, cart, order, accounts] = (JSON.parse(snap) as (string | null)[]).map((v) => (v ? (JSON.parse(v) as unknown) : null));
    const account = (accounts as Account[] | null)?.find((a) => a.email === session) ?? null;
    const lines = cartLines((cart as Cart | null) ?? {});
    return {
      hydrated,
      account,
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      totalCents: lines.reduce((sum, l) => sum + l.product.cents * l.qty, 0),
      lastOrder: (order as Order | null) ?? null,
    };
  }, [snap, hydrated]);
}
