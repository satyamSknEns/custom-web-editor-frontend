import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="h-[65vh] sm:h-[80vh]">
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-800">404</h1>
          <p className="text-xl sm:text-2xl font-semibold text-gray-600">
            Page Not Found
          </p>
          <p className="mt-2 sm:mt-3 p-3 sm:text-lg text-gray-600">
            Sorry, the page you are looking for might be in another castle.
          </p>
          <Link
            href="/"
            className="w-[140px] inline-block px-6 py-3 mt-4 text-lg font-medium text-[#1f2937] border border-[#1f36c7]  shadow-md rounded z-50 bg-[#f3f4f6] hover:bg-[#1f36c7] hover:text-white hover:border-white"
          >
            HOME
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
