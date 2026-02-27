import "./globals.css";

export const metadata = {
  title: "BEACH",
  description: "Sistema Operativo Cognitivo Universal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
