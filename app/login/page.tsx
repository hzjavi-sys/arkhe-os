"use client";
import React from "react";

export default function LoginPage() {
  const [email, setEmail] = React.useState("admin@arkhe.com");
  const [password, setPassword] = React.useState("1234");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const login = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "No se pudo iniciar sesión");
        return;
      }

      window.location.href = "/";
    } catch (e: any) {
      setError(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#f5f6fa,#ffffff)",
        display: "grid",
        placeItems: "center",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: -0.5 }}>ARKHE OS</div>
          <div style={{ color: "#666" }}>Ingresá para continuar</div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: 22,
            border: "1px solid rgba(0,0,0,0.07)",
            boxShadow: "0 14px 35px rgba(0,0,0,0.08)",
          }}
        >
          <label style={{ fontSize: 12, color: "#666" }}>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              marginTop: 6,
              marginBottom: 12,
              padding: "12px 12px",
              borderRadius: 12,
              border: "1px solid #ddd",
              outline: "none",
            }}
          />

          <label style={{ fontSize: 12, color: "#666" }}>Password</label>
          <input
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              marginTop: 6,
              marginBottom: 14,
              padding: "12px 12px",
              borderRadius: 12,
              border: "1px solid #ddd",
              outline: "none",
            }}
          />

          <button
            onClick={login}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "none",
              background: "black",
              color: "white",
              fontWeight: 800,
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {error && <div style={{ marginTop: 10, color: "crimson", fontSize: 13 }}>Error: {error}</div>}
        </div>

        <div style={{ marginTop: 14, color: "#888", fontSize: 12 }}>
          Tip: el rol (ADMIN/USER) determina permisos y visibilidad.
        </div>
      </div>
    </main>
  );
}
