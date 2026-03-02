export type IntelTabId = "profesiones" | "legal" | "ia" | "agente" | "lenguajes";
export const INTEL_TABS: { id: IntelTabId; label: string; href: string; icon: string }[] = [
  { id: "profesiones", label: "Profesiones", href: "/inteligencias", icon: "👥" },
  { id: "legal", label: "Legislación", href: "/inteligencias/legal", icon: "📜" },
  { id: "ia", label: "IA Central", href: "/inteligencias/ia", icon: "🤖" },
  { id: "agente", label: "Agente", href: "/inteligencias/agente", icon: "🧠" },
  { id: "lenguajes", label: "Lenguajes", href: "/inteligencias/lenguajes", icon: "💻" },
];
