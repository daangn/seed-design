// @ts-nocheck
import { vars } from "@seed-design/design-token";
import { EntryReview } from "components/Base/ArticleWriteBanner";
import Avatar from "components/Base/Avatar";
import DoubleQuotes from "components/icons/DoubleQuotes";
import useDarkMode from "hooks/useDarkmode";
import { HStack } from "./Stack/HStack";
import { Stack } from "./Stack/Stack";
import { tv } from "tailwind-variants";

const ReviewItem = ({ text, region, isMain, profileImg }: EntryReview) => {
  const style = isMain ? mainReview : review;
  const isDarkMode = useDarkMode();

  return (
    <HStack spacing={8} className={style({ mode: isDarkMode ? "dark" : "light" })}>
      <div>
        <Avatar
          src={profileImg}
          size="medium"
          UNSAFE_style={{ background: vars.$semantic.color.paperDefault }}
        />
      </div>
      <div>
        <DoubleQuotes />
      </div>
      <Stack spacing={2}>
        <h3 className="word-break-text">{text}</h3>
        <p>{region} 이웃</p>
      </Stack>
    </HStack>
  );
};

export default ReviewItem;

const review = tv({
  base: `text-gray400 rounded-5 [&_h3]:title3Bold [&_p]:bodyL2Regular w-[85vw] max-w-[300px] items-start px-4 py-6`,
  variants: {
    mode: {
      dark: "bg-gray100",
      light: "bg-gray50",
    },
  },
});

const mainReview = tv({
  base: [
    review(),
    "bg-gray00 text-gray900 [&_h3]:text-gray900 [&_p]:text-gray600 shadow-[0px_0px_4px_rgba(0,0,0,0.04),0px_0px_20px_rgba(0,0,0,0.1)]",
  ],
});
