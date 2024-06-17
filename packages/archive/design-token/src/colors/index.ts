import type { ColorTheme } from './types';

export const light: Readonly<ColorTheme> = Object.freeze({
  scheme: {
    '$white': '#FFF',

    // gray
    '$gray100': '#F2F3F6',
    '$gray200': '#EAEBEE',
    '$gray300': '#DCDEE3',
    '$gray400': '#D1D3D8',
    '$gray500': '#ADB1BA',
    '$gray600': '#868B94',
    '$gray700': '#4D5159',
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
    '$yellow800': '#CE6400',

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
  },

  // Note: getter 를 쓰면 this 참조를 통해 즉시 값을 populate 할 수 있으나, 값보다는 심볼을 사용하는 경우가 더 많아서 이대로 놔둠
  semanticScheme: {
    background: '$white',
    backgroundLow: '$gray100',
  },
});

export const dark: Readonly<ColorTheme> = Object.freeze({
  scheme: {
    '$white': '#212124',

    // gray
    '$gray100': '#2B2E33',
    '$gray200': '#34373D',
    '$gray300': '#43474F',
    '$gray400': '#50545C',
    '$gray500': '#6D717A',
    '$gray600': '#868B94',
    '$gray700': '#ADB1BA',
    '$gray900': '#EAEBEE',

    // 메인컬러
    '$carrot50':  '#EDE4E0',
    '$carrot100': '#EDD3C4',
    '$carrot200': '#EDC4AD',
    '$carrot300': '#EDB08E',
    '$carrot400': '#EE9561',
    '$carrot500': '#ED7735',
    '$carrot600': '#E96017',

    // 주의
    '$yellow50':  '#EDE6D6',
    '$yellow500': '#EDB84E',
    '$yellow800': '#C05F03',

    // 긍정, 성공
    '$green50' : '#D8E9E5',
    '$green500': '#03A88A',
    '$green800': '#03836C',

    // 경고, 위험
    '$red50' : '#EDE2E2',
    '$red800': '#D81403',

    // 추가 링크
    '$blue50' : '#DBE6E9',
    '$blue800': '#0C7EAB',
  },

  // Note: getter 를 쓰면 this 참조를 통해 즉시 값을 populate 할 수 있으나, 값보다는 심볼을 사용하는 경우가 더 많아서 이대로 놔둠 
  semanticScheme: {
    background: '$white',
    backgroundLow: '#17171A',
  },
});
