export interface ComponentModel {
  kind: "Component";
  metadata: {
    id: string;
    name: string;
  };
  data: ComponentExpression;
}

export interface TokenCollectionModel {
  kind: "TokenCollection";
  metadata: {
    id: string;
    name: string;
  };
  data: TokenCollectionExpression;
}

export interface TokenCollectionExpression {
  [x: string]: string;
}

export interface Token {
  category: string;
  group: string[];
  key: string | number;
}

export interface ComponentExpression {
  [variantExpression: string]: {
    [state: string]: {
      [slot: string]: {
        [property: string]: string;
      };
    };
  };
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
