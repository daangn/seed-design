// @ts-nocheck

import Text from 'components/Base/Text';

const Component = () => {
  return (
    <div>
      {/* 기존 variant prop 케이스 */}
      <Text variant="title2Bold">광고 노출 기준</Text>
      <Text variant="subtitle1Regular">
        앱 내 최근 활동 이력을 분석하여 이용자의 관심사와 관련성이 높은 게시글을 노출해요.
      </Text>
      
      {/* typography prop + color prop 케이스 */}
      <Text typography="$semantic.bodyL1Regular" color="$scale.gray700">
        앱 내 최근 활동 이력을 분석하여 이용자의 관심사와 관련성이 높은 게시글을 노출해요.
      </Text>
      <Text typography="$semantic.label3Bold" color="$scale.gray600" className={marginLeft['4px']}>
        지역 선택하기
      </Text>
      <Text typography="$semantic.label2Bold" color="$scale.gray900">
        지표별 성과
      </Text>
      
      {/* 다양한 typography prop 형태 */}
      <Text typography="bodyL1Regular">접두사 없는 토큰</Text>
      <Text typography="label2Bold">또 다른 토큰</Text>
      
      {/* 다양한 color prop 형태 */}
      <Text variant="title1Bold" color="$semantic.primary">시맨틱 컬러</Text>
      <Text variant="body1Regular" color="$static.white">스태틱 컬러</Text>
      <Text variant="caption1Regular" textColor="$scale.carrot500">textColor prop</Text>
      
      {/* 조건부 표현식 케이스 */}
      <Text variant={isActive ? "title1Bold" : "body1Regular"}>조건부 variant</Text>
      <Text color={isError ? "$semantic.danger" : "$scale.gray700"}>조건부 color</Text>
      
      {/* JSX 표현식 컨테이너 케이스 */}
      <Text typography={"$semantic.bodyL1Regular"} color={"$scale.gray500"}>
        표현식 컨테이너
      </Text>
    </div>
  );
};
