export function getInitials(name: string): string {
  const fallback = "AA";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return fallback;

  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts.at(-1)?.[0] ?? "" : parts[0][1] ?? "";

  const initials = `${first}${last}`.toUpperCase();
  return initials || fallback;
}