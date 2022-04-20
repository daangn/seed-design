import * as vars from './vars';

type LooseValueType<T> = (
    T extends object ? { readonly [K in keyof T]: LooseValueType<T[K]> }
  : T extends string ? string
  : never
);

export type TokenObject = LooseValueType<typeof vars>;
