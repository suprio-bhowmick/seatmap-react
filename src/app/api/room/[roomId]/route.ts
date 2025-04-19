import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const roomId = Number((await params).roomId);
  const room = await prisma.room.findUnique({
    where: { id: Number(roomId)},
    include: { seats: true },
  });

  if (!room)
    return NextResponse.json(
      { error: "Unable to fetch room" },
      { status: 404 }
    );

  return NextResponse.json(room);
}
