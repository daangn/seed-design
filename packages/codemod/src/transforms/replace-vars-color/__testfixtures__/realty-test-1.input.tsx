// @ts-nocheck
import { vars } from "@seed-design/design-token";

type Props = {
  articleRef: WatchButton_article$key;
  size?: number;
  color?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onWatchArticle?: () => void;
  enableClickAnimation?: boolean;
  position: string;
};

function WatchButton({
  articleRef,
  size = 24,
  color = vars.$scale.color.gray600,
  onClick,
  onWatchArticle,
  position,
  enableClickAnimation = true,
}: Props) {
  return (
    <button
      className="-m-1.5 inline-block p-1.5"
      disabled={isWatchArticleInFlight || isUnWatchArticleInFlight}
      onClick={handleClick}
    >
      {article.isViewerWatched ? (
        <IconHeartFill
          width={size}
          height={size}
          className={cn(enableClickAnimation && "animate-heartBounce")}
          color={vars.$scale.color.carrot500}
        />
      ) : (
        <IconHeartLine width={size} height={size} color={color} />
      )}
    </button>
  );
}

export default WatchButton;
