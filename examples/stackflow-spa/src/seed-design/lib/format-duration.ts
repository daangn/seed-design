function toDurationParts(seconds: number) {
  const totalSeconds = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;

  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Formats a duration in seconds as `m:ss` below an hour and `h:mm:ss` from an hour on,
 * following the `durationUnit` patterns of the Unicode CLDR `en` locale, such as "1:02:05".
 * Fractions of a second are dropped, and hours keep counting past a day.
 * Negative or non-finite values show "0:00".
 */
export function formatDuration(seconds: number): string {
  if (process.env.NODE_ENV !== "production" && !(Number.isFinite(seconds) && seconds >= 0)) {
    console.warn(
      `formatDuration: Expected a finite, non-negative number of seconds but received ${seconds}. Showing 0:00 instead. This warning will not be shown in production builds.`,
    );
  }

  const parts = toDurationParts(seconds);

  if (parts.hours === 0) return `${parts.minutes}:${pad(parts.seconds)}`;

  return `${parts.hours}:${pad(parts.minutes)}:${pad(parts.seconds)}`;
}

/**
 * Builds a Korean duration phrase for screen readers, such as "1시간 2분 5초".
 * Units that are zero are left out, and a zero duration reads "0초".
 * Fractions of a second are dropped, and negative or non-finite values count as zero.
 */
export function formatDurationLabel(seconds: number): string {
  const parts = toDurationParts(seconds);
  const label = [
    ...(parts.hours > 0 ? [`${parts.hours}시간`] : []),
    ...(parts.minutes > 0 ? [`${parts.minutes}분`] : []),
    ...(parts.seconds > 0 ? [`${parts.seconds}초`] : []),
  ].join(" ");

  return label || "0초";
}

// `Intl.DurationFormat`을 지원하면 이 구현을 쓴다.
export function _formatDurationLabelIntl(seconds: number): string {
  const parts = toDurationParts(seconds);
  if (parts.hours === 0 && parts.minutes === 0 && parts.seconds === 0) return "0초";

  return new Intl.DurationFormat("ko", { style: "long" }).format(parts);
}
