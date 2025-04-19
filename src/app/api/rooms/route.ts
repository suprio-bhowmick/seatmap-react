import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET request to fetch all rooms
export async function GET() {
  try {
    const rooms = await prisma.room.findMany();
    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}

// POST request to create a new room with seats
export async function POST(req: Request) {
  try {
    const { name, row, column } = await req.json();

    if (!name || !row || !column) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Step 1: Create the room
    const newRoom = await prisma.room.create({
      data: {
        name,
        row,
        column,
      },
    });

    // Step 2: Create seats for the room (row * column)
    const seats = [];
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        seats.push({
          roomId: newRoom.id,
          row: i + 1,
          column: j + 1,
          status: "available", // Default status for the seat
        });
      }
    }

    // Step 3: Bulk create seats
    await prisma.seat.createMany({
      data: seats,
    });

    // Return the newly created room with seats
    return NextResponse.json(newRoom);
  } catch (error) {
    console.error("Error creating room and seats:", error);
    return NextResponse.json({ error: "Failed to create room and seats" }, { status: 500 });
  }
}
