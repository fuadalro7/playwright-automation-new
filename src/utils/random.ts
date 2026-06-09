/**
 * Utility functions for generating random/dynamic test data.
 */

export function randomString(length: number = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function randomEmail(): string {
  return `testuser_${randomString(6)}@mailtest.com`;
}

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function timestamp(): string {
  return new Date().toISOString();
}
