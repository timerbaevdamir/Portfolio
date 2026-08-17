/**
 * Minimal className joiner — filters out falsy values so callers can use
 * conditional expressions inline. It does not merge: two classes setting the
 * same property both survive, and the winner is decided by stylesheet order.
 * Choose, don't override.
 */
export function cn(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ")
}
