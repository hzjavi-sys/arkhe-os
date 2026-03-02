"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SECTIONS: Record<string, { label: string; href: string }[]> = {
  inteligencias: [
    { label: "Profesionales", href: "/inteligencias" },
    { label: "Legal", href: "/inteligencias/legal" },
    { label: "IA", href: "/inteligencias/ia" },
    { label: "Agente", href: "/inteligencias/agente" },
    { label: "Lenguajes", href: "/inteligencias/lenguajes" },
  ],
  proyectos: [
    { label: "Listado", href: "/proyectos" },
    { label: "Nuevo Proyecto", href: "/proyectos/nuevo" },
  ],
};

export default function SystemLayout({
  section,
  children,
}: {
  section: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const submenu = SECTIONS[section] || [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* HEADER GLOBAL */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-zinc-900 border-b border-zinc-800 flex items-center px-6 z-50">
        <div className="font-bold text-lg tracking-wide">BEACH OS</div>
        <div className="ml-10 flex gap-6 text-sm text-zinc-400">
          <Link href="/home" className="hover:text-white">Home</Link>
          <Link href="/inteligencias" className="hover:text-white">Inteligencias</Link>
          <Link href="/proyectos" className="hover:text-white">Proyectos</Link>
        </div>
      </div>

      {/* SUBMENU DINÁMICO */}
      {submenu.length > 0 && (
        <div className="fixed top-14 left-0 right-0 h-12 bg-zinc-900/80 backdrop-blur border-b border-zinc-800 flex items-center px-6 gap-6 text-sm z-40">
          {submenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname === item.href
                  ? "text-white font-semibold"
                  : "text-zinc-400 hover:text-white"
              }
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* CONTENIDO */}
      <div className="pt-28 px-8">
        {children}
      </div>

    </div>
  );
}
