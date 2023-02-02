export type ProgressStatus = "todo" | "in-progress" | "done";
type CommonPlatformData = { status: ProgressStatus };
type PlatformDocsItem = { slug?: string } & CommonPlatformData;

type PlatformNativeData = {
  alias?: string;
  path?: string;
} & CommonPlatformData;

export interface ProgressBoardRowInterface {
  title?: string;
  ios?: PlatformNativeData;
  android?: PlatformNativeData;
  react?: PlatformNativeData;
  usage?: PlatformDocsItem;
  style?: PlatformDocsItem;
  overview?: PlatformDocsItem;
}
