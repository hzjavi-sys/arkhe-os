"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type Me = { userId: number; email: string; role: string; empresaId?: number | null };

export default function AppShell({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [me, setMe] = useState<Me | null>(null);
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  async function loadMe() {
    try {
      const r = await fetch("/api/me", { cache: "no-store" });
      const j = r.ok ? await r.json() : null;
      setMe(j);
    } catch {
      setMe(null);
    }
  }

  useEffect(() => {
    loadMe();
  }, [pathname]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target as any)) setOpenProfile(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  async function logout() {
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      setOpenProfile(false);
      setMe(null);
      router.push("/login");
      router.refresh();
    }
  }

  const navItems = useMemo(
    () => [
      { href: "/home", label: "Home" },
      { href: "/proyectos", label: "Operación" }, // después lo abrimos con submenú
      { href: "/inteligencias", label: "Inteligencias" },
      { href: "/integraciones", label: "Integraciones" },
    ],
    []
  );

  const styles: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100vh",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
      color: "#0f172a",
    },

    // ✅ Fondo: NO CAPTURA CLICS
    bg: {
      position: "fixed",
      inset: 0,
      zIndex: 0,
      pointerEvents: "none",
      backgroundImage: "url('https://images.unsplash.com/photo-1559757175-5700dde67558?auto=format&fit=crop&w=2400&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      backgroundColor: "#0b1220",
filter: "saturate(1.05)",
    },
    bgOverlay: {
      position: "fixed",
      inset: 0,
      zIndex: 1,
      pointerEvents: "none",
      background: "rgba(255,255,255,0.72)",
      backdropFilter: "blur(10px)",
    },

    // ✅ Contenido: arriba y clickeable
    content: {
      position: "relative",
      zIndex: 2,
    },

    topbar: {
      position: "sticky",
      top: 0,
      zIndex: 10,
      background: "rgba(255,255,255,0.75)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid rgba(15,23,42,.08)",
    },
    topInner: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "14px 16px",
      display: "flex",
      alignItems: "center",
      gap: 16,
      justifyContent: "space-between",
    },
    brand: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontWeight: 900,
      letterSpacing: 0.5,
    },
    dot: { width: 8, height: 8, borderRadius: 999, background: "#ef4444" },
    nav: { display: "flex", alignItems: "center", gap: 10 },
    pill: (active: boolean): React.CSSProperties => ({
      padding: "8px 12px",
      borderRadius: 999,
      border: active ? "1px solid rgba(15,23,42,.25)" : "1px solid rgba(15,23,42,.10)",
      background: active ? "rgba(15,23,42,.06)" : "rgba(255,255,255,.55)",
      textDecoration: "none",
      color: "#0f172a",
      fontWeight: 700,
      fontSize: 14,
    }),
    right: { display: "flex", alignItems: "center", gap: 10 },
    iconBtn: {
      width: 34,
      height: 34,
      borderRadius: 10,
      border: "1px solid rgba(15,23,42,.12)",
      background: "rgba(255,255,255,.7)",
      display: "grid",
      placeItems: "center",
      cursor: "pointer",
    },
    dropdown: {
      position: "absolute",
      top: 42,
      right: 0,
      width: 220,
      background: "white",
      border: "1px solid rgba(15,23,42,.12)",
      borderRadius: 12,
      boxShadow: "0 20px 60px rgba(2,6,23,.16)",
      overflow: "hidden",
    },
    ddItem: {
      width: "100%",
      textAlign: "left",
      padding: "12px 12px",
      border: "none",
      background: "white",
      cursor: "pointer",
      fontWeight: 700,
      color: "#0f172a",
    },
    ddDanger: {
      width: "100%",
      textAlign: "left",
      padding: "12px 12px",
      border: "none",
      background: "white",
      cursor: "pointer",
      fontWeight: 800,
      color: "#ef4444",
    },
    main: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "22px 16px",
    },
    h1: { margin: 0, fontSize: 22, fontWeight: 900 },
    sub: { marginTop: 4, color: "rgba(15,23,42,.72)", fontWeight: 600 },
  };

  return (
    <div style={styles.page}>
      <div style={styles.bg} />
      <div style={styles.bgOverlay} />

      <div style={styles.content}>
        <header style={styles.topbar}>
          <div style={styles.topInner}>
            <div style={styles.brand}>
              <span style={styles.dot} />
              <span>ARKHE OS</span>
            </div>

            <nav style={styles.nav}>
              {navItems.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  style={styles.pill(pathname === it.href)}
                >
                  {it.label}
                </Link>
              ))}
            </nav>

            <div style={styles.right}>
              <button
                type="button"
                style={styles.iconBtn}
                title="Config"
                onClick={() => router.push("/config")}
              >
                ⚙️
              </button>

              <div style={{ position: "relative" }} ref={profileRef}>
                <button
                  type="button"
                  style={styles.iconBtn}
                  title="Perfil"
                  onClick={() => setOpenProfile((v) => !v)}
                >
                  👤
                </button>

                {openProfile && (
                  <div style={styles.dropdown}>
                    <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(15,23,42,.08)" }}>
                      <div style={{ fontWeight: 900, fontSize: 13 }}>{me?.email || "Sin sesión"}</div>
                      <div style={{ fontSize: 12, color: "rgba(15,23,42,.65)", marginTop: 2 }}>
                        {me?.role ? `Rol: ${me.role}` : ""}
                      </div>
                    </div>
                    <button type="button" style={styles.ddDanger} onClick={logout}>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main style={styles.main}>
          {title && (
            <div style={{ marginBottom: 12 }}>
              <h1 style={styles.h1}>{title}</h1>
              <div style={styles.sub}>Panel</div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
