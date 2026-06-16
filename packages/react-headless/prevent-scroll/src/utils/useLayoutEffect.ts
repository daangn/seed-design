// This code includes portions derived from adobe/react-spectrum (https://github.com/adobe/react-spectrum)
// Used under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0
//
// Source: packages/react-aria/src/utils/useLayoutEffect.ts

import * as React from "react";

// During SSR, React warns when calling useLayoutEffect. Since neither useLayoutEffect nor
// useEffect run on the server, replace it with a noop there to suppress the warning.
export const useLayoutEffect: typeof React.useLayoutEffect =
  typeof document !== "undefined" ? React.useLayoutEffect : () => {};
