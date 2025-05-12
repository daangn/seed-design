// @ts-nocheck
import {
  subtitle1Regular,
  subtitle2Regular,
  h4,
  title1Bold,
  title2Bold,
  bodyL1Regular,
  bodyL2Regular,
  caption1Regular,
  caption2Regular,
  label5Regular,
} from '@src/constants/typography'
import { bodyM1Regular as customTypo } from '@karrot/typography'

const S_StoreRequestTitle = styled.h1`
  ${subtitle1Regular};
  margin: 0 0 0.25rem;
  color: ${vars.$scale.color.gray900};
  text-align: center;
`
const S_StoreRequestText = styled.p`
  ${subtitle2Regular};
  margin: 0;
  color: ${vars.$scale.color.gray600};
  text-align: center;
`

// 추가 테스트 케이스
// screenTitle 매핑 테스트
const S_ScreenHeader = styled.h1`
  ${h4};
  margin-bottom: 1rem;
`

// 일반 매핑 테스트
const S_Title = styled.h2`
  ${title1Bold};
  color: ${vars.$scale.color.gray900};
`

// 여러 테스트 케이스를 담은 컴포넌트
const Card = styled.div`
  // title2Bold 매핑 테스트
  h3 {
    ${title2Bold};
    margin-bottom: 8px;
  }
  
  // bodyL1Regular 매핑 테스트
  p.description {
    ${bodyL1Regular};
    color: ${vars.$scale.color.gray800};
  }
  
  // 대체 토큰으로 매핑되는 케이스
  p.content {
    ${bodyL2Regular};
    margin: 0;
  }
  
  // 캡션 스타일
  p.caption {
    ${caption1Regular};
    color: ${vars.$scale.color.gray600};
  }
  
  // 작은 텍스트
  small {
    ${caption2Regular};
    color: ${vars.$scale.color.gray500};
  }
  
  // 라벨 스타일
  label {
    ${label5Regular};
    margin-right: 4px;
  }
`

// 다른 모듈에서 가져온 타이포그래피 처리 (별칭 유지해야 함)
const S_CustomContent = styled.div`
  ${customTypo};
  color: ${vars.$scale.color.gray700};
`

// 변수로 사용하는 경우
const titleStyle = title1Bold;
const textStyle = subtitle1Regular;
