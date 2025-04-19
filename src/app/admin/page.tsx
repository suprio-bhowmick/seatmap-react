"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type FormData = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("seatMapAdminLoggedIN");
    if (isLoggedIn === "true") {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const onSubmit = (data: FormData) => {
    setLoading(true);

    if (data.username === "admin" && data.password === "abcd") {
      localStorage.setItem("seatMapAdminLoggedIN", "true");
      router.push("/admin/dashboard");
    } else {
      alert("Invalid username or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4 mt-[-200px]"
      >
        <h2 className="text-2xl font-bold text-center text-sky-600">
          Admin Login
        </h2>

        <div>
          <label className="block mb-1 text-sm font-medium">Username</label>
          <input
            type="text"
            {...register("username", { required: "Username is required" })}
            className="w-full border px-3 py-2 rounded"
            disabled={loading}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full border px-3 py-2 rounded"
            disabled={loading}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full text-white py-2 rounded ${
            loading
              ? "bg-sky-300 cursor-not-allowed"
              : "bg-sky-600 hover:bg-sky-700"
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
