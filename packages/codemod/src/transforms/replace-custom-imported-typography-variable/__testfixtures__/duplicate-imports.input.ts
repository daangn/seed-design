// @ts-nocheck
import { 
  subtitle1Regular, 
  subtitle2Regular,
  bodyM1Regular,
  bodyM2Regular 
} from '@src/constants/typography'
import { bodyM1Regular as customTypo } from '@karrot/typography'

// subtitle1Regular와 bodyM1Regular는 모두 t5Regular로 변환됨
const S_StoreRequestTitle = styled.h1`
  ${subtitle1Regular};
  margin: 0 0 0.25rem;
  color: ${vars.$scale.color.gray900};
  text-align: center;
`

// bodyM1Regular도 t5Regular로 변환됨
const S_Description = styled.p`
  ${bodyM1Regular};
  color: ${vars.$scale.color.gray700};
`

// subtitle2Regular와 bodyM2Regular는 모두 t4Regular로 변환됨
const S_StoreRequestText = styled.p`
  ${subtitle2Regular};
  margin: 0;
  color: ${vars.$scale.color.gray600};
  text-align: center;
`

const S_AdditionalInfo = styled.p`
  ${bodyM2Regular};
  margin-top: 0.5rem;
`

// 별칭으로 import된 변수는 유지되어야 함
const S_CustomContent = styled.div`
  ${customTypo};
  color: ${vars.$scale.color.gray700};
` 