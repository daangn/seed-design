import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function Title({ children }: Props) {
  return <h1>{children}</h1>;
}
