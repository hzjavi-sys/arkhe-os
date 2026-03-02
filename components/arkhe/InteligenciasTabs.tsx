"use client";
import React from "react";
import Link from "next/link";
import { BEACH } from "../diseno/theme";
import { INTEL_TABS, IntelTabId } from "../diseno/inteligenciasTabs";

export default function InteligenciasTabs({ active }: { active: IntelTabId }) {
  const pill = (isActive: boolean): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: 14,
    border: isActive ? BEACH.pill.borderActive : BEACH.pill.border,
    background: isActive ? BEACH.pill.bgActive : BEACH.pill.bg,
    color: isActive ? BEACH.pill.textActive : BEACH.pill.text,
    fontWeight: 900,
    textDecoration: "none",
    boxShadow: isActive ? "0 10px 26px rgba(2,6,23,0.16)" : "0 6px 18px rgba(2,6,23,0.10)",
    userSelect: "none",
    whiteSpace: "nowrap",
  });

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {INTEL_TABS.map((t) => (
        <Link key={t.id} href={t.href} style={pill(active === t.id)}>
          <span aria-hidden="true">{t.icon}</span>
          <span>{t.label}</span>
        </Link>
      ))}
    </div>
  );
}
