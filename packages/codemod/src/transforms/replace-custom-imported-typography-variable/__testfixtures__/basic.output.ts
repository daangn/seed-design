// @ts-nocheck
import {
  t5Regular,
  t4Regular,
  t10Bold,
  t9Bold,
  t7Bold,
  articleBody,
  t3Regular,
  t2Regular,
  t1Regular,
} from '@src/constants/typography';
import { t5Regular as customTypo } from '@karrot/typography'

const S_StoreRequestTitle = styled.h1`
  ${t5Regular};
  margin: 0 0 0.25rem;
  color: ${vars.$scale.color.gray900};
  text-align: center;
`
const S_StoreRequestText = styled.p`
  ${t4Regular};
  margin: 0;
  color: ${vars.$scale.color.gray600};
  text-align: center;
`

// 추가 테스트 케이스
// screenTitle 매핑 테스트
const S_ScreenHeader = styled.h1`
  ${t10Bold};
  margin-bottom: 1rem;
`

// 일반 매핑 테스트
const S_Title = styled.h2`
  ${t9Bold};
  color: ${vars.$scale.color.gray900};
`

// 여러 테스트 케이스를 담은 컴포넌트
const Card = styled.div`
  // title2Bold 매핑 테스트
  h3 {
    ${t7Bold};
    margin-bottom: 8px;
  }
  
  // bodyL1Regular 매핑 테스트
  p.description {
    ${articleBody};
    color: ${vars.$scale.color.gray800};
  }
  
  // 대체 토큰으로 매핑되는 케이스
  p.content {
    ${t4Regular};
    margin: 0;
  }
  
  // 캡션 스타일
  p.caption {
    ${t3Regular};
    color: ${vars.$scale.color.gray600};
  }
  
  // 작은 텍스트
  small {
    ${t2Regular};
    color: ${vars.$scale.color.gray500};
  }
  
  // 라벨 스타일
  label {
    ${t1Regular};
    margin-right: 4px;
  }
`

// 다른 모듈에서 가져온 타이포그래피 처리 (별칭 유지해야 함)
const S_CustomContent = styled.div`
  ${customTypo};
  color: ${vars.$scale.color.gray700};
`

// 변수로 사용하는 경우
const titleStyle = t9Bold;
const textStyle = t5Regular;
