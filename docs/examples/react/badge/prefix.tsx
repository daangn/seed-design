"use client";

import { IconHeartFill } from "@karrotmarket/react-monochrome-icon";
import { Badge } from "seed-design/ui/badge";

export default function BadgePrefix() {
  return <Badge prefix={<IconHeartFill />}>관심 등록</Badge>;
}
