"use client";
import Modal from "@/components/Modal";
import { withAuth } from "@/lib/withAuth";
import React, { useEffect, useState } from "react";
type SingleUser = {
  name: string;
  email: string;
};

type allUsersType = {
  id: number;
  name: string;
  email: string;
};
const Page  = () => {
  const initialSingleUser = { name: "", email: "" };
  const [singleUser, setSingleUser] = useState<SingleUser>(initialSingleUser);
  const [allUsers, setAllUsers] = useState<allUsersType[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAllUserLoading, setIsAllUserLoading] = useState<boolean>(false);

  const fetchUsers = async () => {
    setIsAllUserLoading(false);
    const res = await fetch("/api/user");
    const data = await res.json();
    setAllUsers(data);
    setIsAllUserLoading(true);
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  console.log(allUsers);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSingleUser({
      ...singleUser,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(singleUser),
    });
    fetchUsers();
    setIsModalOpen(false);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="container my-3">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl text-sky-600  font-bold">User Data</h2>
        <button
          className="bg-sky-600 text-white px-5 py-2 rounded cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          Add New User
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-sky-600 text-white">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider"
            >
              #
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider"
            >
              Full Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider"
            >
              Email Address
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isAllUserLoading ? (
            allUsers && allUsers.length > 0 ? (
              allUsers.map((user, index) => (
                <tr
                  key={user.id || index}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No Data Found
                </td>
              </tr>
            )
          ) : (
            <tr>
              <td
                colSpan={3}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                Loading users...
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Modal
        title="Add New User"
        isOpen={isModalOpen}
        onClose={handleModalClose}
      >
        <form action="" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            className="border border-sky-600 outline-0 w-full px-3 py-2 rounded my-3"
            placeholder="Full Name"
            onChange={(e) => handleInput(e)}
          />

          <input
            type="text"
            name="email"
            className="border border-sky-600 outline-0 w-full px-3 py-2 rounded  my-3"
            placeholder="Email Address "
            onChange={(e) => handleInput(e)}
          />
          <input
            type="submit"
            className="border border-sky-600 bg-sky-600 text-white outline-0 w-full px-3 py-2 rounded  my-3 cursor-pointer"
            value="Add New User"
          />
        </form>
      </Modal>
    </div>
  );
};

export default withAuth(Page);
