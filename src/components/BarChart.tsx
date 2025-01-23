"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "January", sold: 4000, unsold: 2400 },
  { name: "February", sold: 3000, unsold: 1398 },
  { name: "March", sold: 2000, unsold: 9800 },
  { name: "April", sold: 2780, unsold: 3908 },
  { name: "May", sold: 1890, unsold: 4800 },
  { name: "June", sold: 2390, unsold: 3800 },
  { name: "July", sold: 3490, unsold: 4300 },
  { name: "August", sold: 3490, unsold: 4300 },
  { name: "September", sold: 3490, unsold: 4300 },
  { name: "October", sold: 3490, unsold: 4300 },
  { name: "November", sold: 3490, unsold: 4300 },
  { name: "December", sold: 3490, unsold: 4300 },
];

const MyBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        style={{ backgroundColor: "white" }} // Set white background
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sold" fill="#66BB6A  " /> {/* Business blue */}
        <Bar dataKey="unsold" fill="#FFB300 " /> {/* Business green */}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MyBarChart;
