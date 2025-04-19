import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; // Adjust this import if needed

// GET handler for the dashboard data
export async function GET() {
  try {
    // Fetch data from the database
    const usersData = await prisma.user.findMany();
    const roomsData = await prisma.room.findMany();
    const seatsData = await prisma.seat.findMany();

    // Respond with consolidated data
    return NextResponse.json({
      usersData,
      roomsData,
      seatsData,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
