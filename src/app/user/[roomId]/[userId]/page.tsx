"use client";

import { useEffect, useState } from "react";
import { AutoSizer, Grid } from "react-virtualized";
import { useParams } from "next/navigation";

type Seat = {
  id: number;
  row: number;
  column: number;
  status: string; // "available", "booked", etc.
  userId?: string;
};

type Room = {
  id: number;
  name: string;
  row: number;
  column: number;
};

const seatWidth = 30;
const seatHeight = 30;
const gap = 50;

const SeatMapPage = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const { roomId, userId } = useParams<{ roomId: string; userId: string }>();

  useEffect(() => {
    const fetchRoomData = async () => {
      const res = await fetch(`/api/rooms/${roomId}`);
      const data = await res.json();
      setRoom(data.room);
      setSeats(data.seats);
    };
    fetchRoomData();
  }, [roomId]);

  const Cell = ({
    columnIndex,
    rowIndex,
    style,
  }: {
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
  }) => {
    const seat = seats.find(
      (s) => s.row === rowIndex + 1 && s.column === columnIndex + 1
    );

    const bgColor =
      seat?.userId == userId
        ? "bg-yellow-500 hover:bg-yellow-600 cursor-pointer"
        : seat?.status === "available"
        ? "bg-green-500 hover:bg-green-600 cursor-pointer"
        : seat?.status === "blank"
        ? "bg-gray-500 hover:bg-gray-600 cursor-pointer"
        : "bg-blue-500 hover:bg-blue-600 cursor-pointer";

    return (
      <div
        className={`rounded-md shadow-sm font-medium text-gray-800 flex items-center justify-center transition-all ${bgColor}`}
        style={{
          ...style,
          width: seatWidth,
          height: seatHeight,
          margin: gap / 2,
        }}
      >
        <span className="text-[12px] text-white">
          {rowIndex + 1}/{columnIndex + 1}
        </span>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-sky-700 mb-6">
          Room : {room?.name}
        </h1>
        <ul className="flex gap-10">
          <li className="flex items-center gap-2 text-sm">
            <span className="w-4 h-4 bg-yellow-600 inline-block" /> Your Seat
          </li>
          <li className="flex items-center gap-2 text-sm">
            <span className="w-4 h-4 bg-green-600 inline-block" /> Available
          </li>
          <li className="flex items-center gap-2 text-sm">
            <span className="w-4 h-4 bg-blue-600 inline-block" /> Alloted
          </li>
          <li className="flex items-center gap-2 text-sm">
            <span className="w-4 h-4 bg-gray-600 inline-block" /> Blank (Not
            Available)
          </li>
        </ul>
      </div>

      <div
        className="border border-gray-200 rounded-lg overflow-hidden shadow"
        style={{ height: "80vh" }}
      >
        {room && seats.length > 0 ? (
          <AutoSizer>
            {({ width, height }: { width: number; height: number }) => (
              <Grid
                columnCount={room.column}
                rowCount={room.row}
                columnWidth={() => seatWidth + 5}
                rowHeight={() => seatHeight + 5}
                width={width}
                height={height}
                cellRenderer={Cell}
              />
            )}
          </AutoSizer>
        ) : (
          <div className="p-4 text-center text-gray-500">
            Loading seat map...
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatMapPage;
