import type { SyncCheck } from "../types";
import { generationStaleCheck } from "./generation-stale";
import { headlessReactCheck } from "./headless-react";
import { newComponentCheck } from "./new-component";
import { rootageRecipeCheck } from "./rootage-recipe";

export const allChecks: SyncCheck[] = [
  newComponentCheck,
  headlessReactCheck,
  rootageRecipeCheck,
  generationStaleCheck,
];
