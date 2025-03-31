export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-03-23";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "mokd6dka",
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const viewerToken =
  process.env.SANITY_API_READ_TOKEN || (localStorage.getItem("SANITY_API_READ_TOKEN") ?? undefined);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
