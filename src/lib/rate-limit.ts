// Simple in-memory limiter (single Railway instance). Resets on restart.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
const MAX_KEYS = 10_000;

const hits = new Map<string, { count: number; resetAt: number }>();

/** Returns true if this IP may still write a log row in the current minute. */
export function allowLog(ip: string): boolean {
  const now = Date.now();
  if (hits.size > MAX_KEYS) {
    for (const [key, v] of hits) if (v.resetAt <= now) hits.delete(key);
    if (hits.size > MAX_KEYS) hits.clear();
  }
  const entry = hits.get(ip);
  if (!entry || entry.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_PER_WINDOW;
}
