"use client"; // Ensure this component is treated as a client component
import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { withAuth } from "@/lib/withAuth";
ChartJS.register(ArcElement, Tooltip, Legend);

type Seat = {
  id: number;
  status: string;
  userId?: number | null;
  row: number;
  column: number;
};

const DashboardPage = () => {
  const [seatStats, setSeatStats] = useState({
    available: 0,
    booked: 0,
    blank: 0,
  });

  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [seats, setSeats] = useState<Seat[]>([]); // Add the Seat type here

  useEffect(() => {
    // Fetch consolidated data from a single API endpoint
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();

        // Destructure data to get users, rooms, and seats
        const { usersData, roomsData, seatsData } = data;

        // Set state with fetched data
        setUsers(usersData);
        setRooms(roomsData);
        setSeats(seatsData);

        // Calculate seat status distribution
        const available = seatsData.filter(
          (seat: Seat) => seat.status === "available"
        ).length;
        const booked = seatsData.filter(
          (seat: Seat) => seat.status === "booked"
        ).length;
        const blank = seatsData.filter(
          (seat: Seat) => seat.status === "blank"
        ).length;
        setSeatStats({ available, booked, blank });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const totalUsers = users.length;
  const totalRooms = rooms.length;
  const totalSeatsBooked = seats.filter(
    (seat: Seat) => seat.userId !== null
  ).length;

  const seatChartData = {
    labels: ["Available", "Booked", "Blank"],
    datasets: [
      {
        data: [seatStats.available, seatStats.booked, seatStats.blank],
        backgroundColor: ["#4CAF50", "#2196F3", "#BDBDBD"],
        hoverBackgroundColor: ["#388E3C", "#1976D2", "#757575"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Topbar */}
      
      <div className="container">
        <div className="py-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Total Users" value={totalUsers} />
            <Card title="Rooms" value={totalRooms} />
            <Card title="Seats Booked" value={totalSeatsBooked} />
          </div>

          {/* Seat Status Chart */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4 text-sky-700">
              Seat Status
            </h3>
            <div className="bg-white p-6 rounded shadow w-full h-[400px] flex justify-center">
              <Pie data={seatChartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-white p-6 rounded shadow text-center">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <p className="text-2xl text-sky-700 font-bold">{value}</p>
  </div>
);

export default withAuth(DashboardPage);
