// components/PerformanceCard.js
import React from 'react';
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai'; // Or other suitable icons

export default function PerformanceCard() {
  const todayOrders = 0; // Example data
  const performanceChange = 0; // Example data, represents percentage change

  const isPositive = performanceChange >= 0;
  const changeIcon = isPositive ? <AiOutlineArrowUp className="text-green-500 ml-1" /> : <AiOutlineArrowDown className="text-red-500 ml-1" />;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Today&lsquo;s Orders</h2>
        
        <div className="flex items-center mb-4">
          <p className="text-4xl font-bold text-gray-900 mr-2">{todayOrders}</p>
          <p className={`text-md font-medium flex items-center ${changeColor}`}>
            {performanceChange}% {changeIcon}
          </p>
        </div>
        
        <p className="text-sm text-gray-500 mb-6 flex items-center">
            You have a low performance 😔
        </p>

        {/* List of Metrics */}
        <ul className="space-y-3">
          <li className="flex justify-between items-center text-gray-700">
            <span className="flex items-center text-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
                Orders
            </span>
            <span className="font-medium">0</span>
          </li>
          <li className="flex justify-between items-center text-gray-700">
            <span className="flex items-center text-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                Users
            </span>
            <span className="font-medium">110</span>
          </li>
          <li className="flex justify-between items-center text-gray-700">
            <span className="flex items-center text-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
                Active Users
            </span>
            <span className="font-medium">0</span>
          </li>
        </ul>
      </div>
    </div>
  );
}