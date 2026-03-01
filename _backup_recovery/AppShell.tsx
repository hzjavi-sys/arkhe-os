"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  title?: string;
  children: React.ReactNode;
};

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname === "/home";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AppShell({ title, children }: Props) {
  const pathname = usePathname() || "/";
  const inInteligencias = pathname === "/inteligencias" || pathname.startsWith("/inteligencias/");

  const bgUrl =
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2400&q=80"; // playa (estable)

  const css = {
    page: {
      minHeight: "100vh",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
      backgroundColor: "#f6f7fb",
      backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.64) 40%, rgba(255,255,255,0.78) 100%), url('${bgUrl}')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
    } as React.CSSProperties,

    topbarWrap: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      padding: "14px 18px",
      backdropFilter: "blur(10px)",
      background: "rgba(255,255,255,0.55)",
      borderBottom: "1px solid rgba(15,23,42,0.08)",
    } as React.CSSProperties,

    topbar: {
      maxWidth: 1180,
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      gap: 14,
      justifyContent: "space-between",
    } as React.CSSProperties,

    brand: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontWeight: 950,
      letterSpacing: 0.2,
      color: "#0f172a",
    } as React.CSSProperties,

    dot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      background: "#ef4444",
      boxShadow: "0 0 0 4px rgba(239,68,68,0.12)",
    } as React.CSSProperties,

    nav: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" } as React.CSSProperties,

    pill: (active: boolean) =>
      ({
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        borderRadius: 999,
        textDecoration: "none",
        fontWeight: 900,
        color: "#0f172a",
        border: active ? "1px solid rgba(15,23,42,0.22)" : "1px solid rgba(15,23,42,0.12)",
        background: active ? "rgba(15,23,42,0.06)" : "rgba(255,255,255,0.72)",
        boxShadow: "0 10px 30px rgba(2,6,23,0.08)",
      }) as React.CSSProperties,

    right: { display: "flex", alignItems: "center", gap: 10 } as React.CSSProperties,

    iconBtn: {
      width: 36,
      height: 36,
      borderRadius: 12,
      border: "1px solid rgba(15,23,42,0.12)",
      background: "rgba(255,255,255,0.72)",
      boxShadow: "0 10px 25px rgba(2,6,23,0.08)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      userSelect: "none",
    } as React.CSSProperties,

    contentWrap: { padding: "26px 18px 70px" } as React.CSSProperties,

    card: {
      maxWidth: 1180,
      margin: "0 auto",
      borderRadius: 24,
      border: "1px solid rgba(15,23,42,0.10)",
      background: "rgba(255,255,255,0.60)",
      boxShadow: "0 30px 90px rgba(2,6,23,0.10)",
      padding: 18,
      backdropFilter: "blur(12px)",
    } as React.CSSProperties,

    title: { fontSize: 20, fontWeight: 950, color: "#0f172a", marginBottom: 10 } as React.CSSProperties,

    subTabs: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      marginTop: 8,
      marginBottom: 14,
    } as React.CSSProperties,
  };

  return (
    <div style={css.page}>
      <div style={css.topbarWrap}>
        <div style={css.topbar}>
          <div style={css.brand}>
            <span style={css.dot} />
            <span>BEACH OS</span>
          </div>

          <div style={css.nav}>
            <Link href="/home" style={css.pill(isActive(pathname, "/home"))}>
              Home
            </Link>
            <Link href="/operacion" style={css.pill(isActive(pathname, "/operacion"))}>
              Operación
            </Link>
            <Link href="/inteligencias" style={css.pill(isActive(pathname, "/inteligencias"))}>
              Inteligencias
            </Link>
            <Link href="/integraciones" style={css.pill(isActive(pathname, "/integraciones"))}>
              Integraciones
            </Link>
          </div>

          <div style={css.right}>
            <div style={css.iconBtn} title="Config">
              ⚙️
            </div>
            <div style={css.iconBtn} title="Perfil">
              👤
            </div>
          </div>
        </div>
      </div>

      <div style={css.contentWrap}>
        <div style={css.card}>
          {title ? <div style={css.title}>{title}</div> : null}

          {/* ✅ SUBMENÚ SIEMPRE visible en TODO /inteligencias/* */}
          {inInteligencias && (
            <div style={css.subTabs}>
              <Link href="/inteligencias" style={css.pill(pathname === "/inteligencias")}>
                👥 Profesiones
              </Link>
              <Link href="/inteligencias/legal" style={css.pill(isActive(pathname, "/inteligencias/legal"))}>
                📜 Legislación
              </Link>
              <Link href="/inteligencias/ia" style={css.pill(isActive(pathname, "/inteligencias/ia"))}>
                🤖 IA Central
              </Link>
              <Link href="/inteligencias/agente" style={css.pill(isActive(pathname, "/inteligencias/agente"))}>
                🧠 Agente
              </Link>
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
