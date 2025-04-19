import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function PUT(
  req: Request,
  { params }: { params:Promise< { seatId: string }> }
) {
  try {
    const body = await req.json();
    const seatId = parseInt((await params).seatId, 10);
    const userId = parseInt(body.userId, 10);
    const status = body.status

    console.log(body);

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
