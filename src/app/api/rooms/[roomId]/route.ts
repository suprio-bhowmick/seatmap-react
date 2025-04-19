import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(req: Request, { params }: { params: Promise<{ roomId: string }> }) {
  const roomId =  parseInt( (await params).roomId, 10);

  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        seats: true,  
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ room, seats: room.seats });
  } catch (error) {
    console.error("Error fetching room and seats:", error);
    return NextResponse.json({ error: "Failed to fetch room and seats" }, { status: 500 });
  }
}
