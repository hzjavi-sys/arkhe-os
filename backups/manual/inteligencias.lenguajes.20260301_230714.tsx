"use client";

import AppShell from "@/components/arkhe/AppShell";

export default function LenguajesPage() {
  return (
    <AppShell title="Lenguajes de Programación">
      <div className="space-y-8">

        <Section
          title="Lenguajes Multiuso"
          items={[
            "C – Sistemas operativos, drivers",
            "C++ – Videojuegos AAA, alto rendimiento",
            "C# – Apps Windows, Unity",
            "Java – Sistemas empresariales, Android",
            "Python – IA, automatización, backend",
            "Go – Servidores rápidos",
            "Rust – Sistemas modernos seguros",
            "Kotlin – Android moderno",
            "Swift – iOS / macOS",
            "Dart – Apps multiplataforma (Flutter)"
          ]}
        />

        <Section
          title="Web"
          items={[
            "Frontend: HTML, CSS, JavaScript, TypeScript",
            "Frameworks: React, Next.js, Vue, Angular, Svelte",
            "Backend: Node.js, Python, PHP, Ruby, Java, Go, Rust, .NET"
          ]}
        />

        <Section
          title="Aplicaciones Móviles"
          items={[
            "Android: Kotlin, Java",
            "iOS: Swift",
            "Multiplataforma: Flutter, React Native"
          ]}
        />

        <Section
          title="Videojuegos"
          items={[
            "C++ – Unreal Engine",
            "C# – Unity",
            "GDScript – Godot",
            "Lua – Juegos ligeros"
          ]}
        />

        <Section
          title="Inteligencia Artificial"
          items={[
            "Python – TensorFlow, PyTorch",
            "R – Estadística",
            "Julia – Ciencia avanzada",
            "C++ – Alto rendimiento"
          ]}
        />

        <Section
          title="Especializados"
          items={[
            "Solidity – Blockchain",
            "COBOL – Bancos antiguos",
            "Fortran – Ciencia pesada",
            "Elixir / Erlang – Tiempo real",
            "Zig / Nim – Sistemas modernos"
          ]}
        />

      </div>
    </AppShell>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <ul className="space-y-2 text-sm opacity-80">
        {items.map((i, idx) => (
          <li key={idx}>• {i}</li>
        ))}
      </ul>
    </div>
  );
}
