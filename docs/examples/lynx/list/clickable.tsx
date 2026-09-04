import "./styles";

import IconArrowUpRightLine from "@karrotmarket/lynx-monochrome-icon/IconArrowUpRightLine";
import IconCheckmarkFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFill";
import IconChevronRightLine from "@karrotmarket/lynx-monochrome-icon/IconChevronRightLine";
import IconPenHorizlineFill from "@karrotmarket/lynx-monochrome-icon/IconPenHorizlineFill";
import IconPlusFill from "@karrotmarket/lynx-monochrome-icon/IconPlusFill";
import IconSquare2StackedFill from "@karrotmarket/lynx-monochrome-icon/IconSquare2StackedFill";
import { root, useState } from "@lynx-js/react";
import { ActionButton, PrefixIcon, SuffixIcon, useSeedClassName } from "@seed-design/lynx-react";

import { List, ListButtonItem, ListDivider, ListItem } from "@/components/ui/list";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [status, setStatus] = useState("아직 탭하지 않았어요");
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <page className={seedClassName}>
      <List>
        <ListItem
          title="ListItem은 클릭할 수 없어요. 눌러보세요."
          detail="우측의 Action Button만 클릭할 수 있어요"
          suffix={
            <ActionButton
              variant="ghost"
              size="xsmall"
              bindtap={() => {
                "background only";
                setStatus("편집 클릭됨");
              }}
            >
              <PrefixIcon icon={<IconPenHorizlineFill />} />
              편집
            </ActionButton>
          }
        />
        <ListDivider />
        <ListButtonItem
          title="ListButtonItem은 클릭할 수 있어요. 눌러보세요."
          detail="리스트 항목 전체와 우측의 토글 액션을 각각 탭할 수 있어요"
          bindtap={() => {
            "background only";
            setStatus("리스트 아이템 클릭됨");
          }}
          suffix={
            <view className="list-preview__suffix">
              <view catchtap={() => {}}>
                <ActionButton
                  variant={subscribed ? "neutralSolid" : "neutralWeak"}
                  size="xsmall"
                  bindtap={() => {
                    "background only";
                    setSubscribed((value) => !value);
                    setStatus("모아보기 상태 변경됨");
                  }}
                >
                  <PrefixIcon icon={subscribed ? <IconCheckmarkFill /> : <IconPlusFill />} />
                  {subscribed ? "모아보는 중" : "모아보기"}
                </ActionButton>
              </view>
              <SuffixIcon icon={<IconChevronRightLine />} />
            </view>
          }
        />
        <ListDivider />
        <ListButtonItem
          title="ListButtonItem은 클릭할 수 있어요. 눌러보세요."
          detail="리스트 항목 전체와 우측의 커스텀 버튼을 각각 탭할 수 있어요"
          bindtap={() => {
            "background only";
            setStatus("리스트 아이템 클릭됨");
          }}
          suffix={
            <view className="list-preview__suffix">
              <view
                className="list-preview__custom-button"
                accessibility-element={true}
                accessibility-traits="button"
                catchtap={() => {
                  "background only";
                  setStatus("커스텀 버튼 클릭됨");
                }}
              >
                <text className="list-preview__custom-button-label">커스텀 버튼</text>
              </view>
              <SuffixIcon icon={<IconChevronRightLine />} />
            </view>
          }
        />
        <ListDivider />
        <ListButtonItem
          title="링크 이동도 ListButtonItem으로 처리해요."
          detail="탭 이벤트에서 앱 라우터를 호출합니다"
          bindtap={() => {
            "background only";
            setStatus("링크 이동 요청됨");
          }}
          suffix={
            <view className="list-preview__suffix">
              <view catchtap={() => {}}>
                <ActionButton
                  variant="neutralWeak"
                  size="xsmall"
                  bindtap={() => {
                    "background only";
                    setCopied(true);
                    setStatus("URL 복사됨");
                  }}
                >
                  <PrefixIcon icon={copied ? <IconCheckmarkFill /> : <IconSquare2StackedFill />} />
                  {copied ? "복사됨" : "URL 복사"}
                </ActionButton>
              </view>
              <SuffixIcon icon={<IconArrowUpRightLine />} />
            </view>
          }
        />
      </List>
      <text className="list-preview__status">{status}</text>
    </page>
  );
}

root.render(<Root />);
