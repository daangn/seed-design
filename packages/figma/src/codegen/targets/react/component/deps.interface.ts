import type { IconHandler } from "../icon";
import type { ReactValueResolver } from "../value-resolver";

export interface SeedComponentHandlerDeps {
  iconHandler: IconHandler;
  valueResolver: ReactValueResolver;
}
