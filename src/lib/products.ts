export interface Product {
  id: string;
  name: string;
  blurb: string;
  /** Price in cents, so totals never pick up floating point noise. */
  cents: number;
  icon: string;
}

export const PRODUCTS: Product[] = [
  { id: "backpack", name: "Trail Backpack", blurb: "22 litres, water resistant", cents: 6400, icon: "🎒" },
  { id: "sneakers", name: "Canvas Sneakers", blurb: "Everyday low tops", cents: 4800, icon: "👟" },
  { id: "bottle", name: "Insulated Bottle", blurb: "Cold for 24 hours", cents: 2200, icon: "🧴" },
  { id: "beanie", name: "Wool Beanie", blurb: "Merino, one size", cents: 1800, icon: "🧢" },
];

export const findProduct = (id: string) => PRODUCTS.find((p) => p.id === id);

export const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;
