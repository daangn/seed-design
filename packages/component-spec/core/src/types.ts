export interface Model {
  kind: string;
  metadata: {
    name: string;
  };
}

export interface NestedExpression {
  [variantExpression: string]: {
    [state: string]: {
      [slot: string]: {
        [property: string]: string;
      };
    };
  };
}

export interface Token {
  category: string;
  group: string[];
  key: string | number;
}

export type ParsedExpression = Array<{
  key: Record<string, string>;
  state: Array<{
    key: string[];
    slot: Array<{
      key: string;
      property: Array<{
        key: string;
        value: Token | string | Array<Token | string>;
      }>;
    }>;
  }>;
}>;
