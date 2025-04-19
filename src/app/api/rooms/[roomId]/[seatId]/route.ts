import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function PUT(
  req: Request,
  { params }: { params: Promise< { seatId: string; roomId: string }> }
) {
  try {
    const body = await req.json();
    const seatId = parseInt((await params).roomId, 10);
    const { status, userId } = body;

    const updatedSeat = await prisma.seat.update({
      where: { id: seatId },
      data: { status, userId },
    });

    return NextResponse.json({
      message: "Seat updated successfully",
      seat: updatedSeat,
    });
  } catch (error) {
    console.error("Error updating seat:", error);
    return NextResponse.json(
      { error: "Failed to update seat" },
      { status: 500 }
    );
  }
}
