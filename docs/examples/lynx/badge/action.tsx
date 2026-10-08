import { Badge } from "@/components/ui/badge";

export default function Example() {
  return (
    <Badge
      actionProps={{
        "accessibility-label": "도움말",
        bindtap: () => console.log("도움말 열기"),
      }}
    >
      판매 완료
    </Badge>
  );
}
