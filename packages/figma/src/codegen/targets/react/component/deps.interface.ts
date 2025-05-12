import type { IconHandler } from "../icon";
import type { ReactValueResolver } from "../value-resolver";

export interface ComponentHandlerDeps {
  iconHandler: IconHandler;
  valueResolver: ReactValueResolver;
}
