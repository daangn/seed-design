import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";

export default function ActionButtonLoading() {
  const [loading, setLoading] = useState(false);

  function handleClick() {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  // 이벤트 핸들링이 필요할 수 있으므로 loading은 disabled를 포함하지 않습니다. 이벤트 발생을 원하지 않는 경우, disabled 속성을 추가해주세요.
  return (
    <ActionButton loading={loading} onClick={handleClick}>
      시간이 걸리는 액션
    </ActionButton>
  );
}
