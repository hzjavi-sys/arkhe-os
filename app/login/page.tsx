"use client";

import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@arkhe.com");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function entrar() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await r.json().catch(() => null);
      if (!r.ok) {
        setError(data?.error || "Error");
        return;
      }

      // ✅ SIEMPRE al Home después de loguear
      window.location.href = "/home";
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight:"100vh",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      fontFamily:"system-ui, -apple-system, Segoe UI, Roboto, Arial",
      background:"linear-gradient(180deg,#eef2ff,#f8fafc,#fff)",
      padding: 18
    }}>
      <div style={{
        width: 420,
        borderRadius: 18,
        border:"1px solid rgba(15,23,42,0.10)",
        background:"rgba(255,255,255,0.92)",
        boxShadow:"0 18px 60px rgba(2,6,23,0.10)",
        padding: 18
      }}>
        <div style={{fontWeight:900, fontSize:22}}>BEACH</div>
        <div style={{color:"#64748b", fontWeight:700, marginTop:4}}>Ingresá para continuar</div>

        <div style={{marginTop:14}}>
          <div style={{fontWeight:800, marginBottom:6}}>Email</div>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} style={inp}/>
        </div>

        <div style={{marginTop:14}}>
          <div style={{fontWeight:800, marginBottom:6}}>Password</div>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} style={inp}/>
        </div>

        <button onClick={entrar} disabled={loading} style={btn}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {error && <div style={{color:"#b91c1c", fontWeight:800, marginTop:10}}>Error: {error}</div>}

        <div style={{marginTop:12, color:"#64748b", fontWeight:700, fontSize:12}}>
          Tip: rol (ADMIN/USER) determina permisos.
        </div>
      </div>
    </div>
  );
}

const inp: React.CSSProperties = {
  width:"100%",
  padding:"10px 12px",
  borderRadius: 12,
  border:"1px solid rgba(15,23,42,0.14)",
  outline:"none"
};

const btn: React.CSSProperties = {
  marginTop: 16,
  width:"100%",
  padding:"12px 14px",
  borderRadius: 12,
  border:"none",
  background:"#0f172a",
  color:"white",
  fontWeight:900,
  cursor:"pointer"
};
