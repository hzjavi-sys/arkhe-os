"use client";
import React from "react";

export default function AppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div style={{ minHeight: "100vh", fontFamily: "system-ui" }}>
      <div style={{ background: "#111", color: "white", padding: "12px 16px", fontWeight: 800 }}>
        ARKHE OS {title ? `· ${title}` : ""}
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}
