/**
 * Screen reader announcement utility.
 * Updates the aria-live region so assistive technology reads the message.
 */
export function announce(message: string) {
  const el = document.getElementById('sr-announce');
  if (!el) return;
  // Clear then set to trigger re-announcement even for identical messages
  el.textContent = '';
  requestAnimationFrame(() => { el.textContent = message; });
}
