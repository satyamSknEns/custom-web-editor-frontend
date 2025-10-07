"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Active User", value: 300 },
  { name: "Total Users", value: 700 },
];

const COLORS = ["#FF8042", "#00C49F"];

export default function DonutChartCard() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col items-center justify-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          User Distribution
        </h2>
        <p className="text-gray-500">Loading chart...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col items-center justify-center">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        User Distribution
      </h2>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend
            align="center"
            verticalAlign="bottom"
            layout="horizontal"
            wrapperStyle={{ position: "relative", bottom: "-50px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
