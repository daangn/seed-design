import React from "react";

import * as style from "./CustomComponents.css";
import * as card from "./DocumentCard";
import Keyboard from "./Keyboard";
import * as table from "./Table";

export const customComponents = {
  /* 커스텀 HTML Elements */
  h1: (props: Object) => <h1 className={style.h1} {...props} />,

  h2: (props: Object) => <h2 className={style.h2} {...props} />,

  h3: (props: Object) => <h3 className={style.h3} {...props} />,

  h4: (props: Object) => <h4 className={style.h4} {...props} />,

  ol: (props: Object) => <ol className={style.ol} {...props} />,

  li: (props: Object) => <li className={style.oli} {...props} />,

  /* MDX 전용 컴포넌트s */
  Keyboard,

  Table: table.Table,
  TableHead: table.TableHead,
  TableBody: table.TableBody,
  TableRow: table.TableRow,
  TableData: table.TableData,

  CardCaption: card.DocumentCardCaption,

  FullCard: card.DocumentFullCard,
  FullCardImageCell: card.DocumentFullCardImageCell,
  FullCardDescription: card.DocumentFullCardDescription,

  HalfCard: card.DocumentHalfCard,
  HalfCardImageCell: card.DocumentHalfCardImageCell,
  HalfCardDescriptionCell: card.DocumentHalfCardDescriptionCell,
  HalfCardDescriptionTitle: card.DocumentHalfCardDescriptionTitle,
  HalfCardDescription: card.DocumentHalfCardDescription,
};
