"use client";
import React from "react";

type UserRow = { id: number; username: string; role: string };

export default function UsersPage() {
  const [rows, setRows] = React.useState<UserRow[]>([]);
  const [username, setUsername] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [role, setRole] = React.useState("user");
  const [error, setError] = React.useState<string | null>(null);

  const cargar = async () => {
    setError(null);
    const res = await fetch("/api/users", { credentials: "include" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error || "Error");
      return;
    }
    setRows(Array.isArray(data) ? data : []);
  };

  React.useEffect(() => {
    cargar();
  }, []);

  const crear = async () => {
    setError(null);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, pass, role }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error || "Error");
      return;
    }
    setUsername("");
    setPass("");
    setRole("user");
    cargar();
  };

  return (
    <main style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>Usuarios (solo admin)</h1>

      {error && <div style={{ color: "crimson", marginBottom: 10 }}>{String(error)}</div>}

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="password" value={pass} onChange={(e) => setPass(e.target.value)} />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        <button onClick={crear}>Crear</button>
        <button onClick={cargar}>Actualizar</button>
      </div>

      <div>
        {rows.map((u) => (
          <div key={u.id} style={{ padding: 8, border: "1px solid #ddd", marginBottom: 6 }}>
            {u.username} — role: {u.role} — id: {u.id}
          </div>
        ))}
      </div>
    </main>
  );
}
