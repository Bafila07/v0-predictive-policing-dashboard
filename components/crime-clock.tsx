"use client"

import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "12AM-6AM", value: 45, fill: "oklch(0.4 0.15 300)" },
  { name: "6AM-12PM", value: 120, fill: "oklch(0.5 0.2 260)" },
  { name: "12PM-6PM", value: 180, fill: "oklch(0.55 0.15 180)" },
  { name: "6PM-12AM", value: 240, fill: "oklch(0.6 0.25 0)" },
]

export default function CrimeClock() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Legend wrapperStyle={{ paddingTop: "20px" }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
