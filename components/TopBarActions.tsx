"use client";

export default function TopBarActions() {
  return (
    <div className="flex gap-2">
      <button className="rounded-xl border bg-white px-3 py-2 text-sm hover:bg-gray-50">
        🎙️ Voz
      </button>
      <button className="rounded-xl border bg-white px-3 py-2 text-sm hover:bg-gray-50">
        ❓ Explicame
      </button>
      <button
        className="rounded-xl border bg-white px-3 py-2 text-sm hover:bg-gray-50"
        onClick={async () => {
          await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
          window.location.href = "/login";
        }}
      >
        🚪 Salir
      </button>
    </div>
  );
}
