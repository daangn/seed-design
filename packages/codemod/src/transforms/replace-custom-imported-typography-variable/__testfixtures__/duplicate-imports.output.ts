// @ts-nocheck
import { t5Regular, t4Regular } from '@src/constants/typography';
import { t5Regular as customTypo } from '@karrot/typography'

// subtitle1Regular와 bodyM1Regular는 모두 t5Regular로 변환됨
const S_StoreRequestTitle = styled.h1`
  ${t5Regular};
  margin: 0 0 0.25rem;
  color: ${vars.$scale.color.gray900};
  text-align: center;
`

// bodyM1Regular도 t5Regular로 변환됨
const S_Description = styled.p`
  ${t5Regular};
  color: ${vars.$scale.color.gray700};
`

// subtitle2Regular와 bodyM2Regular는 모두 t4Regular로 변환됨
const S_StoreRequestText = styled.p`
  ${t4Regular};
  margin: 0;
  color: ${vars.$scale.color.gray600};
  text-align: center;
`

const S_AdditionalInfo = styled.p`
  ${t4Regular};
  margin-top: 0.5rem;
`

// 별칭으로 import된 변수는 유지되어야 함
const S_CustomContent = styled.div`
  ${customTypo};
  color: ${vars.$scale.color.gray700};
` 