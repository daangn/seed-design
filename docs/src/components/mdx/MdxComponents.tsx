import * as card from "./card";
import * as DoDont from "./do-dont";
import * as heading from "./heading";
import { Iframe } from "./iframe";
import { Keyboard } from "./keyboard";
import * as list from "./list";
import * as table from "./table";
import * as text from "./text";

export default {
  /* 커스텀 HTML Elements */
  h1: (props: Object) => heading.h1(props),
  h2: (props: Object) => heading.h2(props),
  h3: (props: Object) => heading.h3(props),
  h4: (props: Object) => heading.h4(props),

  p: (props: Object) => text.p(props),

  ol: (props: Object) => list.ol(props),
  li: (props: Object) => list.oli(props),

  table: (props: Object) => table.Table(props),
  thead: (props: Object) => table.TableHead(props),
  tbody: (props: Object) => table.TableBody(props),
  tr: (props: Object) => table.TableRow(props),
  td: (props: Object) => table.TableData(props),
  th: (props: Object) => table.TableData(props),

  /* MDX 전용 컴포넌트 */
  Keyboard,
  Iframe,

  FullCard: card.FullCard,
  FullCardImageCell: card.FullCardImageCell,
  FullCardDescription: card.FullCardDescription,

  HalfCard: card.HalfCard,
  HalfCardImageCell: card.HalfCardImageCell,
  HalfCardDescriptionCell: card.HalfCardDescriptionCell,
  HalfCardDescriptionTitle: card.HalfCardDescriptionTitle,
  HalfCardDescription: card.HalfCardDescription,

  DoBox: DoDont.DoBox,
  DoImage: DoDont.DoImage,
  DoText: DoDont.DoText,

  DontBox: DoDont.DontBox,
  DontImage: DoDont.DontImage,
  DontText: DoDont.DontText,

  DoDontLayout: DoDont.DoDontLayout,
};
