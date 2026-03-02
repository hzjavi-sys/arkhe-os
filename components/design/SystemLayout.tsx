"use client";

import React from "react";
import { BEACH_THEME as T } from "./theme";

export default function SystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `${T.pageOverlay}, url("${T.backgroundImageUrl}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* capa suave para legibilidad */}
      <div
        style={{
          minHeight: "100vh",
          backdropFilter: `blur(${T.blurPx}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
