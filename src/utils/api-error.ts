/** Longest API message we're willing to put in a snackbar. */
const MAX_MESSAGE_LENGTH = 160

/**
 * The gateway answers HTTP 200 with `status: false` and a raw .NET exception —
 * stack trace and source paths included — whenever an upstream call fails.
 * Dumping that into a toast is unreadable, so keep the first sentence only and
 * let callers log the original for debugging.
 */
export function getApiErrorMessage(raw: unknown, fallback: string): string {
  if (typeof raw !== "string" || !raw.trim()) return fallback

  // AN UPSTREAM 401 MEANS OUR TOKEN WAS REJECTED — TELL THE USER WHAT TO DO
  if (/\(401\)|Unauthorized/i.test(raw)) return "Your session has expired. Please sign in again."

  const message = raw
    .split("StackTrace:")[0]
    .replace(/^Exception Error:\s*/i, "")
    .trim()

  if (!message) return fallback

  return message.length > MAX_MESSAGE_LENGTH
    ? `${message.slice(0, MAX_MESSAGE_LENGTH).trim()}…`
    : message
}
