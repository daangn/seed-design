import { IconFaceSmileCircleFill } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { useState } from "react";
import { ReactionButton } from "seed-design/ui/reaction-button";

export default function ReactionButtonLoading() {
  const [pressed, setPressed] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleToggle() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPressed((prev) => !prev);
    }, 2000);
  }

  // 이벤트 핸들링이 필요할 수 있으므로 loading은 disabled를 포함하지 않습니다. 이벤트 발생을 원하지 않는 경우, disabled 속성을 추가해주세요.
  return (
    <ReactionButton loading={loading} pressed={pressed} onPressedChange={handleToggle}>
      <PrefixIcon svg={<IconFaceSmileCircleFill />} />
      시간이 걸리는 토글
    </ReactionButton>
  );
}
