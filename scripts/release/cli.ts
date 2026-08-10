// Temporary bootstrap shim for the validator that is currently deployed on dev.
// Delete this file only after the new dev validator has successfully checked a follow-up PR.
import { runLegacyPrValidation } from "../../tools/release-automation/src/validation/legacy-pr-validation";

await runLegacyPrValidation(Bun.argv.slice(2));
