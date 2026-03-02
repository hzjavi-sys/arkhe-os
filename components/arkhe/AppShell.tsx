"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type Me = { userId: number; email: string; role: string; empresaId?: number | null } | null;

export default function AppShell({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [me, setMe] = useState<Me>(null);

  async function cargarMe() {
    try {
      const r = await fetch("/api/me", { cache: "no-store" });
      if (!r.ok) {
        setMe(null);
        return;
      }
      const j = await r.json();
      setMe(j);
    } catch {
      setMe(null);
    }
  }

  async function logout() {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {}
    router.push("/login");
  }

  useEffect(() => {
    cargarMe();
  }, []);

  const styles = {
    page: {
      minHeight: "100vh",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
      background: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(244,247,255,1) 100%)",
    } as React.CSSProperties,

    container: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "18px 14px 40px",
    } as React.CSSProperties,

    topbar: {
      borderRadius: 22,
      background: "rgba(255,255,255,0.88)",
      border: "1px solid rgba(15,23,42,0.10)",
      boxShadow: "0 10px 30px rgba(2,6,23,0.10)",
      padding: 14,
      backdropFilter: "blur(10px)",
    } as React.CSSProperties,

    topInner: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      flexWrap: "wrap",
    } as React.CSSProperties,

    brand: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontWeight: 950,
      color: "#0f172a",
      letterSpacing: "-0.02em",
    } as React.CSSProperties,

    dot: {
      width: 12,
      height: 12,
      borderRadius: 999,
      background: "linear-gradient(135deg, #22c55e, #06b6d4)",
      boxShadow: "0 6px 16px rgba(2,6,23,0.18)",
    } as React.CSSProperties,

    nav: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      alignItems: "center",
    } as React.CSSProperties,

    pill: (active: boolean) =>
      ({
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        borderRadius: 14,
        border: active ? "1px solid rgba(15,23,42,0.90)" : "1px solid rgba(15,23,42,0.14)",
        background: active ? "rgba(15,23,42,0.90)" : "rgba(255,255,255,0.86)",
        color: active ? "#ffffff" : "#0f172a",
        fontWeight: 900,
        textDecoration: "none",
        boxShadow: active ? "0 10px 26px rgba(2,6,23,0.16)" : "0 6px 18px rgba(2,6,23,0.10)",
        userSelect: "none",
      }) as React.CSSProperties,

    right: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    } as React.CSSProperties,

    meChip: {
      padding: "8px 12px",
      borderRadius: 14,
      border: "1px solid rgba(15,23,42,0.12)",
      background: "rgba(255,255,255,0.80)",
      color: "#0f172a",
      fontWeight: 800,
      maxWidth: 320,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    } as React.CSSProperties,

    btn: {
      padding: "10px 12px",
      borderRadius: 14,
      border: "1px solid rgba(15,23,42,0.14)",
      background: "rgba(255,255,255,0.86)",
      color: "#0f172a",
      fontWeight: 900,
      cursor: "pointer",
    } as React.CSSProperties,

    body: {
      marginTop: 14,
      borderRadius: 22,
      background: "rgba(255,255,255,0.70)",
      border: "1px solid rgba(15,23,42,0.10)",
      boxShadow: "0 10px 30px rgba(2,6,23,0.08)",
      padding: 18,
      backdropFilter: "blur(10px)",
    } as React.CSSProperties,
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topbar}>
          <div style={styles.topInner}>
            <div style={styles.brand}>
              <span style={styles.dot} />
              <span>BEACH OS</span>
              {title ? <span style={{ color: "#475569", fontWeight: 800 }}>· {title}</span> : null}
            </div>

            <nav style={styles.nav}>
              <Link href="/home" style={styles.pill(pathname === "/home")}>Home</Link>
              <Link href="/proyectos" style={styles.pill(pathname.startsWith("/proyectos") || pathname === "/")}>Proyectos</Link>
              <Link href="/inteligencias" style={styles.pill(pathname.startsWith("/inteligencias"))}>Inteligencias</Link>
              <Link href="/integraciones" style={styles.pill(pathname.startsWith("/integraciones"))}>Integraciones</Link>
            </nav>

            <div style={styles.right}>
              <div style={styles.meChip}>
                {me ? `${me.email} (${me.role})` : "No logueado"}
              </div>
              <button style={styles.btn} onClick={logout}>Cerrar sesión</button>
            </div>
          </div>
        </div>

        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
}
