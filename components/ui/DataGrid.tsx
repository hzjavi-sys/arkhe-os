"use client";

import React, { useMemo, useState } from "react";

export type Col<T> = {
  key: string;
  header: string;
  width?: number;
  render: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
  searchValue?: (row: T) => string;
};

export default function DataGrid<T>({
  title,
  rows,
  columns,
  initialPageSize = 10,
  rightHeader,
}: {
  title: string;
  rows: T[];
  columns: Col<T>[];
  initialPageSize?: number;
  rightHeader?: React.ReactNode;
}) {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const pageSize = initialPageSize;

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return rows;
    return rows.filter((r) =>
      columns.some((c) => (c.searchValue ? c.searchValue(r) : String(c.render(r))).toLowerCase().includes(qq))
    );
  }, [rows, q, columns]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return filtered;
    const getter = col.sortValue ?? ((r: any) => String(col.render(r)));
    const copy = [...filtered].sort((a, b) => {
      const av = getter(a);
      const bv = getter(b);
      if (av < bv) return -1;
      if (av > bv) return 1;
      return 0;
    });
    return sortDir === "asc" ? copy : copy.reverse();
  }, [filtered, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  function toggleSort(k: string) {
    if (sortKey !== k) {
      setSortKey(k);
      setSortDir("asc");
      setPage(1);
      return;
    }
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <div style={{ fontWeight: 900, fontSize: 14, opacity: 0.9 }}>{title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {rightHeader}
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar…"
            style={{
              width: 260,
              padding: "10px 12px",
              borderRadius: 12,
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.10)",
              color: "#e5e7eb",
              outline: "none",
            }}
          />
        </div>
      </div>

      <div style={{ border: "1px solid rgba(255,255,255,.10)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ background: "rgba(255,255,255,.03)", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ display: "grid", gridTemplateColumns: columns.map((c) => (c.width ? `${c.width}px` : "1fr")).join(" "), gap: 0 }}>
            {columns.map((c) => (
              <button
                key={c.key}
                onClick={() => toggleSort(c.key)}
                style={{
                  textAlign: "left",
                  padding: "12px 12px",
                  border: "none",
                  background: "transparent",
                  color: "rgba(255,255,255,.9)",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {c.header}{" "}
                {sortKey === c.key ? (
                  <span style={{ opacity: 0.75 }}>{sortDir === "asc" ? "▲" : "▼"}</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <div>
          {pageRows.length === 0 ? (
            <div style={{ padding: 14, opacity: 0.8 }}>Sin datos.</div>
          ) : (
            pageRows.map((r, idx) => (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: columns.map((c) => (c.width ? `${c.width}px` : "1fr")).join(" "),
                  borderBottom: "1px solid rgba(255,255,255,.06)",
                }}
              >
                {columns.map((c) => (
                  <div key={c.key} style={{ padding: "12px 12px", color: "rgba(255,255,255,.92)" }}>
                    {c.render(r)}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 12 }}>
          <div style={{ opacity: 0.75, fontSize: 12 }}>
            Página {safePage} de {totalPages} · {sorted.length} resultados
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setPage(1)}
              disabled={safePage === 1}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,.10)",
                background: safePage === 1 ? "rgba(255,255,255,.03)" : "rgba(255,255,255,.06)",
                color: "rgba(255,255,255,.9)",
                cursor: safePage === 1 ? "not-allowed" : "pointer",
              }}
            >
              {"<<"}
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,.10)",
                background: safePage === 1 ? "rgba(255,255,255,.03)" : "rgba(255,255,255,.06)",
                color: "rgba(255,255,255,.9)",
                cursor: safePage === 1 ? "not-allowed" : "pointer",
              }}
            >
              {"<"}
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,.10)",
                background: safePage === totalPages ? "rgba(255,255,255,.03)" : "rgba(255,255,255,.06)",
                color: "rgba(255,255,255,.9)",
                cursor: safePage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              {">"}
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={safePage === totalPages}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,.10)",
                background: safePage === totalPages ? "rgba(255,255,255,.03)" : "rgba(255,255,255,.06)",
                color: "rgba(255,255,255,.9)",
                cursor: safePage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              {">>"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
