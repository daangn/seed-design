export type ProgressStatus = "todo" | "in-progress" | "done";
type CommonPlatformData = { status: ProgressStatus };

type PlatformNativeData = {
  alias?: string;
  path?: string;
} & CommonPlatformData;

export interface ProgressBoardRowInterface {
  title?: string;
  ios?: PlatformNativeData;
  android?: PlatformNativeData;
  react?: PlatformNativeData;
  figma?: PlatformNativeData;
}
