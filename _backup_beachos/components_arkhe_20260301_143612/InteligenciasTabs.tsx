"use client";
import React from "react";

type Tab = { href: string; label: string; icon: string };

const TABS: Tab[] = [
  { href: "/inteligencias", label: "Profesiones", icon: "👥" },
  { href: "/inteligencias/legal", label: "Legislación", icon: "📜" },
  { href: "/inteligencias/ia", label: "IA Central", icon: "🤖" },
  { href: "/inteligencias/agente", label: "Agente", icon: "🧠" },
];

export default function InteligenciasTabs({ active }: { active: string }) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
      {TABS.map((t) => {
        const isOn = active === t.href;
        return (
          <a
            key={t.href}
            href={t.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 12px",
              borderRadius: 14,
              border: isOn ? "1px solid rgba(15,23,42,0.25)" : "1px solid rgba(15,23,42,0.12)",
              background: isOn ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.88)",
              color: "#0f172a",
              fontWeight: 900,
              textDecoration: "none",
              boxShadow: "0 10px 24px rgba(2,6,23,0.08)",
              backdropFilter: "blur(6px)",
            }}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </a>
        );
      })}
    </div>
  );
}
