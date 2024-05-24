import { useActions } from "@stackflow/react";

import type { TypeUseFlow } from "./Stack";

/**
 * `stackflow()` 함수에서 반환받은 `useFlow()` 함수를 그대로 써도 큰 문제는 없지만,
 * 해당 함수를 쓰게 되면 런타임에 Circular Dependency가 발생하게 돼요.
 * 따라서, 자동완성을 위해 타입만 가져다쓰고 런타임은 의존하지 않도록 useActions를 활용해 useFlow를 다시 생성합니다.
 * https://stackflow.so/advanced/fix-use-flow
 */
export const useFlow: TypeUseFlow = () => useActions();
