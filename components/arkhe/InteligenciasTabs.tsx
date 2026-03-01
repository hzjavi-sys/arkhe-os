"use client";
import React from "react";

type Props = { active: "profesiones" | "legal" | "ia" | "agente" };

export default function InteligenciasTabs({ active }: Props) {
  const pill = (on: boolean): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: 999,
    border: on ? "1px solid rgba(15,23,42,0.25)" : "1px solid rgba(15,23,42,0.12)",
    background: on ? "rgba(15,23,42,0.10)" : "rgba(255,255,255,0.85)",
    boxShadow: "0 8px 20px rgba(2,6,23,0.10)",
    fontWeight: 900,
    color: "#0f172a",
    textDecoration: "none",
    cursor: "pointer",
    userSelect: "none",
  });

  const wrap: React.CSSProperties = { display: "flex", gap: 10, flexWrap: "wrap" };

  return (
    <div style={wrap}>
      <a href="/inteligencias" style={pill(active === "profesiones")}>👥 Profesiones</a>
      <a href="/inteligencias/legal" style={pill(active === "legal")}>📜 Legislación</a>
      <a href="/inteligencias/ia" style={pill(active === "ia")}>🤖 IA Central</a>
      <a href="/inteligencias/agente" style={pill(active === "agente")}>🧠 Agente</a>
    </div>
  );
}
