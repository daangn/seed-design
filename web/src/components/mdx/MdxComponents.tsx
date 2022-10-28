import * as card from "./Card";
import * as heading from "./Heading";
import Keyboard from "./Keyboard";
import * as List from "./List";
import * as table from "./Table";

export default {
  /* 커스텀 HTML Elements */
  h1: (props: Object) => heading.h1(props),
  h2: (props: Object) => heading.h2(props),
  h3: (props: Object) => heading.h3(props),
  h4: (props: Object) => heading.h4(props),

  ol: (props: Object) => List.ol(props),
  li: (props: Object) => List.oli(props),

  /* MDX 전용 컴포넌트 */
  Keyboard,

  Table: table.Table,
  TableHead: table.TableHead,
  TableBody: table.TableBody,
  TableRow: table.TableRow,
  TableData: table.TableData,

  CardCaption: card.CardCaption,

  FullCard: card.FullCard,
  FullCardImageCell: card.FullCardImageCell,
  FullCardDescription: card.FullCardDescription,

  HalfCard: card.HalfCard,
  HalfCardImageCell: card.HalfCardImageCell,
  HalfCardDescriptionCell: card.HalfCardDescriptionCell,
  HalfCardDescriptionTitle: card.HalfCardDescriptionTitle,
  HalfCardDescription: card.HalfCardDescription,
};
