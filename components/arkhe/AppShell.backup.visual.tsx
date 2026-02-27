"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { dailyBeachUrl } from "../../lib/dailyBeach";

type Me = { userId: number; email: string; role: string; empresaId?: number | null } | null;

function Pill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        padding: "10px 14px",
        borderRadius: 999,
        fontWeight: 800,
        textDecoration: "none",
        color: "#0b1220",
        background: active ? "rgba(11,18,32,0.08)" : "rgba(255,255,255,0.85)",
        border: "1px solid rgba(11,18,32,0.10)",
        boxShadow: "0 10px 26px rgba(11,18,32,0.10)",
      }}
    >
      {children}
    </Link>
  );
}

export default function AppShell({
  title,
  active,
  variant = "app",
  children,
}: {
  title: string;
  active: "home" | "operacion" | "inteligencias" | "integraciones";
  variant?: "home" | "app";
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<Me>(null);

  const [openOp, setOpenOp] = useState(false);
  const [openCfg, setOpenCfg] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const bg = useMemo(() => dailyBeachUrl(), []);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/me", { cache: "no-store" });
        const j = r.ok ? await r.json() : null;
        setMe(j?.userId ? j : null);
      } catch {
        setMe(null);
      }
    })();
  }, [pathname]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpenOp(false);
        setOpenCfg(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  async function logout() {
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
      setTimeout(() => (window.location.href = "/login"), 120);
    }
  }

  const isHome = variant === "home";

  const pageStyle: React.CSSProperties = isHome
    ? {
        minHeight: "100vh",
        backgroundImage: `url('${bg}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }
    : {
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f6f7fb 0%, #eef2ff 55%, #ffffff 100%)",
      };

  const overlayStyle: React.CSSProperties = isHome
    ? {
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 45%, rgba(255,255,255,0.92) 100%)",
      }
    : { minHeight: "100vh" };

  const topbar: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
  };

  const container: React.CSSProperties = {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: 14,
  };

  const card: React.CSSProperties = {
    maxWidth: 1200,
    margin: "0 auto",
    background: "rgba(255,255,255,0.86)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 20,
    boxShadow: "0 30px 90px rgba(11,18,32,0.10)",
    padding: 20,
  };

  const dd: React.CSSProperties = {
    position: "absolute",
    top: 44,
    left: 0,
    minWidth: 240,
    background: "rgba(255,255,255,0.96)",
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 16,
    boxShadow: "0 20px 60px rgba(0,0,0,0.14)",
    padding: 8,
    zIndex: 80,
  };

  const ddItem: React.CSSProperties = {
    display: "block",
    padding: "10px 12px",
    borderRadius: 12,
    textDecoration: "none",
    color: "#0b1220",
    fontWeight: 800,
  };

  return (
    <div style={pageStyle}>
      <div style={overlayStyle}>
        <div ref={ref}>
          <header style={topbar}>
            <div style={container}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 950, letterSpacing: 0.3 }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: "#ff3b30" }} />
                <span>BEACH OS</span>
              </div>

              <Pill href="/home" active={active === "home"}>Home</Pill>

              <div style={{ position: "relative" }}>
                <button
                  onClick={() => { setOpenOp(v => !v); setOpenCfg(false); }}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 999,
                    border: "1px solid rgba(11,18,32,0.10)",
                    background: "rgba(255,255,255,0.85)",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  Operación ▾
                </button>
                {openOp && (
                  <div style={dd}>
                    <Link href="/proyectos" style={ddItem}>Proyectos</Link>
                    <Link href="/notas" style={ddItem}>Notas</Link>
                  </div>
                )}
              </div>

              <Pill href="/inteligencias" active={active === "inteligencias"}>Inteligencias</Pill>
              <Pill href="/integraciones" active={active === "integraciones"}>Integraciones</Pill>

              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
                <div style={{ fontSize: 12, opacity: 0.7, maxWidth: 360, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {me ? `${me.email} (${me.role})` : ""}
                </div>

                <button
                  title="Config"
                  onClick={() => { setOpenCfg(v => !v); setOpenOp(false); }}
                  style={{ width: 40, height: 40, borderRadius: 12, border: "1px solid rgba(0,0,0,0.10)", background: "rgba(255,255,255,0.92)", cursor: "pointer" }}
                >
                  ⚙️
                </button>

                <button
                  title="Perfil"
                  onClick={() => { setOpenCfg(v => !v); setOpenOp(false); }}
                  style={{ width: 40, height: 40, borderRadius: 12, border: "1px solid rgba(0,0,0,0.10)", background: "rgba(255,255,255,0.92)", cursor: "pointer" }}
                >
                  👤
                </button>

                {openCfg && (
                  <div style={{ ...dd, right: 0, left: "auto" }}>
                    <Link href="/admin/users" style={ddItem}>Admin Usuarios</Link>
                    <Link href="/admin/empresas" style={ddItem}>Admin Empresas</Link>
                    <button
                      onClick={logout}
                      style={{
                        ...ddItem,
                        width: "100%",
                        textAlign: "left",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        color: "#b91c1c",
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main style={{ padding: "26px 18px 60px" }}>
            <div style={card}>
              <div style={{ fontSize: 26, fontWeight: 950, marginBottom: 12 }}>{title}</div>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
