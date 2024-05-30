import { useActions, useStepActions } from "@stackflow/react";

import type { TypeUseFlow, TypeUseStepFlow } from "./Stack";

export const useFlow: TypeUseFlow = useActions;
export const useStepFlow: TypeUseStepFlow = useStepActions;
