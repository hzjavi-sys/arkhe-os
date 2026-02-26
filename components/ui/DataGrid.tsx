"use client";

import React from "react";

type Col<T> = {
  key: string;
  header: string;
  width?: number;
  render?: (row: T) => React.ReactNode;
};

export default function DataGrid<T extends Record<string, any>>({
  title,
  rows,
  columns,
  loading,
}: {
  title?: string;
  rows: T[];
  columns: Col<T>[];
  loading?: boolean;
}) {
  return (
    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden" }}>
      {title ? (
        <div style={{ padding: 12, fontWeight: 900, borderBottom: "1px solid #e5e7eb" }}>{title}</div>
      ) : null}

      <div style={{ width: "100%", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb", textAlign: "left" }}>
              {columns.map((c) => (
                <th
                  key={c.key}
                  style={{
                    padding: "10px 12px",
                    borderBottom: "1px solid #e5e7eb",
                    fontWeight: 900,
                    whiteSpace: "nowrap",
                    width: c.width,
                  }}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 12, color: "#6b7280" }}>
                  Cargando...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 12, color: "#6b7280" }}>
                  Sin datos.
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  {columns.map((c) => (
                    <td key={c.key} style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                      {c.render ? c.render(r) : String(r[c.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
