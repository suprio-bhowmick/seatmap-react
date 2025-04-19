import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ roomId: string }> }) {
  const roomId = Number((await params).roomId);

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      seats: true,
    },
  });

  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  const seatMap = room.seats.map((seat) => ({
    id: seat.id,
    row: seat.row,
    column: seat.column,
    status: seat.status,
    userId: seat.userId,
    isAllocated: seat.userId !== null,
  }));

  return NextResponse.json(seatMap);
}
