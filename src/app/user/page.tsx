"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

type SeatInfo = {
  id: number;
  roomName: string;
  roomId: number;
  seats: { seatName: string }[];
};

type SelectedUser = User & { seats: SeatInfo[] };

export default function UserSearchPage() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);

  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      setSelectedUser(null);
      return;
    }
    const timeout = setTimeout(() => {
      fetch(`/api/user/search?query=${query}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
        });
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleUserClick = (user: User) => {
    fetch(`/api/user/${user.id}/seats`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedUser({ ...user, seats: data });
        setQuery(user.name);
      });
  };

  console.log("user", selectedUser);

  return (
    <div className="p-4 container">
      <input
        className="border p-2 w-full mb-2 outline-none border-amber-600 rounded-4xl px-5"
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedUser(null);
        }}
        placeholder="Search your seat by name"
      />
      {results.length > 0 && !selectedUser ? (
        <div className="border border-amber-200 px-5 py-2">
          {results.map((user) => (
            <div
              key={user.id}
              className="p-2 cursor-pointer border-b border-amber-100 hover:bg-gray-100"
              onClick={() => {
                handleUserClick(user);
              }}
            >
              {user.name} ({user.email})
            </div>
          ))}
        </div>
      ) : (
        <>
          {!selectedUser && query.length !== 0 && (
            <p className=" text-center text-2xl mt-5">User not found</p>
          )}
          {query.length === 0 && (
            <p className=" text-center text-2xl mt-5">Find your seat by name</p>
          )}
        </>
      )}
      {selectedUser && (
        <div className="mt-4">
          <h2 className="font-semibold text-lg">
            Allotted Seats for {selectedUser.name}:
          </h2>
          {selectedUser.seats.length > 0 ? (
            selectedUser.seats.map((seat: SeatInfo) => {
              console.log(seat.seats[0].seatName);

              return (
                <div
                  key={seat.id}
                  className="border p-2 mt-2 bg-amber-100 border-amber-300 rounded flex justify-between items-center"
                >
                  <div className="">
                    Room: <strong>{seat.roomName}</strong> | Seat:{" "}
                    <strong>{seat.seats[0].seatName}</strong>
                  </div>
                  <Link
                    className="bg-amber-300 px-4 py-2"
                    href={`/user/${seat.roomId}/${selectedUser.id}`}
                  >
                    View
                  </Link>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No seat allotted.</p>
          )}
        </div>
      )}
    </div>
  );
}
