export function isFKViolation(err: unknown): boolean {
  let current: unknown = err;

  //? The while loop walks the "cause" chain because Drizzle wraps the pg error
  while (current && typeof current === "object") {
    if ("code" in current && (current as { code: unknown }).code === "23503") {
      return true;
    }
    current = "cause" in current
      ? (current as { cause: unknown }).cause
      : undefined;
  }

  return false;
}
