import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Room, Seat } from "@prisma/client";

type RoomWithSeats = Room & {
  seats: Seat[];
};

export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const userId = Number((await params).userId);

  const userRooms = await prisma.room.findMany({
    where: {
      seats: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      seats: true,
    },
  });

  if (!userRooms.length) {
    return NextResponse.json({ error: "No rooms found for this user" }, { status: 404 });
  }

  const roomAllocations = userRooms.map((room: RoomWithSeats) => ({
    roomName: room.name,
    roomId: room.id,
    seats: room.seats
      .filter((seat: Seat) => seat.userId === userId)
      .map((seat: Seat) => ({
        seatName: `${seat.row}/${seat.column}`,
      })),
  }));

  return NextResponse.json(roomAllocations);
}
