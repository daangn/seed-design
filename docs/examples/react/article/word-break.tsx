import { Article, Text, VStack } from "@seed-design/react";

export default function ArticleWordBreak() {
  return (
    <VStack gap="spacingY.componentDefault" align="center" width="full">
      <VStack
        gap="x3"
        width="600px"
        style={{ resize: "horizontal", overflow: "auto", maxWidth: "100%" }}
      >
        <VStack
          asChild
          borderColor="stroke.neutralMuted"
          borderWidth={1}
          borderRadius="r2"
          p="x4"
          gap="x1"
          bg="bg.neutralWeak"
        >
          <Article lang="ko-KR">
            <Text as="p" textStyle="t5Bold">
              ko-KR
            </Text>
            <Text as="p" textStyle="articleBody" lang="ko-KR">
              <span>
                단어 내부 줄바꿈 처리를 적절하게 하여 가독성을 높입니다.
                이렇게매우긴단어를줄바꿈하지않는경우레이아웃문제를일으킬가능성이있습니다.{" "}
              </span>
              <a
                href="https://www.example.com/this-is-a-very-long-url-that-might-cause-layout-issues-if-the-word-break-is-not-handled-properly?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.example.com/this-is-a-very-long-url-that-might-cause-layout-issues-if-the-word-break-is-not-handled-properly?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale
              </a>
            </Text>
          </Article>
        </VStack>
        <VStack
          asChild
          borderColor="stroke.neutralMuted"
          borderWidth={1}
          borderRadius="r2"
          p="x4"
          gap="x1"
          bg="bg.neutralWeak"
        >
          <Article lang="en-US">
            <Text as="p" textStyle="t5Bold">
              en-US
            </Text>
            <Text as="p" textStyle="articleBody">
              <span>
                There are some long words that need to be broken properly to improve readability.
                SupercalifragilisticexpialidociousEvenThoughTheSoundOfItIsSomethingQuiteAtrocious{" "}
              </span>
              <a
                href="https://www.example.com/this-is-a-very-long-url-that-might-cause-layout-issues-if-the-word-break-is-not-handled-properly?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.example.com/this-is-a-very-long-url-that-might-cause-layout-issues-if-the-word-break-is-not-handled-properly?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale
              </a>
            </Text>
          </Article>
        </VStack>
        <VStack
          asChild
          borderColor="stroke.neutralMuted"
          borderWidth={1}
          borderRadius="r2"
          p="x4"
          gap="x1"
          bg="bg.neutralWeak"
        >
          <Article lang="ja-JP">
            <Text as="p" textStyle="t5Bold">
              ja-JP
            </Text>
            <Text as="p" textStyle="articleBody" lang="ja-JP">
              <span>
                日本語の禁則処理では、特定の文字の前後で改行を制御します。例えば人々々々と続く場合や、小さい文字ぁぁぁが連続する場合、そして句読点。。。が続く場合の改行位置を確認できます。
                また長い文章では自動的に適切な位置で改行されますが々ぁ。などの文字の前では改行されないことを確認してください。{" "}
              </span>
              <a
                href="https://www.example.com/this-is-a-very-long-url-that-might-cause-layout-issues-if-the-word-break-is-not-handled-properly?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.example.com/this-is-a-very-long-url-that-might-cause-layout-issues-if-the-word-break-is-not-handled-properly?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale
              </a>
            </Text>
          </Article>
        </VStack>
      </VStack>
      <Text textStyle="t3Medium">핸들을 잡고 너비를 조정해보세요.</Text>
    </VStack>
  );
}
