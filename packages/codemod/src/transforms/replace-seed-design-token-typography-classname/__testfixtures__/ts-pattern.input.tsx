// @ts-nocheck

import { classNames } from "@seed-design/design-token";
import { match } from "ts-pattern";

match(size)
  .with("large", () => classNames.$semantic.typography.label3Bold)
  .with("medium", () => classNames.$semantic.typography.label3Bold)
  .with("small", () => classNames.$semantic.typography.label3Bold)
  .with("xsmall", () => classNames.$semantic.typography.label4Bold)
  .exhaustive();
