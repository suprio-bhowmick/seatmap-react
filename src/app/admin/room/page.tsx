"use client";
import Modal from "@/components/Modal";
import { withAuth } from "@/lib/withAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

type Room = {
  name: string;
  row: number;
  column: number;
};

type RoomList = {
  id: number;
  name: string;
  row: number;
  column: number;
};

const RoomPage = () => {
  const router = useRouter();
  const [rooms, setRooms] = useState<RoomList[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [room, setRoom] = useState<Room>({ name: "", row: 0, column: 0 });

  const fetchRooms = async () => {
    setLoading(true);
    const res = await fetch("/api/rooms");
    const data = await res.json();
    setRooms(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoom({ ...room, [name]: name === "name" ? value : Number(value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(room),
    });

    if (!res.ok) {
      const errorText = await res.text(); // raw error message
      console.error("Failed to create room:", errorText);
      alert("Failed to create room. Check console for details.");
      return;
    }

    const data = await res.json(); // only call this when response is okay
    router.push(`/admin/room/${data.id}`);
  };

  return (
    <div className="container my-5">
      <div className="flex justify-between mb-3">
        <h2 className="text-2xl font-bold text-sky-600">Room List</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-sky-600 text-white px-5 py-2 rounded"
        >
          Add New Room
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-sky-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
              #
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
              Room Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
              Row
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
              Column
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-sm">
                Loading...
              </td>
            </tr>
          ) : rooms && rooms.length > 0 ? (
            rooms.map((room, index) => (
              <tr key={room.id}>
                <td className="px-6 py-4 text-sm">{index + 1}</td>
                <td className="px-6 py-4 text-sm">{room.name}</td>
                <td className="px-6 py-4 text-sm">{room.row}</td>
                <td className="px-6 py-4 text-sm">{room.column}</td>
                <td className="px-6 py-4 text-sm">
                  {" "}
                  <Link
                    className="px-5 py-2 bg-sky-600 rounded text-white"
                    href={`/admin/room/${room.id}`}
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4 text-sm">
                No rooms found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal
        title="Add New Room"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Room Name"
            className="border border-sky-600 outline-0 w-full px-3 py-2 rounded my-2"
            onChange={handleInput}
            required
          />
          <input
            type="number"
            name="row"
            placeholder="Total Rows"
            className="border border-sky-600 outline-0 w-full px-3 py-2 rounded my-2"
            onChange={handleInput}
            required
          />
          <input
            type="number"
            name="column"
            placeholder="Total Columns"
            className="border border-sky-600 outline-0 w-full px-3 py-2 rounded my-2"
            onChange={handleInput}
            required
          />
          <input
            type="submit"
            value="Create Room"
            className="bg-sky-600 text-white px-3 py-2 w-full rounded my-2 cursor-pointer"
          />
        </form>
      </Modal>
    </div>
  );
};

export default withAuth(RoomPage);
