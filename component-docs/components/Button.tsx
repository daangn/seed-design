"use client";

import React from "react";

export const Button = ({ title }) => (
  <div
    style={{
      padding: 10,
      backgroundColor: "#333",
      color: "#fff",
      display: "inline-block",
      borderRadius: 4,
    }}
    onClick={() => alert("Hi")}
  >
    {title}
  </div>
);
