import { Anatomy } from "./Anatomy";
import * as card from "./Card";
import * as DoDont from "./DoDont";
import * as heading from "./Heading";
import { Iframe } from "./Iframe";
import { Keyboard } from "./Keyboard";
import * as list from "./List";
import * as table from "./Table";
import * as text from "./Text";

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
  Anatomy,
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
