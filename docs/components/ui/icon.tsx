import { IconArrowRightFill } from "@daangn/react-icon";

type SeedIconType = React.ForwardRefExoticComponent<
  Omit<
    React.SVGProps<SVGSVGElement> & {
      size?: number | string;
    },
    "ref"
  > &
    React.RefAttributes<SVGSVGElement>
>;

export function create({
  icon: Icon,
}: {
  icon?: SeedIconType;
}): React.ReactElement {
  return (
    <div className="rounded-md border bg-gradient-to-b from-fd-secondary p-1 shadow-sm">
      {Icon ? <Icon /> : <IconArrowRightFill />}
    </div>
  );
}
