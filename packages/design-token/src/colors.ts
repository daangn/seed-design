type MakeTokenSet<T extends KnownColorGroup, TLightness extends number[]> = `$${T}${TLightness[number]}`;
export type ColorToken = (
  | MakeTokenSet<'gray', [100, 200, 300, 400, 500, 600, 650, 700, 800, 850, 900]>
  | MakeTokenSet<'carrot', [50, 100, 200, 300, 400, 500, 600]>
  | MakeTokenSet<'yellow', [50, 500, 800]>
  | MakeTokenSet<'green', [50, 500, 800]>
  | MakeTokenSet<'red', [50, 800]>
  | MakeTokenSet<'blue', [50, 800]>
);

export type ColorScheme = Record<ColorToken, string>;
export const light: Readonly<ColorScheme> = Object.freeze({
  // gray
  '$gray100': '#F2F3F6',
  '$gray200': '#EAEBEE',
  '$gray300': '#DCDEE3',
  '$gray400': '#D1D3D8',
  '$gray500': '#ADB1BA',
  '$gray600': '#868B94',
  '$gray650': '#6D717A',
  '$gray700': '#4D5159',
  '$gray800': '#393C42',
  '$gray850': '#2B2E33',
  '$gray900': '#212124',

  // 메인컬러
  '$carrot50':  '#FFF5F0',
  '$carrot100': '#FFE2D2',
  '$carrot200': '#FFD2B9',
  '$carrot300': '#FFBC97',
  '$carrot400': '#FF9E66',
  '$carrot500': '#FF7E36',
  '$carrot600': '#FA6616',

  // 주의
  '$yellow50':  '#FFF7E6',
  '$yellow500': '#FFC552',
  '$yellow800': '#CF6400',

  // 긍정, 성공
  '$green50' : '#E8FAF6',
  '$green500': '#00B493',
  '$green800': '#008C72',

  // 경고, 위험
  '$red50' : '#FFF3F2',
  '$red800': '#E81300',

  // 추가 링크
  '$blue50' : '#EBF7FA',
  '$blue800': '#0A86B7',
});

export default light;

const knownColorGroupNames = ['gray', 'carrot', 'yellow', 'green', 'red', 'blue'] as const;
type KnownColorGroup = typeof knownColorGroupNames[number];
export function isKnownColorGroup(str: string): str is KnownColorGroup {
  return knownColorGroupNames.includes(str as KnownColorGroup);
}

type ColorValue = [Token: ColorToken, Group: KnownColorGroup, Lightness: number];
export function parseToken(token: string): ColorValue {
  const COLOR_TOKEN_REGEXP = /\$(?<Group>[a-z]+)(?<Lightness>\d+)$/;

  const result = token.match(COLOR_TOKEN_REGEXP);
  const group = result?.groups?.['Group'];
  const lightness = result?.groups?.['Lightness'];

  if (group == null || lightness == null) {
    throw new TypeError(`Invalid color token: ${token}`);
  }

  if (!isKnownColorGroup(group)) {
    throw new TypeError(`${group} is unknown color group`);
  }

  return [token as ColorToken, group, parseInt(lightness)];
}

type ColorStyle = [Token: ColorToken, Value: string];
type ColorStyleMap = Record<KnownColorGroup, ColorStyle[]>;
export function toStyleMap(scheme: ColorScheme): ColorStyleMap {
  return Object.entries(scheme).reduce((acc, [k, v]) => {
    const [token, group] = parseToken(k);
    const style: ColorStyle = [token, v];
    acc[group]?.push(style) ?? (acc[group] = [style]);
    return acc;
  }, {} as ColorStyleMap);
}
