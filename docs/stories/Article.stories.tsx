import preview from "../.storybook/preview";
import { Article, Text, VStack } from "@seed-design/react";
import type { ReactNode } from "react";

import { withVisualTestParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";

const LONG_URL =
  "https://www.example.com/this-is-a-very-long-url-that-might-cause-layout-issues-if-the-word-break-is-not-handled-properly?utm_source=newsletter&utm_medium=email";

const ArticlePreview = ({ lang, body }: { lang: string; body: ReactNode }) => (
  <VStack
    asChild
    gap="x1"
    width="320px"
    p="x4"
    borderColor="stroke.neutralMuted"
    borderWidth={1}
    borderRadius="r2"
    bg="bg.neutralWeak"
  >
    <Article lang={lang}>
      <Text as="p" textStyle="t5Bold">
        {lang}
      </Text>
      <Text as="p" textStyle="articleBody" lang={lang}>
        {body}
      </Text>
    </Article>
  </VStack>
);

const ArticleScene = () => (
  <VStack gap="x4" align="flex-start">
    <ArticlePreview
      lang="ko-KR"
      body={
        <>
          단어 내부 줄바꿈 처리를 적절하게 하여 가독성을 높입니다.
          이렇게매우긴단어를줄바꿈하지않는경우레이아웃문제를일으킬가능성이있습니다.{" "}
          <a href={LONG_URL}>{LONG_URL}</a>
        </>
      }
    />
    <ArticlePreview
      lang="en-US"
      body={
        <>
          There are some long words that need to be broken properly to improve readability.
          SupercalifragilisticexpialidociousEvenThoughTheSoundOfItIsSomethingQuiteAtrocious{" "}
          <a href={LONG_URL}>{LONG_URL}</a>
        </>
      }
    />
    <ArticlePreview
      lang="ja-JP"
      body={
        <>
          日本語の禁則処理では、特定の文字の前後で改行を制御します。例えば句読点。。。が続く場合や小さい文字ぁぁぁの改行位置を確認できます。{" "}
          <a href={LONG_URL}>{LONG_URL}</a>
        </>
      }
    />
  </VStack>
);

const meta = preview.meta({
  component: Article,
  decorators: [SeedThemeDecorator],
});
const CommonStoryTemplate = meta.story({
  render: () => <ArticleScene />,
});

export const LightTheme = CommonStoryTemplate.extend({});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Extra Extra Large" }),
});
