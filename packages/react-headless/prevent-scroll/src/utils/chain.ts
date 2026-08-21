// This code includes portions derived from adobe/react-spectrum (https://github.com/adobe/react-spectrum)
// Used under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0
//
// Source: packages/react-aria/src/utils/chain.ts

type Cleanup = () => void;

/**
 * Calls each provided callback in order. Non-function values (e.g. a short-circuited `false`)
 * are skipped, so callers can pass `condition && cleanup`.
 */
export function chain(...callbacks: Array<Cleanup | false | null | undefined>): Cleanup {
  return () => {
    for (const callback of callbacks) {
      if (typeof callback === "function") callback();
    }
  };
}
