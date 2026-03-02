"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const router = useRouter();
  const pathname = usePathname() || "";

  const [me, setMe] = useState<Me>(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [openConfig, setOpenConfig] = useState(false);

  const profRef = useRef<HTMLDivElement | null>(null);
  const cfgRef = useRef<HTMLDivElement | null>(null);

  async function cargarMe() {
    try {
      const r = await fetch("/api/me", { cache: "no-store" });
      if (!r.ok) return setMe(null);
      setMe(await r.json());
    } catch {
      setMe(null);
    }
  }

  useEffect(() => {
    cargarMe();
  }, []);

  useEffect(() => {
    const onDoc = (ev: MouseEvent) => {
      const t = ev.target as Node;
      if (openProfile && profRef.current && !profRef.current.contains(t)) setOpenProfile(false);
      if (openConfig && cfgRef.current && !cfgRef.current.contains(t)) setOpenConfig(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [openProfile, openConfig]);

  async function logout() {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {}
    setMe(null);
    router.push("/login");
    router.refresh();
  }

  const styles = {
    page: {
      minHeight: "100vh",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
    } as React.CSSProperties,

    overlay: {
      minHeight: "100vh",
      padding: 14,
      color: "#0f172a",
    } as React.CSSProperties,

    topbar: {
      borderRadius: 18,
      background: "rgba(255,255,255,0.65)",
      border: "1px solid rgba(15,23,42,0.10)",
      boxShadow: "0 18px 50px rgba(2,6,23,0.14)",
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
      fontSize: 18,
    } as React.CSSProperties,

    dot: {
      width: 10,
      height: 10,
      borderRadius: 99,
      background: "#0f172a",
      display: "inline-block",
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
        background: active ? "rgba(15,23,42,0.92)" : "rgba(255,255,255,0.88)",
        color: active ? "#fff" : "#0f172a",
        fontWeight: 900,
        textDecoration: "none",
        boxShadow: active ? "0 10px 26px rgba(2,6,23,0.16)" : "0 6px 18px rgba(2,6,23,0.10)",
        whiteSpace: "nowrap",
      } as React.CSSProperties),

    iconBtn: {
      padding: "10px 12px",
      borderRadius: 14,
      border: "1px solid rgba(15,23,42,0.14)",
      background: "rgba(255,255,255,0.88)",
      cursor: "pointer",
      fontWeight: 900,
      color: "#0f172a",
    } as React.CSSProperties,

    drop: {
      position: "absolute",
      right: 0,
      top: 46,
      width: 280,
      borderRadius: 16,
      background: "rgba(255,255,255,0.96)",
      border: "1px solid rgba(15,23,42,0.12)",
      boxShadow: "0 20px 60px rgba(2,6,23,0.18)",
      padding: 12,
      zIndex: 50,
    } as React.CSSProperties,

    contentWrap: {
      marginTop: 14,
      borderRadius: 22,
      background: "rgba(255,255,255,0.60)",
      border: "1px solid rgba(15,23,42,0.10)",
      boxShadow: "0 18px 50px rgba(2,6,23,0.14)",
      padding: 18,
      backdropFilter: "blur(10px)",
    } as React.CSSProperties,

    title: {
      marginBottom: 10,
      fontSize: 22,
      fontWeight: 950,
      color: "#0f172a",
    } as React.CSSProperties,
  };

  return (
    <>
      <style>{`
        /* BEACH_OS_TYPO (cubo) */
        html, body { font-size: 18px; }
        body { line-height: 1.35; }
        h1 { font-size: 30px; font-weight: 950; letter-spacing: -0.02em; }
        h2 { font-size: 22px; font-weight: 900; letter-spacing: -0.01em; }
        h3 { font-size: 18px; font-weight: 900; }
        button, input, select, textarea { font-size: 16px; }
      `}</style>

      <div style={styles.page}>
        <div style={styles.overlay}>
          <div style={styles.topbar}>
            <div style={styles.topInner}>
              <div style={styles.brand}>
                <span style={styles.dot} />
                <span>BEACH OS</span>
              </div>

              <nav style={styles.nav}>
                <Link href="/home" style={styles.pill(pathname.startsWith("/home"))}>Home</Link>
                <Link href="/proyectos" style={styles.pill(pathname.startsWith("/proyectos") || pathname === "/")}>Proyectos</Link>
                <Link href="/inteligencias" style={styles.pill(pathname.startsWith("/inteligencias"))}>Inteligencias</Link>
                <Link href="/integraciones" style={styles.pill(pathname.startsWith("/integraciones"))}>Integraciones</Link>
              </nav>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div ref={cfgRef} style={{ position: "relative" }}>
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
                    <div style={styles.drop}>
                      <div style={{ fontWeight: 950 }}>Configuración</div>
                      <div style={{ marginTop: 6, color: "#475569", fontWeight: 700 }}>
                        Tema global: lo vamos a centralizar después (sin romper).
                      </div>
                    </div>
                  )}
                </div>

                <div ref={profRef} style={{ position: "relative" }}>
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
                    <div style={styles.drop}>
                      <div style={{ fontWeight: 950 }}>Sesión</div>
                      <div style={{ marginTop: 6, color: "#475569", fontWeight: 800 }}>
                        {me?.email ? me.email : "(no logueado)"}
                      </div>
                      <div style={{ marginTop: 4, color: "#475569", fontWeight: 800 }}>
                        Rol: {me?.role || "—"}
                      </div>

                      <button
                        onClick={logout}
                        style={{
                          marginTop: 12,
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 14,
                          border: "1px solid rgba(185,28,28,0.28)",
                          background: "rgba(185,28,28,0.10)",
                          color: "#b91c1c",
                          fontWeight: 950,
                          cursor: "pointer",
                        }}
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div style={styles.contentWrap}>
            {title ? <div style={styles.title}>{title}</div> : null}
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
