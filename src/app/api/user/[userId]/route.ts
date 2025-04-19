import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const userId = Number((await params).userId);

  const seats = await prisma.seat.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      row: true,
      column: true,
      room: {
        select: {
          name: true,
        },
      },
    },
  });

  return NextResponse.json(seats);
}
