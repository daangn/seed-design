import { NextList, NextListButtonItem } from "seed-design/ui/next-list";
import { NextListHeader } from "seed-design/ui/next-list-header";
import { ActionButton } from "seed-design/ui/action-button";
import {
  IconChevronRightLine,
  IconLockLine,
  IconPersonCircleLine,
  IconQuestionmarkCircleFill,
} from "@karrotmarket/react-monochrome-icon";
import { Divider, Icon, PrefixIcon, VStack } from "@seed-design/react";

export default function () {
  return (
    <VStack gap="x6" py="x6" width="360px">
      <VStack>
        <NextListHeader as="h2" variant="mediumWeak">
          variant="mediumWeak"
        </NextListHeader>
        <NextList>
          <NextListButtonItem
            title="내 계정"
            detail="이메일과 연락처, 본인 인증 관리"
            prefix={<Icon svg={<IconPersonCircleLine />} />}
            suffix={<Icon svg={<IconChevronRightLine />} size="18px" />}
          />
          <NextListButtonItem
            title="보안 · 인증 관리"
            detail="비밀번호, 생체 인증 사용을 관리해요"
            prefix={<Icon svg={<IconLockLine />} />}
            suffix={<Icon svg={<IconChevronRightLine />} size="x4_5" />}
          />
        </NextList>
      </VStack>
      <Divider />
      <VStack>
        <NextListHeader as="h2" variant="boldSolid">
          variant="boldSolid"
        </NextListHeader>
        <NextList>
          <NextListButtonItem
            title="내 계정"
            detail="이메일과 연락처, 본인 인증 관리"
            prefix={<Icon svg={<IconPersonCircleLine />} />}
            suffix={<Icon svg={<IconChevronRightLine />} size="18px" />}
          />
          <NextListButtonItem
            title="보안 · 인증 관리"
            detail="비밀번호, 생체 인증 사용을 관리해요"
            prefix={<Icon svg={<IconLockLine />} />}
            suffix={<Icon svg={<IconChevronRightLine />} size="x4_5" />}
          />
        </NextList>
      </VStack>
      <Divider />
      <VStack>
        <NextListHeader>
          <h2>NextList Header with Action Button</h2>
          <ActionButton
            variant="ghost"
            size="small"
            color="fg.neutralSubtle"
            fontWeight="medium"
            bleed="asPadding"
          >
            <PrefixIcon svg={<IconQuestionmarkCircleFill />} />
            도움말
          </ActionButton>
        </NextListHeader>
        <NextList>
          <NextListButtonItem
            title="내 계정"
            detail="이메일과 연락처, 본인 인증 관리"
            prefix={<Icon svg={<IconPersonCircleLine />} />}
            suffix={<Icon svg={<IconChevronRightLine />} size="18px" />}
          />
          <NextListButtonItem
            title="보안 · 인증 관리"
            detail="비밀번호, 생체 인증 사용을 관리해요"
            prefix={<Icon svg={<IconLockLine />} />}
            suffix={<Icon svg={<IconChevronRightLine />} size="x4_5" />}
          />
        </NextList>
      </VStack>
    </VStack>
  );
}
