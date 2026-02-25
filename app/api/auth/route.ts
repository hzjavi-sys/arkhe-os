import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim();
    const password = String(body?.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "email_y_password_requeridos" },
        { status: 400 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          password,
          role: "USER",
        },
      });
    }

    if (user.password !== password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role,
    });

  } catch (error) {
    console.error("AUTH ERROR:", error);
    return NextResponse.json(
      { error: "server_error" },
      { status: 500 }
    );
  }
}cat app/api/auth/route.ts
import { NextResponse } ...
cat app/api/auth/route.ts
cat app/api/auth/route.ts
cat prisma/schema.prisma
cat prisma/schema.prisma
