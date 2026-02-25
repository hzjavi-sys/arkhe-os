"use client";
import React from "react";

type UserRow = { id: number; email: string; role: "ADMIN" | "USER"; createdAt: string };

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<UserRow[]>([]);
  const [err, setErr] = React.useState<string | null>(null);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState<"ADMIN" | "USER">("USER");

  const [resetId, setResetId] = React.useState<number | null>(null);
  const [resetPass, setResetPass] = React.useState("");

  const cargar = async () => {
    setErr(null);
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setErr(data?.error || "No autorizado (necesitás ADMIN)");
      return;
    }
    setUsers(data || []);
  };

  React.useEffect(() => {
    cargar();
  }, []);

  const crear = async () => {
    setErr(null);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setErr(data?.error || "Error creando usuario");
      return;
    }
    setEmail(""); setPassword(""); setRole("USER");
    await cargar();
  };

  const cambiarRol = async (id: number, newRole: "ADMIN" | "USER") => {
    setErr(null);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role: newRole }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setErr(data?.error || "Error cambiando rol");
      return;
    }
    await cargar();
  };

  const resetPassword = async () => {
    if (!resetId || !resetPass) return;
    setErr(null);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: resetId, password: resetPass }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setErr(data?.error || "Error reseteando password");
      return;
    }
    setResetId(null);
    setResetPass("");
    await cargar();
  };

  return (
    <main style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div>
          <h1 style={{ margin: 0 }}>Admin · Usuarios</h1>
          <p style={{ color: "#666", marginTop: 6 }}>
            Crear usuarios, cambiar roles y resetear password (solo ADMIN)
          </p>
        </div>

        <a
          href="/"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            textDecoration: "none",
            color: "black",
            background: "white",
            height: 40,
            display: "flex",
            alignItems: "center",
          }}
        >
          ← Volver
        </a>
      </div>

      {err && <div style={{ color: "crimson", margin: "12px 0" }}>Error: {err}</div>}

      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16, maxWidth: 820, marginBottom: 20 }}>
        <h3>Crear usuario</h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 10, minWidth: 240 }}
          />
          <input
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: 10, minWidth: 200 }}
          />
          <select value={role} onChange={(e) => setRole(e.target.value as any)} style={{ padding: 10 }}>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <button
            onClick={crear}
            style={{ padding: "10px 14px", background: "black", color: "white", border: "none", borderRadius: 10 }}
          >
            Crear
          </button>
        </div>

        <div style={{ marginTop: 16, borderTop: "1px solid #eee", paddingTop: 16 }}>
          <h3>Reset password</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              placeholder="User ID"
              value={resetId ?? ""}
              onChange={(e) => setResetId(Number(e.target.value) || null)}
              style={{ padding: 10, width: 120 }}
            />
            <input
              placeholder="Nuevo password"
              value={resetPass}
              onChange={(e) => setResetPass(e.target.value)}
              style={{ padding: 10, minWidth: 220 }}
            />
            <button
              onClick={resetPassword}
              style={{ padding: "10px 14px", background: "black", color: "white", border: "none", borderRadius: 10 }}
            >
              Reset
            </button>
          </div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
            Tip: copiá el ID desde la lista de usuarios.
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 820 }}>
        <h3>Usuarios</h3>
        {users.map((u) => (
          <div
            key={u.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #eee",
              padding: 12,
              borderRadius: 12,
              marginBottom: 10,
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{u.email}</div>
              <div style={{ fontSize: 12, color: "#666" }}>id: {u.id} · role: {u.role}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => cambiarRol(u.id, "USER")} style={{ padding: "8px 10px" }}>
                USER
              </button>
              <button onClick={() => cambiarRol(u.id, "ADMIN")} style={{ padding: "8px 10px" }}>
                ADMIN
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
