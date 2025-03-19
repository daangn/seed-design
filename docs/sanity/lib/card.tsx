import type { PortableTextTypeComponentProps } from "@portabletext/react";
import { Card, Cards } from "fumadocs-ui/components/card";

interface SanityCardsProps {
  cards: {
    title: string;
    description: string;
    href: string;
  }[];
}

export const SanityCards = (props: PortableTextTypeComponentProps<SanityCardsProps>) => {
  const value = props.value.cards;
  return (
    <Cards>
      {value.map((card) => (
        <Card key={card.href} title={card.title} description={card.description} href={card.href} />
      ))}
    </Cards>
  );
};
