export type Assign<T, U> = Omit<T, keyof U> & U;
