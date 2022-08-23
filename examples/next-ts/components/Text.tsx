import React from "react";

const Text: React.FC<React.PropsWithChildren<{
  type:
    | "body-l1"
    | "body-l2"
    | "body-m1"
    | "body-m2"
    | "label1"
    | "label2"
    | "label3"
    | "label4"
    | "label5"
    | "label6";
  weight: "regular" | "bold";
}>> = ({ type, weight, children }) => {
  return (
    <p
      style={{ maxWidth: "420px" }}
      className={`seed-semantic-typography-${type}-${weight}`}
    >
      {children}
    </p>
  );
};

export default Text;
