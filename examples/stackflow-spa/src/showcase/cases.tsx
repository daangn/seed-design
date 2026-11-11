import {
  IconBellLine,
  IconDot3VerticalLine,
  IconHeartLine,
  IconHouseLine,
  IconMagnifyingglassLine,
} from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarCloseButton,
  NextAppBarIconButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";
import { Filler, Hero, Pale } from "./fixtures";

export function CaseBehind() {
  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarMain title="홈" />
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="검색">
            <Icon svg={<IconMagnifyingglassLine />} />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <Filler />
      </NextAppScreenContent>
    </NextAppScreen>
  );
}

export function CaseBasic() {
  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="중고거래" />
      </NextAppBar>
      <NextAppScreenContent>
        <Filler />
      </NextAppScreenContent>
    </NextAppScreen>
  );
}

export function CaseSubtitle() {
  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="당근마켓 동네모임" subtitle="멤버 128명" />
      </NextAppBar>
      <NextAppScreenContent>
        <Filler />
      </NextAppScreenContent>
    </NextAppScreen>
  );
}

export function CaseActions() {
  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="중고거래" />
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="검색">
            <Icon svg={<IconMagnifyingglassLine />} />
          </NextAppBarIconButton>
          <NextAppBarIconButton aria-label="알림">
            <Icon svg={<IconBellLine />} />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <Filler />
      </NextAppScreenContent>
    </NextAppScreen>
  );
}

export function CaseLongTitle() {
  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="역삼동 원목 식탁 4인용 무료나눔합니다" />
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="검색">
            <Icon svg={<IconMagnifyingglassLine />} />
          </NextAppBarIconButton>
          <NextAppBarIconButton aria-label="알림">
            <Icon svg={<IconBellLine />} />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <Filler />
      </NextAppScreenContent>
    </NextAppScreen>
  );
}

export function CaseRootClose() {
  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarCloseButton />
        </NextAppBarLeft>
        <NextAppBarMain title="글쓰기" />
      </NextAppBar>
      <NextAppScreenContent>
        <Filler />
      </NextAppScreenContent>
    </NextAppScreen>
  );
}

export function CaseTransparentGradient() {
  return (
    <NextAppScreen contentOffsetTop="none">
      <NextAppBar tone="gradient">
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="관심">
            <Icon svg={<IconHeartLine />} />
          </NextAppBarIconButton>
          <NextAppBarIconButton aria-label="더보기">
            <Icon svg={<IconDot3VerticalLine />} />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <Hero />
      </NextAppScreenContent>
    </NextAppScreen>
  );
}

export function CaseTransparentPale() {
  return (
    <NextAppScreen contentOffsetTop="none">
      <NextAppBar tone="gradient">
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="더보기">
            <Icon svg={<IconDot3VerticalLine />} />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <Pale />
      </NextAppScreenContent>
    </NextAppScreen>
  );
}

export function CaseCustomBg() {
  return (
    <NextAppScreen>
      <NextAppBar bg="bg.neutralWeak">
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="설정" />
      </NextAppBar>
      <NextAppScreenContent>
        <Filler />
      </NextAppScreenContent>
    </NextAppScreen>
  );
}

export function CaseLongTitleSubtitle() {
  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain
          title="강남구 역삼동 주민들의 주말 러닝 크루 모임방"
          subtitle="멤버 1,284명 · 최근 활동 3분 전 · 공개 모임 · 누구나 참여 가능"
        />
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="더보기">
            <Icon svg={<IconDot3VerticalLine />} />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <Filler />
      </NextAppScreenContent>
    </NextAppScreen>
  );
}

export function CaseManyIcons() {
  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
          <NextAppBarIconButton aria-label="홈">
            <Icon svg={<IconHouseLine />} />
          </NextAppBarIconButton>
        </NextAppBarLeft>
        <NextAppBarMain title="역삼동 원목 식탁 4인용 무료나눔합니다" />
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="검색">
            <Icon svg={<IconMagnifyingglassLine />} />
          </NextAppBarIconButton>
          <NextAppBarIconButton aria-label="관심">
            <Icon svg={<IconHeartLine />} />
          </NextAppBarIconButton>
          <NextAppBarIconButton aria-label="더보기">
            <Icon svg={<IconDot3VerticalLine />} />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <Filler />
      </NextAppScreenContent>
    </NextAppScreen>
  );
}

export function CaseAsymmetric() {
  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="동네생활 인기글 모아보기" />
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="검색">
            <Icon svg={<IconMagnifyingglassLine />} />
          </NextAppBarIconButton>
          <NextAppBarIconButton aria-label="알림">
            <Icon svg={<IconBellLine />} />
          </NextAppBarIconButton>
          <NextAppBarIconButton aria-label="더보기">
            <Icon svg={<IconDot3VerticalLine />} />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <Filler />
      </NextAppScreenContent>
    </NextAppScreen>
  );
}

export function CaseIconsOnly() {
  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="검색">
            <Icon svg={<IconMagnifyingglassLine />} />
          </NextAppBarIconButton>
          <NextAppBarIconButton aria-label="더보기">
            <Icon svg={<IconDot3VerticalLine />} />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <Filler />
      </NextAppScreenContent>
    </NextAppScreen>
  );
}

export function CaseOffsetNone() {
  return (
    <NextAppScreen contentOffsetTop="none">
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="contentOffsetTop none" />
      </NextAppBar>
      <NextAppScreenContent>
        <Filler />
      </NextAppScreenContent>
    </NextAppScreen>
  );
}

export function CasePtr() {
  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="당겨서 새로고침" />
      </NextAppBar>
      <NextAppScreenContent
        ptr
        onPtrRefresh={() => new Promise((resolve) => setTimeout(resolve, 60_000))}
      >
        <Filler />
      </NextAppScreenContent>
    </NextAppScreen>
  );
}

export function CaseSwipeHorizontal() {
  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="horizontalSlide" />
      </NextAppBar>
      <NextAppScreenContent>
        <Filler />
      </NextAppScreenContent>
    </NextAppScreen>
  );
}

export function CaseSwipeVertical() {
  return (
    <NextAppScreen transitionStyle="verticalSlide">
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="verticalSlide" />
      </NextAppBar>
      <NextAppScreenContent>
        <Filler />
      </NextAppScreenContent>
    </NextAppScreen>
  );
}

export function CaseSwipeCrossfade() {
  return (
    <NextAppScreen transitionStyle="crossfade">
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="crossfade" />
      </NextAppBar>
      <NextAppScreenContent>
        <Filler />
      </NextAppScreenContent>
    </NextAppScreen>
  );
}

export function CaseSwipeClip() {
  return (
    <NextAppScreen clipRadius={40}>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="clipRadius 40" />
      </NextAppBar>
      <NextAppScreenContent>
        <Filler />
      </NextAppScreenContent>
    </NextAppScreen>
  );
}

export function CaseSwipeTransparent() {
  return (
    <NextAppScreen contentOffsetTop="none">
      <NextAppBar tone="gradient">
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="관심">
            <Icon svg={<IconHeartLine />} />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <Hero />
      </NextAppScreenContent>
    </NextAppScreen>
  );
}
