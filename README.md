# Blomp Demo Shop

A tiny online shop that [Blomp](https://github.com/Big-BenW3/Blomp) and Kane CLI test. It exists so the Blomp demo has a real site to check: sign up, log in, add to cart, check out.

Everything runs in the browser (accounts, cart and orders live in `localStorage`), so there is no server or database to set up and nothing here is real. No card is ever charged.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Pages

| Page | What it does |
| --- | --- |
| `/` | Four products with an "Add to cart" button |
| `/signup`, `/login` | Create an account and sign in (checked in the browser) |
| `/cart` | Quantities, line totals and the order total |
| `/checkout` | Name, address and a 16 digit card number, then "Place order" |
| `/confirmation` | "Order confirmed" with the order number |

## What Kane checks

These are the flows Blomp runs against the live site:

1. **Sign up**: create an account with a name, email and an 8+ character password and see the greeting in the header.
2. **Log in**: sign up, log out, log back in with the same details.
3. **Add to cart**: add the Trail Backpack and see it in the cart with the right total.
4. **Checkout**: add a product, fill in the form with the test card `4242 4242 4242 4242`, place the order and see the confirmation.

## Git history

The history has one deliberate regression, "Reject short card numbers", which breaks the checkout flow. Blomp finds it, opens a fix pull request, and Kane re-checks the preview before marking it verified.
