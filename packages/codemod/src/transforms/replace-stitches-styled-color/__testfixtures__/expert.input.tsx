// @ts-nocheck

const SemanticColorTestComponent = styled('div', {
  // Semantic Color 테스트
  color: '$semantic-primary',
  color: '$semantic-onPrimary',
  color: '$semantic-primaryLow',
  color: '$semantic-secondary',
  color: '$semantic-secondaryLow',
  color: '$semantic-success',
  color: '$semantic-successLow',
  color: '$semantic-warning',
  color: '$semantic-warningLow',
  color: '$semantic-danger',
  color: '$semantic-dangerLow',
  color: '$semantic-overlayDim',
  color: '$semantic-overlayLow',
  color: '$semantic-paperSheet',
  color: '$semantic-paperDialog',
  color: '$semantic-paperFloating',
  color: '$semantic-paperContents',
  color: '$semantic-paperDefault',
  color: '$semantic-paperBackground',
  color: '$semantic-paperAccent',
  color: '$semantic-primaryHover',
  color: '$semantic-primaryPressed',
  color: '$semantic-primaryLowHover',
  color: '$semantic-primaryLowActive',
  color: '$semantic-primaryLowPressed',
  color: '$semantic-grayHover',
  color: '$semantic-grayPressed',
  color: '$semantic-onGrayOverlay50',
  color: '$semantic-divider1',
  color: '$semantic-divider2',
  color: '$semantic-divider3',
  color: '$semantic-accent',
  color: '$semantic-inkText',
  color: '$semantic-inkTextLow',
  color: '$semantic-grayActive',
});

const ScaleColorTestComponent = styled('div', {
  // Scale Color Gray 테스트
  color: "$scale-gray00",
  color: "$scale-gray50",
  color: "$scale-gray100",
  color: "$scale-gray200",
  color: "$scale-gray300",
  color: "$scale-gray400",
  color: "$scale-gray500",
  color: "$scale-gray600",
  color: "$scale-gray700",
  color: "$scale-gray800",
  color: "$scale-gray900",
  color: "$scale-grayAlpha50",
  color: "$scale-grayAlpha100",
  color: "$scale-grayAlpha200",
  color: "$scale-grayAlpha500",

  // Scale Color Carrot 테스트
  color: "$scale-carrot50",
  color: "$scale-carrot100",
  color: "$scale-carrot200",
  color: "$scale-carrot300",
  color: "$scale-carrot400",
  color: "$scale-carrot500",
  color: "$scale-carrot600",
  color: "$scale-carrot700",
  color: "$scale-carrot800",
  color: "$scale-carrot900",
  color: "$scale-carrot950",
  color: "$scale-carrotAlpha50",
  color: "$scale-carrotAlpha100",
  color: "$scale-carrotAlpha200",
});

const StaticColorTestComponent = styled('div', {
  // Static Color 테스트
  color: '$static-staticBlack',
  color: '$static-staticWhite',
  color: '$static-staticGray900',
  color: '$static-staticCarrot50',
  color: '$static-staticCarrot800',
  color: '$static-staticGreen50',
  color: '$static-staticGreen800',
  color: '$static-staticYellow50',
  color: '$static-staticYellow800',
  color: '$static-staticRed50',
  color: '$static-staticRed800',
  color: '$static-staticBlue50',
  color: '$static-staticBlue800',
  color: '$static-staticBlackAlpha200',
  color: '$static-staticBlackAlpha500',
  color: '$static-staticWhiteAlpha200',

  css: {
    color: '$static-staticBlack',
    color: '$static-staticWhite',
  }
});

const StaticColorTestComponent2 = styled('div', {
  // Static Color 테스트
  color: '$static-black',
  color: '$static-white',
  color: '$static-gray900',
  color: '$static-carrot50',
  color: '$static-carrot800',
  color: '$static-green50',
  color: '$static-green800',
  color: '$static-yellow50',
  color: '$static-yellow800',
  color: '$static-red50',
  color: '$static-red800',
  color: '$static-blue50',
  color: '$static-blue800',
  color: '$static-blackAlpha200',
  color: '$static-blackAlpha500',
  color: '$static-whiteAlpha200',

  css: {
    color: '$static-staticBlack',
    color: '$static-staticWhite',
  }
});

const CompoundVariantsTestComponent = styled('div', {
  compoundVariants: [
    {
      shape: 'square',
      size: 'large',
      css: {
        borderRadius: rem(3),
      },
    },
    {
      color: 'basic',
      style: 'filledLow',
      css: {
        backgroundColor: '$scale-gray100',
        color: '$scale-gray700',
      },
    },
    {
      color: 'basic',
      style: 'outlined',
      css: {
        color: '$scale-gray900',
      },
    },
    {
      color: 'basic',
      style: 'filled',
      css: {
        backgroundColor: '$scale-gray700',
        color: '$scale-gray00',
      },
    },
    {
      color: 'primary',
      style: 'filledLow',
      css: {
        backgroundColor: '$scale-carrotAlpha100',
        color: '$semantic-primary',
      },
    },
    {
      color: 'primary',
      style: 'outlined',
      css: {
        color: '$semantic-primary',
      },
    },
    {
      color: 'primary',
      style: 'filled',
      css: {
        backgroundColor: '$semantic-primary',
        color: '$semantic-onPrimary',
      },
    },
    {
      color: 'success',
      style: 'filledLow',
      css: {
        backgroundColor: '$semantic-successLow',
        color: '$scale-green700',
      },
    },
    {
      color: 'success',
      style: 'outlined',
      css: {
        color: '$semantic-success',
      },
    },
    {
      color: 'success',
      style: 'filled',
      css: {
        backgroundColor: '$semantic-success',
        color: '$static-staticWhite',
      },
    },
    {
      color: 'error',
      style: 'filledLow',
      css: {
        backgroundColor: '$semantic-dangerLow',
        color: '$semantic-danger',
      },
    },
    {
      color: 'error',
      style: 'outlined',
      css: {
        color: '$semantic-danger',
      },
    },
    {
      color: 'error',
      style: 'filled',
      css: {
        backgroundColor: '$semantic-danger',
        color: '$static-staticWhite',
      },
    },
    {
      color: 'blue',
      style: 'filledLow',
      css: {
        backgroundColor: '$scale-blue50',
        color: '$scale-blue800',
      },
    },
    {
      color: 'blue',
      style: 'outlined',
      css: {
        color: '$scale-blue500',
      },
    },
    {
      color: 'blue',
      style: 'filled',
      css: {
        backgroundColor: "$palette-blue-600",
        color: "$palette-static-white",
      },
    },
  ],
});