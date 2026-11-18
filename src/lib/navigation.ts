export function getSafeReturnTo(value: string | null): string | null {
  if (!value) return null;

  // Only allow internal application paths
  if (!value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  // Prevent malformed paths / backslash-based redirects
  if (value.includes("\\")) {
    return null;
  }

  return value;
}