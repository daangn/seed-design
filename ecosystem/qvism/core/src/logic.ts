export const not = (fn: (arg: string) => boolean) => (arg: string) => !fn(arg);

export const isBooleanString = (key: string): key is "true" | "false" =>
  ["true", "false"].includes(key);

export const booleanStringToBoolean = (key: "true" | "false"): boolean => key === "true";
