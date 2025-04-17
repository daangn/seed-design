import type * as NewComponents from "../data/__generated__/v3-component-sets";
import type * as NewComponentsPrivate from "../data/v3-component-sets-private";
import type * as OldComponents from "../data/__generated__/v2-component-sets";
import type * as OldComponentsPrivate from "../data/v2-component-sets-private";

type AllNewComponents = typeof NewComponents & typeof NewComponentsPrivate;
type AllOldComponents = typeof OldComponents & typeof OldComponentsPrivate;

// 생성된 컴포넌트 메타데이터로부터 Registry 타입 추출
export type ComponentMetadata = {
  name: string;
  key: string;
  componentPropertyDefinitions: {
    [key: string]: {
      type: "VARIANT" | "BOOLEAN" | "TEXT" | "INSTANCE_SWAP";
      defaultValue?: string | boolean;
      variantOptions?: readonly string[];
      preferredValues?: readonly { type: "COMPONENT" | "COMPONENT_SET"; key: string }[];
    };
  };
};

// Variant 프로퍼티 추출을 위한 타입 헬퍼
type ExtractVariantProperties<T extends ComponentMetadata> = {
  [K in keyof T["componentPropertyDefinitions"]]: T["componentPropertyDefinitions"][K] extends {
    type: "VARIANT";
    variantOptions: readonly string[];
  }
    ? K
    : never;
}[keyof T["componentPropertyDefinitions"]];

// Variant 값 추출을 위한 타입 헬퍼
type ExtractVariantValues<
  T extends ComponentMetadata,
  K extends ExtractVariantProperties<T>,
> = T["componentPropertyDefinitions"][K] extends {
  variantOptions: readonly string[];
}
  ? T["componentPropertyDefinitions"][K]["variantOptions"][number]
  : never;

// Variant 키 생성
type CreateVariantKey<K extends string, V extends string> = `${K}:${V}`;

// Variant 키 조합
type VariantKeys<T extends ComponentMetadata> = {
  [K in ExtractVariantProperties<T>]: CreateVariantKey<K & string, ExtractVariantValues<T, K>>;
}[ExtractVariantProperties<T>];

// 컴포넌트 구조 추론 타입
export type InferredComponentStructure = {
  children: {
    [key: string]: NodeStructure;
  };
};

// 컴포넌트 이름 추출 타입 헬퍼
type ExtractComponentName<T> = T extends { name: infer Name } ? Name : never;

// 컴포넌트 추출 타입 헬퍼 수정
type ExtractComponentByName<T, Name> = T extends { name: Name } & ComponentMetadata ? T : never;

// ComponentMapping 타입
export type ComponentMapping<
  Old extends ExtractComponentName<AllOldComponents[keyof AllOldComponents]>,
  New extends ExtractComponentName<AllNewComponents[keyof AllNewComponents]>,
> = {
  oldComponent: Old;
  newComponent: New;
  variantMap?: Partial<
    Record<
      VariantKeys<ExtractComponentByName<AllOldComponents[keyof AllOldComponents], Old>>,
      VariantKeys<ExtractComponentByName<AllNewComponents[keyof AllNewComponents], New>>
    >
  >;
  calculateProperties: (
    oldProperties: InferredComponentProperties<
      ExtractComponentByName<AllOldComponents[keyof AllOldComponents], Old>
    >,
    oldComponentStructure?: InferredComponentStructure,
  ) => NewComponentProperties<New>;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  childrenMappings?: ComponentMapping<any, any>[];
  swappableVariants?: SwappableVariant<Old, New>[];
};
// 컴포넌트 프로퍼티 값 타입 추론
export type InferredComponentProperties<T extends ComponentMetadata> = {
  [K in keyof T["componentPropertyDefinitions"]]: {
    value: T["componentPropertyDefinitions"][K] extends {
      type: "VARIANT";
      variantOptions: readonly string[];
    }
      ? T["componentPropertyDefinitions"][K]["variantOptions"][number]
      : T["componentPropertyDefinitions"][K] extends {
            type: "BOOLEAN";
          }
        ? boolean
        : T["componentPropertyDefinitions"][K] extends {
              type: "TEXT";
            }
          ? string
          : T["componentPropertyDefinitions"][K] extends {
                type: "INSTANCE_SWAP";
              }
            ? string
            : never;
  };
};
// NewComponentProperties 타입
export type NewComponentProperties<
  ComponentName extends ExtractComponentName<AllNewComponents[keyof AllNewComponents]>,
> = Partial<{
  [K in keyof ExtractComponentByName<
    AllNewComponents[keyof AllNewComponents],
    ComponentName
  >["componentPropertyDefinitions"]]: ExtractComponentByName<
    AllNewComponents[keyof AllNewComponents],
    ComponentName
  >["componentPropertyDefinitions"][K] extends {
    type: "VARIANT";
    variantOptions: readonly string[];
  }
    ? ExtractComponentByName<
        AllNewComponents[keyof AllNewComponents],
        ComponentName
      >["componentPropertyDefinitions"][K]["variantOptions"][number]
    : ExtractComponentByName<
          AllNewComponents[keyof AllNewComponents],
          ComponentName
        >["componentPropertyDefinitions"][K] extends {
          type: "BOOLEAN";
        }
      ? boolean
      : ExtractComponentByName<
            AllNewComponents[keyof AllNewComponents],
            ComponentName
          >["componentPropertyDefinitions"][K] extends {
            type: "TEXT";
          }
        ? string
        : ExtractComponentByName<
              AllNewComponents[keyof AllNewComponents],
              ComponentName
            >["componentPropertyDefinitions"][K] extends {
              type: "INSTANCE_SWAP";
            }
          ? string
          : never;
}>;

// 컴포넌트 트리 노드 타입
export type ComponentTreeNode = {
  id: string;
  componentName: string;
  componentProperties: ComponentProperties;
  children: ComponentTreeNode[];
};

// 노드 구조 타입
export interface NodeStructure {
  value?: NodeValue;
  type: NodeType;
  children?: {
    [key: string]: NodeStructure;
  };
}

// 컴포넌트 구조 타입
export interface ComponentStructure {
  children: {
    [key: string]: NodeStructure;
  };
}

// SwappableVariant 타입
export type SwappableVariant<
  Old extends ExtractComponentName<AllOldComponents[keyof AllOldComponents]>,
  New extends ExtractComponentName<AllNewComponents[keyof AllNewComponents]>,
> = {
  oldVariant: VariantKeys<ExtractComponentByName<AllOldComponents[keyof AllOldComponents], Old>>;
  newVariants: VariantKeys<ExtractComponentByName<AllNewComponents[keyof AllNewComponents], New>>;
  description?: string;
};

// 노드 값 타입
type NodeValue = string | number | boolean;

// 컴포넌트 프로퍼티 타입
type ComponentProperties = Record<string, { value: string | boolean }>;

// 노드 타입 (이 부분은 실제 사용하는 타입에 맞게 수정 필요)
type NodeType = string;
