"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SystemLayout from "../design/SystemLayout";

type Me = { userId: number; email: string; role: string; empresaId?: number | null } | null;

export default function AppShell({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [me, setMe] = useState<Me>(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [openConfig, setOpenConfig] = useState(false);

  const profRef = useRef<HTMLDivElement | null>(null);
  const cfgRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    cargarMe();
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (profRef.current && !profRef.current.contains(t)) setOpenProfile(false);
      if (cfgRef.current && !cfgRef.current.contains(t)) setOpenConfig(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  async function logout() {
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      setMe(null);
      router.push("/login");
      router.refresh();
    }
  }

  const styles = {
    page: {
      minHeight: "100vh",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
      backgroundImage:
        "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
    } as React.CSSProperties,

    // 👇 ESTE ES EL “NO AZUL”: overlay BLANCO suave
    overlay: {
      minHeight: "100vh",
      background: "rgba(255,255,255,0)",
      backdropFilter: "blur(4px)",
    } as React.CSSProperties,

    topbar: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "rgba(255,255,255,0)",
      backdropFilter: "blur(6px)",
      borderBottom: "1px solid rgba(15, 23, 42, 0.10)",
    } as React.CSSProperties,

    topInner: {
      maxWidth: 1200,
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "12px 16px",
    } as React.CSSProperties,

    brand: { display: "flex", alignItems: "center", gap: 10, fontWeight: 900, color: "#0f172a" } as React.CSSProperties,
    dot: { width: 8, height: 8, borderRadius: 999, background: "#ef4444", display: "inline-block" } as React.CSSProperties,

    nav: { display: "flex", alignItems: "center", gap: 10, marginLeft: 18 } as React.CSSProperties,

    pill: (active: boolean) =>
      ({
        padding: "8px 14px",
        borderRadius: 999,
        border: active ? "1px solid rgba(15,23,42,0.25)" : "1px solid rgba(15,23,42,0.12)",
        background: active ? "rgba(15,23,42,0.06)" : "rgba(255,255,255,0.85)",
        color: "#0f172a",
        fontWeight: 800,
        textDecoration: "none",
      } as React.CSSProperties),

    right: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 } as React.CSSProperties,

    iconBtn: {
      width: 36,
      height: 36,
      borderRadius: 12,
      border: "1px solid rgba(15,23,42,0.12)",
      background: "rgba(255,255,255,0)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    } as React.CSSProperties,

    dropdown: {
      position: "absolute",
      top: 44,
      right: 0,
      width: 260,
      borderRadius: 14,
      border: "1px solid rgba(15,23,42,0.12)",
      background: "rgba(255,255,255,0)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      padding: 10,
    } as React.CSSProperties,

    ddTitle: { fontSize: 12, color: "#475569", fontWeight: 800, marginBottom: 8 } as React.CSSProperties,

    ddItem: {
      width: "100%",
      textAlign: "left",
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid rgba(15,23,42,0.10)",
      background: "rgba(255,255,255,0)",
      cursor: "pointer",
      fontWeight: 800,
      color: "#0f172a",
    } as React.CSSProperties,

    container: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "26px 16px 70px",
    } as React.CSSProperties,

    card: {
      background: "rgba(255,255,255,0)",
      border: "1px solid rgba(15,23,42,0.10)",
      borderRadius: 18,
      padding: 20,
      boxShadow: "0 18px 60px rgba(0,0,0,0.10)",
    } as React.CSSProperties,

    h1: { fontSize: 22, fontWeight: 950, margin: 0, color: "#0f172a" } as React.CSSProperties,
    sub: { marginTop: 6, color: "#475569", fontWeight: 700 } as React.CSSProperties,
  };

  return (
    <SystemLayout>
    <div style={styles.page}>
      <div style={styles.overlay}>
        <div style={styles.topbar}>
          <div style={styles.topInner}>
            <div style={styles.brand}>
              <span style={styles.dot} />
              <span>BEACH OS</span>
            </div>

            <nav style={styles.nav}>
              <Link href="/home" style={styles.pill(pathname === "/home")}>Home</Link>
              <Link href="/proyectos" style={styles.pill(pathname?.startsWith("/proyectos") || pathname === "/")}>Operación</Link>
              <Link href="/inteligencias" style={styles.pill(pathname?.startsWith("/inteligencias"))}>Inteligencias</Link>
              <Link href="/integraciones" style={styles.pill(pathname?.startsWith("/integraciones"))}>Integraciones</Link>
            </nav>

            <div style={styles.right}>
              <div style={{ position: "relative" }} ref={cfgRef}>
                <button
                  type="button"
                  style={styles.iconBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenConfig((v) => !v);
                    setOpenProfile(false);
                  }}
                  title="Configuración"
                >
                  ⚙️
                </button>
                {openConfig && (
                  <div style={styles.dropdown}>
                    <div style={styles.ddTitle}>Configuración</div>
                    <button style={styles.ddItem} onClick={() => router.push("/admin/users")}>Admin Usuarios</button>
                    <div style={{ height: 8 }} />
                    <button style={styles.ddItem} onClick={() => router.push("/admin/empresas")}>Admin Empresas</button>
                  </div>
                )}
              </div>

              <div style={{ position: "relative" }} ref={profRef}>
                <button
                  type="button"
                  style={styles.iconBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenProfile((v) => !v);
                    setOpenConfig(false);
                  }}
                  title="Perfil"
                >
                  👤
                </button>
                {openProfile && (
                  <div style={styles.dropdown}>
                    <div style={styles.ddTitle}>{me?.email || "Sin sesión"}</div>
                    <button style={styles.ddItem} onClick={logout} title="Cerrar sesión">Cerrar sesión</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <main style={styles.container}>
          <div style={styles.card}>
            {title && <h1 style={styles.h1}>{title}</h1>}
            {title && <div style={styles.sub}>Panel</div>}
            <div style={{ marginTop: title ? 14 : 0 }}>{children}</div>
          </div>
        </main>
      </div>
    </div>
    </SystemLayout>
  );
}
