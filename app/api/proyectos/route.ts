import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const proyectos = await prisma.proyecto.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(proyectos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const nuevo = await prisma.proyecto.create({
    data: { nombre: body.nombre },
  });
  return NextResponse.json(nuevo);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  await prisma.proyecto.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const actualizado = await prisma.proyecto.update({
    where: { id: body.id },
    data: { nombre: body.nombre },
  });

  return NextResponse.json(actualizado);
}
import { NextResponse }ifrom "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const proyectos = await prisma.proyecto.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(proyectos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const nuevo = await prisma.proyecto.create({
    data: { nombre: body.nombre },
  });
  return NextResponse.json(nuevo);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  await prisma.proyecto.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const actualizado = await prisma.proyecto.update({
    where: { id: body.id },
    data: { nombre: body.nombre },
  });

  return NextResponse.json(actualizado);
}
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const proyectos = await prisma.proyecto.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(proyectos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const nuevo = await prisma.proyecto.create({
    data: { nombre: body.nombre },
  });
  return NextResponse.json(nuevo);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  await prisma.proyecto.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const actualizado = await prisma.proyecto.update({
    where: { id: body.id },
    data: { nombre: body.nombre },
  });

  return NextResponse.json(actualizado);
}import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const proyectos = await prisma.proyecto.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(proyectos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const nuevo = await prisma.proyecto.create({
    data: { nombre: body.nombre },
  });
  return NextResponse.json(nuevo);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  await prisma.proyecto.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const actualizado = await prisma.proyecto.update({
    where: { id: body.id },
    data: { nombre: body.nombre },
  });

  return NextResponse.json(actualizado);
}      




import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const proyectos = await prisma.proyecto.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(proyectos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const nuevo = await prisma.proyecto.create({
    data: { nombre: body.nombre },
  });
  return NextResponse.json(nuevo);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  await prisma.proyecto.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const actualizado = await prisma.proyecto.update({
    where: { id: body.id },
    data: { nombre: body.nombre },
  });

  return NextResponse.json(actualizado);
}import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const proyectos = await prisma.proyecto.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(proyectos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const nuevo = await prisma.proyecto.create({
    data: { nombre: body.nombre },
  });
  return NextResponse.json(nuevo);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  await prisma.proyecto.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const actualizado = await prisma.proyecto.update({
    where: { id: body.id },
    data: { nombre: body.nombre },
  });

  return NextResponse.json(actualizado);
}import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const proyectos = await prisma.proyecto.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(proyectos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const nuevo = await prisma.proyecto.create({
    data: { nombre: body.nombre },
  });
  return NextResponse.json(nuevo);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  await prisma.proyecto.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const actualizado = await prisma.proyecto.update({
    where: { id: body.id },
    data: { nombre: body.nombre },
  });

  return NextResponse.json(actualizado);
}import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const proyectos = await prisma.proyecto.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(proyectos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const nuevo = await prisma.proyecto.create({
    data: { nombre: body.nombre },
  });
  return NextResponse.json(nuevo);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  await prisma.proyecto.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const actualizado = await prisma.proyecto.update({
    where: { id: body.id },
    data: { nombre: body.nombre },
  });

  return NextResponse.json(actualizado);
}import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const proyectos = await prisma.proyecto.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(proyectos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const nuevo = await prisma.proyecto.create({
    data: { nombre: body.nombre },
  });
  return NextResponse.json(nuevo);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  await prisma.proyecto.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const actualizado = await prisma.proyecto.update({
    where: { id: body.id },
    data: { nombre: body.nombre },
  });

  return NextResponse.json(actualizado);
}import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const proyectos = await prisma.proyecto.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(proyectos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const nuevo = await prisma.proyecto.create({
    data: { nombre: body.nombre },
  });
  return NextResponse.json(nuevo);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  await prisma.proyecto.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const actualizado = await prisma.proyecto.update({
    where: { id: body.id },
    data: { nombre: body.nombre },
  });

  return NextResponse.json(actualizado);
}import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const proyectos = await prisma.proyecto.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(proyectos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const nuevo = await prisma.proyecto.create({
    data: { nombre: body.nombre },
  });
  return NextResponse.json(nuevo);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  await prisma.proyecto.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const actualizado = await prisma.proyecto.update({
    where: { id: body.id },
    data: { nombre: body.nombre },
  });

  return NextResponse.json(actualizado);
}import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const proyectos = await prisma.proyecto.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(proyectos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const nuevo = await prisma.proyecto.create({
    data: { nombre: body.nombre },
  });
  return NextResponse.json(nuevo);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  await prisma.proyecto.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const actualizado = await prisma.proyecto.update({
    where: { id: body.id },
    data: { nombre: body.nombre },
  });

  return NextResponse.json(actualizado);
}import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const proyectos = await prisma.proyecto.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(proyectos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const nuevo = await prisma.proyecto.create({
    data: { nombre: body.nombre },
  });
  return NextResponse.json(nuevo);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  await prisma.proyecto.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const actualizado = await prisma.proyecto.update({
    where: { id: body.id },
    data: { nombre: body.nombre },
  });

