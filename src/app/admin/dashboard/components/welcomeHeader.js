"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardHeader() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const date = new Date();

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "2-digit",
    };

    const formattedDate = date.toLocaleDateString("en-US", options);
    const finalDate = formattedDate
      .replace(/, (\d{2})/, " $1")
      .replace(/, (\d{4})/, " $1");

    setCurrentDate(finalDate);
  }, []);

  return (
    <div className="bg-white border-orange-500/50 border shadow-sm shadow-orange-300 rounded-lg px-3 py-2 flex items-center justify-between w-full border-b mb-2">
      <div className="flex items-end gap-2">
        <div className="flex flex-col">
          <h1 className="text-xl text-black font-semibold">Welcome Back,</h1>
          <p className="text-gray-500 text-xs mt-1">Today is {currentDate}</p>
        </div>
        <div className="capitalize bg-blue-50 border-[1px] border-blue-200 rounded-md py-1 px-2 md:px-4 text-blue-500 text-xs">
          Admin
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-md"
        >
          Go to Website
        </Link>

        <button className="w-8 h-8 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors text-gray-600">
          🔔
        </button>

        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
          <span className="mt-1">S</span>
        </div>
      </div>
    </div>
  );
}
