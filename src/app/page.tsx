import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="flex justify-center items-center w-full h-screen bg-amber-50">
      <div className="w-1/3 text-center bg-amber-100 py-10 rounded">
        <p className="text-lg">
          For Admin : <Link className="text-amber-800"  href={"/admin"}>Click Here</Link>
        </p>
        <p className="text-lg">
          For User : <Link className="text-amber-800" href={"/user"}>Click Here</Link>
        </p>
        <p className="text-lg">Username : admin</p>
        <p className="text-lg">Password : abcd</p>
      </div>
    </div>
  );
}

export default page;
