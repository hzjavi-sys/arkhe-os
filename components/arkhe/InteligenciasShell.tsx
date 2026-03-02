"use client";

import React from "react";

export default function InteligenciasShell({
  title,
  subtitle = "Panel",
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        borderRadius: 22,
        background: "rgba(255,255,255,0.86)",
        border: "1px solid rgba(15,23,42,0.10)",
        boxShadow: "0 10px 30px rgba(2,6,23,0.10)",
        padding: 18,
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 950, color: "#0f172a" }}>{title}</div>
      <div style={{ marginTop: 4, color: "#475569", fontWeight: 800 }}>{subtitle}</div>
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  );
}
