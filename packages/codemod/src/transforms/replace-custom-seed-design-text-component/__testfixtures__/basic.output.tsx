// @ts-nocheck

import { Text } from "@seed-design/react";

const Component = () => {
  return (
    <div>
      {/* 기존 variant prop 케이스 */}
      <Text textStyle="t7Bold">광고 노출 기준</Text>
      <Text textStyle="t5Regular">
        앱 내 최근 활동 이력을 분석하여 이용자의 관심사와 관련성이 높은 게시글을 노출해요.
      </Text>
      {/* typography prop + color prop 케이스 */}
      <Text color="palette.gray800" textStyle="articleBody">
        앱 내 최근 활동 이력을 분석하여 이용자의 관심사와 관련성이 높은 게시글을 노출해요.
      </Text>
      <Text color="palette.gray700" className={marginLeft['4px']} textStyle="t4Bold">
        지역 선택하기
      </Text>
      <Text color="palette.gray1000" textStyle="t5Bold">
        지표별 성과
      </Text>
      {/* 다양한 typography prop 형태 */}
      <Text textStyle="articleBody">접두사 없는 토큰</Text>
      <Text textStyle="t5Bold">또 다른 토큰</Text>
      {/* 다양한 color prop 형태 */}
      <Text color="fg.brand" textStyle="t9Bold">시맨틱 컬러</Text>
      <Text variant="body1Regular" color="$static.white">스태틱 컬러</Text>
      <Text textColor="palette.carrot600" textStyle="t3Regular">textColor prop</Text>
      {/* 조건부 표현식 케이스 */}
      <Text textStyle={isActive ? "t9Bold" : "body1Regular"}>조건부 variant</Text>
      <Text color={isError ? "fg.critical" : "palette.gray800"}>조건부 color</Text>
      {/* JSX 표현식 컨테이너 케이스 */}
      <Text color={"palette.gray600"} textStyle="articleBody">
        표현식 컨테이너
      </Text>
    </div>
  );
};
