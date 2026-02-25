export type Proyecto = {
  id: number;
  nombre: string;
  createdAt: string;
};

async function mustJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Respuesta no-JSON (${res.status}): ${text.slice(0, 120)}`);
  }
}

function ensureArray(data: any, status: number) {
  if (Array.isArray(data)) return data;
  const msg = data?.error ? String(data.error) : "Respuesta inválida";
  throw new Error(`${msg} (${status})`);
}

export async function apiGetProyectos(): Promise<Proyecto[]> {
  const res = await fetch("/api/proyectos", {
    cache: "no-store",
    credentials: "include",
  });
  const data = await mustJson(res).catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error ? String(data.error) : `GET /api/proyectos falló`;
    throw new Error(`${msg} (${res.status})`);
  }
  return ensureArray(data, res.status);
}

export async function apiCreateProyecto(nombre: string): Promise<void> {
  const res = await fetch("/api/proyectos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre }),
    credentials: "include",
  });
  const data = await mustJson(res).catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error ? String(data.error) : `POST /api/proyectos falló`;
    throw new Error(`${msg} (${res.status})`);
  }
}

export async function apiUpdateProyecto(id: number, nombre: string): Promise<void> {
  const res = await fetch("/api/proyectos", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, nombre }),
    credentials: "include",
  });
  const data = await mustJson(res).catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error ? String(data.error) : `PATCH /api/proyectos falló`;
    throw new Error(`${msg} (${res.status})`);
  }
}

export async function apiDeleteProyecto(id: number): Promise<void> {
  const res = await fetch(`/api/proyectos?id=${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await mustJson(res).catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error ? String(data.error) : `DELETE /api/proyectos falló`;
    throw new Error(`${msg} (${res.status})`);
  }
}
