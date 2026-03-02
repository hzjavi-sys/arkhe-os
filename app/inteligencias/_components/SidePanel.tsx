"use client";
import React from "react";

export default function SidePanel({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(2,6,23,0.35)",
        display: "flex",
        justifyContent: "flex-end",
        zIndex: 200,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 560,
          maxWidth: "92vw",
          height: "100vh",
          background: "rgba(255,255,255,0.97)",
          borderLeft: "1px solid rgba(15,23,42,0.12)",
          padding: 18,
          overflow: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 950, fontSize: 18, color: "#0f172a" }}>{title}</div>
          <button
            onClick={onClose}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "rgba(255,255,255,0.9)",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Cerrar
          </button>
        </div>

        <div style={{ marginTop: 14 }}>{children}</div>
      </div>
    </div>
  );
}
