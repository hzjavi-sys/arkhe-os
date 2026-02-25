"use client";
import React from "react";

export default function LoginPage() {
  const [user, setUser] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const entrar = async () => {
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ user, pass }),
    });

    const txt = await res.text();
    let data: any = {};
    try { data = JSON.parse(txt); } catch {}

    if (!res.ok || !data?.ok) {
      setError(data?.error || "Credenciales incorrectas");
      return;
    }
    window.location.href = "/";
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      <div style={{ width: 420, border: "1px solid #ddd", borderRadius: 14, padding: 18, background: "white" }}>
        <h2 style={{ margin: 0 }}>ARKHE OS</h2>
        <p style={{ marginTop: 6, color: "#666" }}>Login</p>

        <label>Usuario</label>
        <input value={user} onChange={(e) => setUser(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 6 }} />

        <label style={{ display: "block", marginTop: 10 }}>Contraseña</label>
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 6 }} />

        {error && <div style={{ marginTop: 10, color: "crimson" }}>{error}</div>}

        <button onClick={entrar} style={{ marginTop: 12, width: "100%", padding: 12, background: "black", color: "white", borderRadius: 10 }}>
          Entrar
        </button>
      </div>
    </div>
  );
}
