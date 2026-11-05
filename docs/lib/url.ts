/** Whether an href points off-site (an absolute http/https URL). */
export function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}
