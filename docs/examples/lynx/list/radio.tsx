import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";

import { List, ListDivider, ListRadioItem } from "@/components/ui/list";
import { RadioGroup, Radiomark } from "@/components/ui/radio-group";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="list-preview list-preview--centered">
        <RadioGroup
          defaultValue="option1"
          accessibility-label="옵션 선택"
          tone="neutral"
          size="large"
        >
          <List>
            <ListRadioItem
              value="option1"
              title="옵션 1"
              detail="첫 번째 선택지"
              suffix={<Radiomark />}
            />
            <ListDivider />
            <ListRadioItem
              value="option2"
              title="옵션 2"
              detail="두 번째 선택지"
              prefix={<Radiomark />}
              suffix={null}
            />
            <ListDivider />
            <ListRadioItem
              value="option3"
              title="옵션 3"
              detail="세 번째 선택지"
              prefix={<Radiomark />}
              suffix={null}
            />
          </List>
        </RadioGroup>
      </view>
    </page>
  );
}

root.render(<Root />);
