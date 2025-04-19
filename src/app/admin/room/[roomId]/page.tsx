"use client";

import { useEffect, useState } from "react";
import { AutoSizer, Grid } from "react-virtualized";
import { useParams } from "next/navigation";
import { withAuth } from "@/lib/withAuth";

type Seat = {
  id: number;
  row: number;
  column: number;
  status: string; // "available", "booked", etc.
  userId?: string; // Store userId if seat is booked
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
type allUsersType = {
  id: number;
  name: string;
  email: string;
};
const SeatMapPage = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [users, setUsers] = useState<allUsersType[] | null>(null); // Add users state
  const [popup, setPopup] = useState<{
    seatId: number;
    open: boolean;
    status: string;
    userId: number | null;
  } | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>("#");
  const [error, setError] = useState<string | null>(null);
  const { roomId } = useParams<{ roomId: string }>();

  useEffect(() => {
    const fetchRoomData = async () => {
      const res = await fetch(`/api/rooms/${roomId}`);
      const data = await res.json();
      setRoom(data.room);
      setSeats(data.seats);
      // Assuming your backend sends users
    };
    fetchRoomData();
  }, [roomId]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/user");
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handlePopupToggle = (
    seatId: number,
    status: string,
    userId: number
  ) => {
    setPopup((prev) =>
      prev?.seatId === seatId && prev.open
        ? null
        : { seatId, status, open: true, userId }
    );
  };

  useEffect(() => {
    if (popup?.userId) {
      setSelectedUser(String(popup.userId));
    } else {
      setSelectedUser("#");
    }
  }, [popup]);


  const handleAllot = async (status: string) => {
    if (status === "alloted" && selectedUser === "#") {
      setError("Please select a user");
      return;
    }

    // Update seat status to "allotted"
    const updatedSeats = seats.map((seat) =>
      seat.id === popup?.seatId
        ? { ...seat, status, userId: selectedUser }
        : seat
    );
    setSeats(updatedSeats);
    

    // Call your API to update the seat status in the database
    await fetch(`/api/seat/${popup?.seatId}`, {
      method: "PUT",
      body: JSON.stringify({
        userId: status === "blank" ? null : selectedUser,
        status: status,
      }),
    });

    setPopup(null);
    setSelectedUser("#");
  };

  const handleRemove = async () => {
    // Remove user from seat
    const updatedSeats = seats.map((seat) =>
      seat.id === popup?.seatId
        ? { ...seat, status: "available", userId: undefined }
        : seat
    );
    setSeats(updatedSeats);

    // Call your API to update the seat status in the database
    await fetch(`/api/seat/${popup?.seatId}`, {
      method: "PUT",
      body: JSON.stringify({ userId: null, status: "available" }),
    });

    setPopup(null);
    setSelectedUser("#");
  };

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
      seat?.status === "available"
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
        onClick={() =>
          seat?.status &&
          handlePopupToggle(seat.id, seat.status, Number(seat.userId))
        }
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
            <span className="w-4 h-4 bg-green-600 inline-block"> </span>{" "}
            Available
          </li>
          <li className="flex items-center gap-2 text-sm">
            <span className="w-4 h-4 bg-blue-600 inline-block"> </span> Alloted
          </li>
          <li className="flex items-center gap-2 text-sm">
            <span className="w-4 h-4 bg-gray-600 inline-block"> </span> Blank
            (Not Available)
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

      {/* Popup */}
      {popup && (
        <div className="fixed top-0 left-0 z-20 w-full h-full bg-[#000000c9] bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-bold mb-4">Select User for Seat</h3>
            <select
              disabled={popup?.status === "alloted"}
              className="w-full p-2 border rounded mb-4"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="#">Select a user</option>
              {users?.map((user) => (
                <option
                  key={user.id}
                  selected={popup?.userId === user.id}
                  value={user.id}
                >
                  {user.name}
                </option>
              ))}
            </select>
            <p className="text-red-800">{error}</p>
            <div className="flex justify-between space-x-2">
              {seats.find((seat) => seat.id === popup.seatId)?.status ===
              "alloted" ? (
                <button
                  className="w-1/3 bg-red-500 text-white p-2 rounded-md"
                  onClick={handleRemove}
                >
                  Remove User
                </button>
              ) : (
                <button
                  className="w-1/3 bg-blue-500 text-white p-2 rounded-md"
                  onClick={() => handleAllot("alloted")}
                  disabled={!selectedUser}
                >
                  Allot Now
                </button>
              )}
              <button
                className="w-1/3 bg-gray-500 text-white p-2 rounded-md"
                onClick={() => handleAllot("blank")}
              >
                Blank
              </button>
              <button
                className="w-1/3 bg-rose-500 text-white p-2 rounded-md"
                onClick={() => setPopup(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(SeatMapPage);
