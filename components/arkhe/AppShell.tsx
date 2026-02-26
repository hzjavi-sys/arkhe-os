"use client";

import React from "react";

type Props = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  active?: "home" | "proyectos" | "notas" | "admin_users" | "admin_empresas";
  me?: { email?: string; role?: string } | null;
  onLogout?: () => Promise<void> | void;
};

export default function AppShell({ title = "ARKHE OS", subtitle, children }: Props) {
  const css: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100vh",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
      color: "#0b1220",
      backgroundColor: "#eef2ff",
    },
    // Fondo + cerebro + blur + sweep
    hero: {
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
      backgroundImage:
        "linear-gradient(180deg, rgba(2,6,23,0.06), rgba(2,6,23,0.00) 40%), url('https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=2400&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
    },
    // capa “haze” para que no encandile
    haze: {
      position: "absolute",
      inset: 0,
      background:
        "radial-gradient(1200px 600px at 15% 10%, rgba(99,102,241,0.18), rgba(0,0,0,0)), radial-gradient(900px 500px at 85% 20%, rgba(236,72,153,0.14), rgba(0,0,0,0)), linear-gradient(180deg, rgba(255,255,255,0.78), rgba(255,255,255,0.90))",
      backdropFilter: "blur(2px)",
      pointerEvents: "none",
    },
    // ✅ LIGHT SWEEP (barrido de luz)
    sweep: {
      position: "absolute",
      inset: "-40% -20%",
      background:
        "linear-gradient(120deg, rgba(255,255,255,0) 35%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 65%)",
      transform: "translateX(-60%) rotate(8deg)",
      animation: "arkhe_sweep 7.5s ease-in-out infinite",
      pointerEvents: "none",
      mixBlendMode: "screen",
      opacity: 0.65,
    },
    topbar: {
      position: "relative",
      zIndex: 2,
      height: 56,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      background: "rgba(255,255,255,0.55)",
      borderBottom: "1px solid rgba(15,23,42,0.08)",
      backdropFilter: "blur(10px)",
    },
    brand: { display: "flex", alignItems: "center", gap: 10, fontWeight: 800, letterSpacing: 0.3 },
    dot: { width: 8, height: 8, borderRadius: 999, background: "#ef4444", boxShadow: "0 0 0 3px rgba(239,68,68,0.15)" },
    nav: { display: "flex", gap: 14, alignItems: "center", fontWeight: 600, fontSize: 14, color: "#0f172a" },
    navItem: { padding: "6px 10px", borderRadius: 999, background: "rgba(255,255,255,0.55)", border: "1px solid rgba(15,23,42,0.10)" },
    right: { display: "flex", gap: 10, alignItems: "center" },
    iconBtn: {
      width: 34,
      height: 34,
      borderRadius: 999,
      border: "1px solid rgba(15,23,42,0.12)",
      background: "rgba(255,255,255,0.65)",
      display: "grid",
      placeItems: "center",
      cursor: "pointer",
    },
    main: {
      position: "relative",
      zIndex: 2,
      padding: "26px 20px",
      display: "flex",
      justifyContent: "center",
    },
    card: {
      width: "min(1100px, 100%)",
      background: "rgba(255,255,255,0.78)",
      border: "1px solid rgba(15,23,42,0.10)",
      borderRadius: 18,
      boxShadow: "0 18px 60px rgba(15,23,42,0.12)",
      padding: 18,
      backdropFilter: "blur(10px)",
    },
    h1: { margin: 0, fontSize: 22, fontWeight: 900 },
    sub: { margin: "6px 0 0", color: "rgba(15,23,42,0.65)", fontSize: 14 },
  };

  return (
    <div style={css.page}>
      <style>{`
        @keyframes arkhe_sweep {
          0%   { transform: translateX(-70%) rotate(8deg); opacity: 0.0; }
          12%  { opacity: 0.35; }
          40%  { opacity: 0.70; }
          70%  { opacity: 0.35; }
          100% { transform: translateX(70%) rotate(8deg); opacity: 0.0; }
        }
      `}</style>

      <div style={css.hero}>
        <div style={css.haze} />
        <div style={css.sweep} />

        <div style={css.topbar}>
          <div style={css.brand}>
            <span style={css.dot} />
            <span>ARKHE OS</span>
          </div>

          <div style={css.nav}>
            <span style={css.navItem}>Home</span>
            <span style={css.navItem}>Operación</span>
            <span style={css.navItem}>Inteligencias</span>
            <span style={css.navItem}>Integraciones</span>
          </div>

          <div style={css.right}>
            <button style={css.iconBtn} title="Config" aria-label="Config">⚙️</button>
            <button style={css.iconBtn} title="Perfil" aria-label="Perfil">👤</button>
          </div>
        </div>

        <div style={css.main}>
          <div style={css.card}>
            <h1 style={css.h1}>{title}</h1>
            {subtitle ? <div style={css.sub}>{subtitle}</div> : null}
            <div style={{ marginTop: 16 }}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
