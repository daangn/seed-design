// @ts-nocheck

const SemanticColorTestComponent = styled('div', {
  // Semantic Color 테스트
  color: '$primary-semantic',
  color: '$onPrimary-semantic',
  color: '$primaryLow-semantic',
  color: '$secondary-semantic',
  color: '$secondaryLow-semantic',
  color: '$success-semantic',
  color: '$successLow-semantic',
  color: '$warning-semantic',
  color: '$warningLow-semantic',
  color: '$danger-semantic',
  color: '$dangerLow-semantic',
  color: '$overlayDim-semantic',
  color: '$overlayLow-semantic',
  color: '$paperSheet-semantic',
  color: '$paperDialog-semantic',
  color: '$paperFloating-semantic',
  color: '$paperContents-semantic',
  color: '$paperDefault-semantic',
  color: '$paperBackground-semantic',
  color: '$paperAccent-semantic',
  color: '$primaryHover-semantic',
  color: '$primaryPressed-semantic',
  color: '$primaryLowHover-semantic',
  color: '$primaryLowActive-semantic',
  color: '$primaryLowPressed-semantic',
  color: '$grayHover-semantic',
  color: '$grayPressed-semantic',
  color: '$onPrimaryOverlay50-semantic',
  color: '$onPrimaryOverlay200-semantic',
  color: '$onPrimaryLowOverlay50-semantic',
  color: '$onPrimaryLowOverlay100-semantic',
  color: '$onPrimaryLowOverlay200-semantic',
  color: '$onGrayOverlay50-semantic',
  color: '$onGrayOverlay100-semantic',
  color: '$divider1-semantic',
  color: '$divider2-semantic',
  color: '$divider3-semantic',
  color: '$accent-semantic',
  color: '$inkText-semantic',
  color: '$inkTextLow-semantic',
  color: '$grayActive-semantic',
});

const ScaleColorTestComponent = styled('div', {
  // Scale Color Gray 테스트
  color: '$gray00',
  color: '$gray50',
  color: '$gray100',
  color: '$gray200',
  color: '$gray300',
  color: '$gray400',
  color: '$gray500',
  color: '$gray600',
  color: '$gray700',
  color: '$gray800',
  color: '$gray900',
  color: '$grayAlpha50',
  color: '$grayAlpha100',
  color: '$grayAlpha200',
  color: '$grayAlpha500',
  
  // Scale Color Carrot 테스트
  color: '$carrot50',
  color: '$carrot100',
  color: '$carrot200',
  color: '$carrot300',
  color: '$carrot400',
  color: '$carrot500',
  color: '$carrot600',
  color: '$carrot700',
  color: '$carrot800',
  color: '$carrot900',
  color: '$carrot950',
  color: '$carrotAlpha50',
  color: '$carrotAlpha100',
  color: '$carrotAlpha200',
  
  // Scale Color Blue 테스트
  color: '$blue50',
  color: '$blue100',
  color: '$blue200',
  color: '$blue300',
  color: '$blue400',
  color: '$blue500',
  color: '$blue600',
  color: '$blue700',
  color: '$blue800',
  color: '$blue900',
  color: '$blue950',
  color: '$blueAlpha50',
  color: '$blueAlpha100',
  color: '$blueAlpha200',
  
  // Scale Color Red 테스트
  color: '$red50',
  color: '$red100',
  color: '$red200',
  color: '$red300',
  color: '$red400',
  color: '$red500',
  color: '$red600',
  color: '$red700',
  color: '$red800',
  color: '$red900',
  color: '$red950',
  color: '$redAlpha50',
  color: '$redAlpha100',
  color: '$redAlpha200',
  
  // Scale Color Green 테스트
  color: '$green50',
  color: '$green100',
  color: '$green200',
  color: '$green300',
  color: '$green400',
  color: '$green500',
  color: '$green600',
  color: '$green700',
  color: '$green800',
  color: '$green900',
  color: '$green950',
  color: '$greenAlpha50',
  color: '$greenAlpha100',
  color: '$greenAlpha200',
  
  // Scale Color Yellow 테스트
  color: '$yellow50',
  color: '$yellow100',
  color: '$yellow200',
  color: '$yellow300',
  color: '$yellow400',
  color: '$yellow500',
  color: '$yellow600',
  color: '$yellow700',
  color: '$yellow800',
  color: '$yellow900',
  color: '$yellow950',
  color: '$yellowAlpha50',
  color: '$yellowAlpha100',
  color: '$yellowAlpha200',
  
  // Scale Color Purple 테스트
  color: '$purple50',
  color: '$purple100',
  color: '$purple200',
  color: '$purple300',
  color: '$purple400',
  color: '$purple500',
  color: '$purple600',
  color: '$purple700',
  color: '$purple800',
  color: '$purple900',
  color: '$purple950',
});

const StaticColorTestComponent = styled('div', {
  // Static Color 테스트
  color: '$black-static',
  color: '$white-static',
  color: '$gray900-static',
  color: '$carrot50-static',
  color: '$carrot800-static',
  color: '$green50-static',
  color: '$green800-static',
  color: '$yellow50-static',
  color: '$yellow800-static',
  color: '$red50-static',
  color: '$red800-static',
  color: '$blue50-static',
  color: '$blue800-static',
  color: '$blackAlpha200-static',
  color: '$blackAlpha500-static',
  color: '$whiteAlpha50-static',
  color: '$whiteAlpha200-static',
});

// 복합 속성 테스트
const ComplexPropertyTestComponent = styled('div', {
  border: '1px solid $gray700',
  boxShadow: '0 0 10px $overlayDim-semantic',
  outline: '2px solid $accent-semantic',
  textDecoration: 'underline $danger-semantic',
  
  // 네스팅된 속성 테스트
  '&:before': {
    borderBottom: '1px solid $divider1-semantic',
    background: '$paperContents-semantic',
  },
  
  // 변형 테스트
  variants: {
    theme: {
      primary: {
        background: '$primary-semantic',
        color: '$onPrimary-semantic',
      },
      secondary: {
        background: '$secondaryLow-semantic',
        color: '$inkText-semantic',
      },
      danger: {
        background: '$danger-semantic',
        color: '$white-static',
      }
    }
  }
}); 