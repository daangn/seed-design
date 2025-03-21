// @ts-nocheck

import Text from 'components/Base/Text';

const Component = () => {
  return (
    <div>
      <Text variant={isPrimary ? 'subtitle1Bold' : 'title3Bold'} color="palette.gray700">광고 노출 기준</Text>
      <Text variant={isDetail ? 'subtitle1Bold' : 'title3Bold'} color="palette.gray700">
        앱 내 최근 활동 이력을 분석하여 이용자의 관심사와 관련성이 높은 게시글을 노출해요.
      </Text>
    </div>
  );
};
