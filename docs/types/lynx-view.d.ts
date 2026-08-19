import type { HTMLAttributes, RefAttributes } from "react";
import type { LynxViewElement } from "@lynx-js/web-core/client";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "lynx-view": HTMLAttributes<LynxViewElement> & RefAttributes<LynxViewElement>;
    }
  }
}
