import { ActionButton } from "@/registry/ui/action-button";
import { List, ListButtonItem } from "@/registry/ui/list";
import { ListHeader } from "@/registry/ui/list-header";
import {
  IconChevronRightLine,
  IconLockLine,
  IconPersonCircleLine,
  IconQuestionmarkCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Divider, Icon, PrefixIcon, VStack } from "@seed-design/react";

export default function () {
  return (
    <VStack gap="x6" py="x6" width="360px">
      <VStack>
        <ListHeader as="h2" variant="mediumWeak">
          variant="mediumWeak"
          <ActionButton
            variant="ghost"
            size="xsmall"
            bleedX="asPadding"
            bleedY="asPadding"
            color="fg.neutralSubtle"
          >
            <PrefixIcon svg={<IconQuestionmarkCircleLine />} />
            도움말
          </ActionButton>
        </ListHeader>
        <List>
          <ListButtonItem
            title="내 계정"
            detail="이메일과 연락처, 본인 인증 관리"
            prefix={<Icon svg={<IconPersonCircleLine />} />}
            suffix={<Icon svg={<IconChevronRightLine />} size="18px" />}
          />
          <ListButtonItem
            title="보안 · 인증 관리"
            detail="비밀번호, 생체 인증 사용을 관리해요"
            prefix={<Icon svg={<IconLockLine />} />}
            suffix={<Icon svg={<IconChevronRightLine />} size="x4_5" />}
          />
        </List>
      </VStack>
      <Divider />
      <VStack>
        <ListHeader as="h2" variant="boldSolid">
          variant="boldSolid"
          <ActionButton
            variant="ghost"
            size="xsmall"
            bleedX="asPadding"
            bleedY="asPadding"
            color="fg.neutralSubtle"
          >
            <PrefixIcon svg={<IconQuestionmarkCircleLine />} />
            도움말
          </ActionButton>
        </ListHeader>
        <List>
          <ListButtonItem
            title="내 계정"
            detail="이메일과 연락처, 본인 인증 관리"
            prefix={<Icon svg={<IconPersonCircleLine />} />}
            suffix={<Icon svg={<IconChevronRightLine />} size="18px" />}
          />
          <ListButtonItem
            title="보안 · 인증 관리"
            detail="비밀번호, 생체 인증 사용을 관리해요"
            prefix={<Icon svg={<IconLockLine />} />}
            suffix={<Icon svg={<IconChevronRightLine />} size="x4_5" />}
          />
        </List>
      </VStack>
    </VStack>
  );
}
