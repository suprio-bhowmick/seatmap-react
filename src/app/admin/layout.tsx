'use client'; // Ensure this component is treated as a client-side component

import Link from 'next/link';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Import useRouter and usePathname

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter(); // Use the router to navigate after logout
  const pathname = usePathname(); // Get the current route

  // Logout function
  const handleLogout = () => {
    // Remove the authentication data from localStorage (or any other method you're using)
    localStorage.removeItem('seatMapAdminLoggedIN');
    // Redirect to the login page
    router.push('/admin');
  };

  // If the current route is the login page, don't render the layout
  if (pathname === '/admin') {
    return <>{children}</>; // Only render children (login page) without the layout
  }

  return (
    <>
      <div className="bg-sky-500 shadow-md flex justify-between items-center">
        <div className="container">
          <nav className="py-3">
            <div className="container flex justify-between">
              <a className="text-2xl font-extrabold text-white" href="">
                seatMAP
              </a>
              <ul className="flex gap-10">
                <li className="text-white">
                  <Link href="/admin/user">Users</Link>
                </li>
                <li className="text-white">
                  <Link href="/admin/room">Room</Link>
                </li>
                <li className="text-white">
                  <span onClick={handleLogout} className="cursor-pointer">
                    Logout
                  </span>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
      {children}
    </>
  );
}
