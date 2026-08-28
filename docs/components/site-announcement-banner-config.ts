export interface SiteAnnouncementBannerConfig {
  /** Change the id when a new announcement should be shown to previously dismissed visitors. */
  id: string;
  enabled: boolean;
  message: string;
  href: string;
  /** Inclusive calendar dates in Asia/Seoul, formatted as YYYY-MM-DD. */
  startDate?: string;
  endDate?: string;
}

export const SITE_ANNOUNCEMENT_BANNER = {
  id: "design-engineer-article-2026-08",
  enabled: true,
  message: "우리는 왜 디자인 엔지니어를 찾게 됐을까",
  href: "/updates/why-we-hired-a-design-engineer",
  startDate: "2026-08-25",
  endDate: "2026-09-30",
} satisfies SiteAnnouncementBannerConfig;

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidDateOnly(value: string): boolean {
  const match = DATE_ONLY_PATTERN.exec(value);
  if (!match) return false;

  const [, year, month, day] = match;
  const parsed = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  return (
    parsed.getUTCFullYear() === Number(year) &&
    parsed.getUTCMonth() === Number(month) - 1 &&
    parsed.getUTCDate() === Number(day)
  );
}

export function getDateInSeoul(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = new Map(parts.map(({ type, value }) => [type, value]));

  return `${values.get("year")}-${values.get("month")}-${values.get("day")}`;
}

export function isSiteAnnouncementBannerActive(
  config: SiteAnnouncementBannerConfig,
  today = getDateInSeoul(),
): boolean {
  if (!config.enabled || !isValidDateOnly(today)) return false;
  if (config.startDate && (!isValidDateOnly(config.startDate) || today < config.startDate)) {
    return false;
  }
  if (config.endDate && (!isValidDateOnly(config.endDate) || today > config.endDate)) {
    return false;
  }

  return true;
}
