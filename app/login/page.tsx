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
        display: "grid",
        placeItems: "center",
        fontFamily: "Arial, sans-serif",
        background: "#f5f5f7",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "white",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>
          ARKHE OS
        </div>
        <div style={{ color: "#666", marginBottom: 20 }}>
          Ingresá para continuar
        </div>

        <label style={{ fontSize: 12, color: "#666" }}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          style={{
            width: "100%",
            padding: "12px 12px",
            borderRadius: 12,
            border: "1px solid #ddd",
            marginTop: 6,
            marginBottom: 14,
            outline: "none",
          }}
        />

        <label style={{ fontSize: 12, color: "#666" }}>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          type="password"
          style={{
            width: "100%",
            padding: "12px 12px",
            borderRadius: 12,
            border: "1px solid #ddd",
            marginTop: 6,
            marginBottom: 14,
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
            fontWeight: 700,
            cursor: "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {error && (
          <div style={{ marginTop: 12, color: "crimson", fontSize: 13 }}>
            Error: {error}
          </div>
        )}

        <div style={{ marginTop: 14, fontSize: 12, color: "#888" }}>
          Tip: más adelante esto se conecta con permisos y roles (ADMIN/USER).
        </div>
      </div>
    </main>
  );
}
