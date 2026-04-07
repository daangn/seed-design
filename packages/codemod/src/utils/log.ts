import colors from "picocolors";

export const LOG_PREFIX = colors.bold("@ride-developer/codemod");

interface TrackParams {
  event: string;
  properties: Record<string, unknown>;
}

export const createTrack = (metadata?: Record<string, unknown>) => {
  return ({ event, properties }: TrackParams) =>
    console.log(LOG_PREFIX, event, properties, metadata);
};
