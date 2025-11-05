"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Button } from "@/components/ui/button"

const crimeData = [
  { date: "Mon", total: 124, predicted: 98, theft: 45, robbery: 23, assault: 20 },
  { date: "Tue", total: 138, predicted: 110, theft: 52, robbery: 28, assault: 18 },
  { date: "Wed", total: 145, predicted: 135, theft: 58, robbery: 32, assault: 22 },
  { date: "Thu", total: 156, predicted: 148, theft: 62, robbery: 35, assault: 25 },
  { date: "Fri", total: 189, predicted: 175, theft: 75, robbery: 42, assault: 30 },
  { date: "Sat", total: 203, predicted: 198, theft: 82, robbery: 48, assault: 35 },
  { date: "Sun", total: 167, predicted: 152, theft: 68, robbery: 38, assault: 28 },
]

const dataTable = [
  { id: "C001", type: "Robbery", location: "MG Road", time: "10:30 AM", risk: "Critical", date: "Nov 5" },
  { id: "C002", type: "Theft", location: "Brigade Road", time: "2:15 PM", risk: "High", date: "Nov 5" },
  { id: "C003", type: "Assault", location: "Rajpur Rd", time: "6:45 PM", risk: "High", date: "Nov 4" },
  { id: "C004", type: "Burglary", location: "Whitefield", time: "11:20 PM", risk: "Medium", date: "Nov 4" },
  { id: "C005", type: "Pickpocket", location: "Mall Road", time: "3:50 PM", risk: "Low", date: "Nov 3" },
]

export default function Analytics() {
  const [timeFilter, setTimeFilter] = useState("week")

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-2">
        {["day", "week", "month"].map((period) => (
          <Button
            key={period}
            variant={timeFilter === period ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFilter(period)}
            className="capitalize"
          >
            {period}
          </Button>
        ))}
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="glow-card rounded-lg p-6 bg-card/50">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Crime Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={crimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.18 0 0)" />
              <XAxis dataKey="date" stroke="oklch(0.65 0 0)" />
              <YAxis stroke="oklch(0.65 0 0)" />
              <Tooltip contentStyle={{ backgroundColor: "oklch(0.12 0 0)", border: "1px solid oklch(0.18 0 0)" }} />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="oklch(0.6 0.25 0)" strokeWidth={2} name="Total Crimes" />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="oklch(0.4 0.2 260)"
                strokeWidth={2}
                name="Predicted"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="glow-card rounded-lg p-6 bg-card/50">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Crime by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={crimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.18 0 0)" />
              <XAxis dataKey="date" stroke="oklch(0.65 0 0)" />
              <YAxis stroke="oklch(0.65 0 0)" />
              <Tooltip contentStyle={{ backgroundColor: "oklch(0.12 0 0)", border: "1px solid oklch(0.18 0 0)" }} />
              <Legend />
              <Bar dataKey="theft" fill="oklch(0.5 0.2 260)" name="Theft" />
              <Bar dataKey="robbery" fill="oklch(0.6 0.25 0)" name="Robbery" />
              <Bar dataKey="assault" fill="oklch(0.4 0.15 300)" name="Assault" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="glow-card rounded-lg p-6 bg-card/50 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Crime Records</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-2 px-4 text-muted-foreground font-semibold">ID</th>
              <th className="text-left py-2 px-4 text-muted-foreground font-semibold">Type</th>
              <th className="text-left py-2 px-4 text-muted-foreground font-semibold">Location</th>
              <th className="text-left py-2 px-4 text-muted-foreground font-semibold">Time</th>
              <th className="text-left py-2 px-4 text-muted-foreground font-semibold">Risk Level</th>
              <th className="text-left py-2 px-4 text-muted-foreground font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {dataTable.map((row) => (
              <tr key={row.id} className="border-b border-border/30 hover:bg-primary/5">
                <td className="py-2 px-4 text-foreground">{row.id}</td>
                <td className="py-2 px-4 text-foreground">{row.type}</td>
                <td className="py-2 px-4 text-foreground">{row.location}</td>
                <td className="py-2 px-4 text-foreground">{row.time}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      row.risk === "Critical"
                        ? "bg-red-900/20 text-red-300"
                        : row.risk === "High"
                          ? "bg-yellow-900/20 text-yellow-300"
                          : row.risk === "Medium"
                            ? "bg-blue-900/20 text-blue-300"
                            : "bg-green-900/20 text-green-300"
                    }`}
                  >
                    {row.risk}
                  </span>
                </td>
                <td className="py-2 px-4 text-foreground">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
