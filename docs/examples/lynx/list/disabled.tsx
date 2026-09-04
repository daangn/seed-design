import "./styles";

import IconChevronRightLine from "@karrotmarket/lynx-monochrome-icon/IconChevronRightLine";
import IconPersonCircleLine from "@karrotmarket/lynx-monochrome-icon/IconPersonCircleLine";
import IconSlashCircleLine from "@karrotmarket/lynx-monochrome-icon/IconSlashCircleLine";
import { root } from "@lynx-js/react";
import { PrefixIcon, SuffixIcon, useSeedClassName } from "@seed-design/lynx-react";

import { List, ListButtonItem, ListCheckItem, ListRadioItem } from "@/components/ui/list";
import { RadioGroup } from "@/components/ui/radio-group";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="list-preview__sections">
        <List>
          <ListButtonItem
            prefix={<PrefixIcon icon={<IconPersonCircleLine />} />}
            title="활성화된 ListButtonItem"
            detail="Cupidatat et pariatur amet."
            suffix={<SuffixIcon icon={<IconChevronRightLine />} />}
          />
          <ListCheckItem
            prefix={<PrefixIcon icon={<IconPersonCircleLine />} />}
            title="활성화된 ListCheckItem"
          />
        </List>
        <RadioGroup defaultValue="enabled" accessibility-label="활성화 옵션">
          <List>
            <ListRadioItem
              prefix={<PrefixIcon icon={<IconPersonCircleLine />} />}
              title="활성화된 ListRadioItem"
              value="enabled"
            />
          </List>
        </RadioGroup>
        <List>
          <ListButtonItem
            disabled
            prefix={<PrefixIcon icon={<IconSlashCircleLine />} />}
            title="비활성화된 ListButtonItem"
            detail="Cupidatat et pariatur amet."
            suffix={<SuffixIcon icon={<IconChevronRightLine />} />}
          />
          <ListCheckItem
            disabled
            prefix={<PrefixIcon icon={<IconSlashCircleLine />} />}
            title="비활성화된 ListCheckItem"
          />
        </List>
        <RadioGroup defaultValue="disabled" accessibility-label="비활성화 옵션">
          <List>
            <ListRadioItem
              disabled
              prefix={<PrefixIcon icon={<IconSlashCircleLine />} />}
              title="비활성화된 ListRadioItem"
              value="disabled"
            />
          </List>
        </RadioGroup>
      </view>
    </page>
  );
}

root.render(<Root />);
