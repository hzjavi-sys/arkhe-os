import { NextResponse } from "next/server";

type Detalle = {
  nombre: string;
  categoria: string;
  descripcion: string;
  herramientas: string[];
  funciones: string[];
};

function norm(s: string) {
  return (s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // saca tildes
    .replace(/\s+/g, " ");
}

const CATALOGO_COMPLETO: Detalle[] = [
  {
    nombre: "Abogado",
    categoria: "Derecho",
    descripcion:
      "Asesora, redacta y revisa documentos legales. Evalúa riesgos, prepara estrategias y guía procesos (Uruguay u otros países según reglas).",
    herramientas: [
      "Checklist legal por tipo de trámite",
      "Plantillas (contratos, cartas documento, poderes)",
      "Matriz de riesgos (probabilidad/impacto)",
      "Registro de plazos y vencimientos",
      "Buscador de normativa y jurisprudencia (integración futura)",
    ],
    funciones: [
      "Diagnosticar caso (hechos, partes, objetivo, urgencias).",
      "Armar estrategia legal (opciones A/B/C con pros y contras).",
      "Redactar/revisar contratos y anexos (cláusulas clave).",
      "Preparar escritos y presentaciones (borradores).",
      "Gestionar plazos: vencimientos, audiencias, checklist de pruebas.",
      "Evaluar cumplimiento y riesgo (laboral, civil, comercial, penal, datos).",
    ],
  },

  {
    nombre: "Contador público",
    categoria: "Empresa / Finanzas",
    descripcion:
      "Ordena la contabilidad, calcula impuestos, arma balances y ayuda a tomar decisiones con números claros (caja, márgenes, costos y sueldos).",
    herramientas: [
      "Plan de cuentas (modelo)",
      "Plantillas de balance y resultados",
      "Conciliación bancaria",
      "Simulador de impuestos y flujo de caja",
      "Liquidación de sueldos (integración futura)",
    ],
    funciones: [
      "Calcular impuestos (estimación y control).",
      "Generar balance y estado de resultados.",
      "Simular flujo de caja y necesidades de financiamiento.",
      "Analizar margen por producto/servicio (costos fijos/variables).",
      "Controlar cumplimiento fiscal y detectar riesgo.",
      "Armar reportes mensuales simples para dirección.",
    ],
  },

  {
    nombre: "Médico",
    categoria: "Salud",
    descripcion:
      "Evalúa síntomas, ordena la información clínica, propone diagnósticos probables y guía un plan de acción (siempre como apoyo, no reemplazo).",
    herramientas: [
      "Ficha clínica estructurada",
      "Checklist de banderas rojas",
      "Guías clínicas (integración futura)",
      "Registro de medicación y alergias",
      "Seguimiento de evolución (línea de tiempo)",
    ],
    funciones: [
      "Triage: detectar urgencias y derivar.",
      "Armar hipótesis diagnóstica (probables/diferenciales).",
      "Sugerir estudios complementarios (según criterio clínico).",
      "Proponer plan de seguimiento y señales de alarma.",
      "Educar al paciente: pasos claros y prevención.",
    ],
  },

  {
    nombre: "Ingeniero en Informática o de Sistemas",
    categoria: "Tecnología",
    descripcion:
      "Diseña y construye software: arquitectura, datos, seguridad, despliegue y automatización (ideal para tu BEACH OS).",
    herramientas: [
      "Arquitectura (diagramas + checklist)",
      "Gestión de versiones (Git)",
      "CI/CD (deploy automático)",
      "Monitoreo y logs",
      "Seguridad (API keys, tenants, CORS, roles)",
    ],
    funciones: [
      "Definir arquitectura (módulos, datos, permisos, APIs).",
      "Diseñar base de datos y flujos.",
      "Implementar endpoints y UI por módulos.",
      "Automatizar deploy y backups.",
      "Revisar seguridad: auth, roles, auditoría.",
      "Optimizar performance y costos.",
    ],
  },

  {
    nombre: "Analista de estudio de Mercado. Marketing",
    categoria: "Marketing",
    descripcion:
      "Entiende clientes y mercado: posicionamiento, segmentación, campañas y medición para crecer con menos desperdicio.",
    herramientas: [
      "Embudo (Awareness→Compra→Retención)",
      "Calendario de campañas",
      "Tablero de métricas (CAC, LTV, conversión)",
      "Investigación de competencia",
      "Buyer persona + propuesta de valor",
    ],
    funciones: [
      "Definir público objetivo y segmentos.",
      "Diseñar propuesta de valor (mensaje claro).",
      "Crear plan de campañas (canales + contenido).",
      "Medir resultados y optimizar (A/B testing).",
      "Diseñar estrategia de retención (CRM, upsell).",
    ],
  },
];

function findByNombre(input: string) {
  const q = norm(input);
  return CATALOGO_COMPLETO.find((x) => norm(x.nombre) === q) || null;
}

// GET /api/inteligencias
// - sin query => listado de profesiones completas (por ahora 5)
// - con ?nombre=... => detalle de UNA profesión
export async function GET(req: Request) {
  const url = new URL(req.url);
  const nombre = url.searchParams.get("nombre");

  if (!nombre) {
    // listado
    return NextResponse.json({
      ok: true,
      totalCompletas: CATALOGO_COMPLETO.length,
      items: CATALOGO_COMPLETO.map((x) => ({
        nombre: x.nombre,
        categoria: x.categoria,
        descripcion: x.descripcion,
        completa: true,
      })),
    });
  }

  const found = findByNombre(nombre);
  if (!found) {
    return NextResponse.json({ error: "not_found", nombre }, { status: 404 });
  }

  return NextResponse.json({ ok: true, ...found });
}
