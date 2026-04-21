/**
 * Email utilities. The campaign is open to anyone — eligibility is enforced
 * purely by "one spin per email" (unique index on Spin.email in MongoDB).
 * The historical creator allow-list is intentionally no longer consulted.
 */

export function normalizeEmail(input: string): string {
  return input.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
