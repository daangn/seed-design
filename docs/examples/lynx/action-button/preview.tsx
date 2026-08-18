import { root, useState } from "@lynx-js/react";
import { ActionButton, useSeedClassName, VStack } from "@seed-design/lynx-react";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [count, setCount] = useState(0);

  function handleTap() {
    "background only";
    setCount((value) => value + 1);
  }

  return (
    <page className={seedClassName}>
      <VStack className="action-button-preview" gap="x3">
        <text className="action-button-preview__description">버튼을 탭하면 상태가 바뀝니다.</text>
        <ActionButton variant="brandSolid" size="medium" bindtap={handleTap}>
          {count === 0 ? "탭해 보세요" : `${count}번 탭했어요`}
        </ActionButton>
        <ActionButton variant="neutralOutline" disabled={count === 0}>
          {count === 0 ? "먼저 위 버튼을 탭하세요" : "활성화됨"}
        </ActionButton>
      </VStack>
    </page>
  );
}

root.render(<Root />);
