import { Accordion, useAccordionItemContext } from "@seed-design/lynx-react-accordion";

function OpenIndicator() {
  const { open } = useAccordionItemContext("OpenIndicator");
  return <text style={{ color: "#555555" }}>{open ? "접기" : "펼치기"}</text>;
}

export default function Example() {
  return (
    <view style={{ padding: "16px" }}>
      <Accordion.Root multiple defaultValues={["delivery", "returns"]}>
        <Accordion.Item value="delivery">
          <Accordion.Header>
            <Accordion.Trigger>
              <view
                style={{ padding: "16px", flexDirection: "row", justifyContent: "space-between" }}
              >
                <text>배송은 언제 시작되나요?</text>
                <OpenIndicator />
              </view>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <view style={{ padding: "0px 16px 16px" }}>
              <text>결제 완료 후 상품 준비가 끝나면 배송을 시작합니다.</text>
            </view>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="returns">
          <Accordion.Header>
            <Accordion.Trigger>
              <view
                style={{ padding: "16px", flexDirection: "row", justifyContent: "space-between" }}
              >
                <text>반품은 어떻게 신청하나요?</text>
                <OpenIndicator />
              </view>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <view style={{ padding: "0px 16px 16px" }}>
              <text>주문 내역에서 반품을 신청할 수 있습니다.</text>
            </view>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="unavailable" disabled>
          <Accordion.Header>
            <Accordion.Trigger>
              <view
                style={{ padding: "16px", flexDirection: "row", justifyContent: "space-between" }}
              >
                <text style={{ color: "#777777" }}>준비 중인 안내</text>
                <OpenIndicator />
              </view>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <view style={{ padding: "0px 16px 16px" }}>
              <text>이 항목은 선택할 수 없습니다.</text>
            </view>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </view>
  );
}
