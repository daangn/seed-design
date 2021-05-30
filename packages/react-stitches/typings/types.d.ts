declare module 'lodash.kebabcase' {
  import type { KebabCase } from 'type-fest';
  export default function kebabcase<str extends string>(str: str): KebabCase<str>;
}
