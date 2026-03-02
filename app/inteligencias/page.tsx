"use client";
import { useEffect, useState } from "react";

export default function InteligenciasPage() {
  const [lista, setLista] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/inteligencias")
      .then((r) => r.json())
      .then((d) => setLista(Array.isArray(d) ? d : []));
  }, []);

  return (
    <h1 className="text-2xl font-bold mb-6">Profesionales</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lista.map((p) => (
          <div
            key={p.slug}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 transition"
          >
            <div className="font-semibold">{p.nombre}</div>
            <div className="text-xs text-zinc-500 mt-1">{p.categoria}</div>
          </div>
        ))}
      </div>
);
}
