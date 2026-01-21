export interface SanityImageType {
  _type: "image";
  _key: string;
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export type PlatformStatus = "ready" | "not-ready" | "in-progress" | "deprecated" | "not-planned";

export interface ComponentData {
  id: string;
  name: string;
  deprecated?: boolean;
  deprecatedMessage?: string;
  iosStatus: PlatformStatus;
  iosUrl?: string;
  iosNote?: string;
  androidStatus: PlatformStatus;
  androidUrl?: string;
  androidNote?: string;
  reactStatus: PlatformStatus;
  reactUrl?: string;
  reactNote?: string;
  figmaStatus: PlatformStatus;
  figmaUrl?: string;
  figmaNote?: string;
}
