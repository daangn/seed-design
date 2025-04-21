import type { VariableValueResolved } from "@/entities";
import type { NormalizedSceneNode } from "@/normalizer";
import { objectEntries } from "@/utils/common";
import type { ElementNode } from "./jsx";

export type PropsTransformer<
  T extends Record<string, any> = Record<string, any>,
  R extends Record<string, any> = Record<string, any>,
> = (node: T, traverse: (node: NormalizedSceneNode) => ElementNode | undefined) => R;

export function definePropsTransformer<
  T extends Record<string, any>,
  R extends Record<string, any>,
>(transformer: PropsTransformer<T, R>) {
  return transformer;
}

type Handlers<
  TTrait extends Record<string, VariableValueResolved>,
  TProps extends Record<string, any>,
  HandlerKeys extends keyof TProps = keyof TProps,
> = {
  [K in HandlerKeys]: (node: TTrait) => TProps[K];
};

type Shorthands<TProps extends Record<string, any>, HandlerKeys extends keyof TProps> = Record<
  Exclude<keyof TProps, HandlerKeys>,
  HandlerKeys[]
>;

export interface PropsTransformerConfig<
  TTrait extends Record<string, any>,
  TProps extends Record<string, any>,
  HandlerKeys extends keyof TProps,
> {
  _types: {
    trait: TTrait;
    props: TProps;
  };
  handlers: Handlers<TTrait, TProps, HandlerKeys>;
  shorthands?: Shorthands<TProps, HandlerKeys>;
  defaults?: Partial<TProps>;
}

export function createPropsTransformer<
  TTrait extends Record<string, any>,
  TProps extends Record<string, any>,
  HandlerKeys extends keyof TProps,
>({
  handlers,
  shorthands,
  defaults,
}: PropsTransformerConfig<TTrait, TProps, HandlerKeys>): PropsTransformer<TTrait, TProps> {
  return definePropsTransformer((node: TTrait) => {
    const result = {} as TProps;

    for (const [prop, handler] of objectEntries(handlers)) {
      const value = handler(node);
      if (value !== undefined && (!defaults || value !== defaults[prop as keyof TProps])) {
        result[prop as keyof TProps] = value as any;
      }
    }

    if (shorthands) {
      for (const [shorthand, props] of objectEntries(shorthands)) {
        const values = props.map((prop) => result[prop as keyof TProps]);
        const allDefined = values.every((value) => value !== undefined);
        const allEqual = allDefined && values.every((value) => value === values[0]);

        if (allEqual && values[0] !== undefined) {
          result[shorthand as keyof TProps] = values[0] as any;
          for (const prop of props) {
            delete result[prop as keyof TProps];
          }
        }
      }
    }

    return result;
  });
}
