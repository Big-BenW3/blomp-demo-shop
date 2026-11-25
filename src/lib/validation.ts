/** Strips spaces and dashes people type between card digits. */
const digitsOnly = (value: string) => value.replace(/[\s-]/g, "");

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

/** Cards shorter than 16 digits are typos, so refuse them before payment. */
export function isValidCard(card: string): boolean {
  const digits = digitsOnly(card);
  return /^\d+$/.test(digits) && digits.length === 16;
}
