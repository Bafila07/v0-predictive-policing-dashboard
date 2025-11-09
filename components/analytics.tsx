"use client"

import { useState, useMemo } from "react"
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
import { generateHistoricalCrimeData, analyzeTimePatterns } from "@/lib/crime-data"
import { predictCrimeHotspots, analyzeDayPatterns } from "@/lib/predictive-analytics"

export default function Analytics() {
  const [timeFilter, setTimeFilter] = useState("week")

  // Generate real crime data
  const crimeData = useMemo(() => generateHistoricalCrimeData(30), [])
  const predictions = useMemo(() => predictCrimeHotspots(crimeData, 24), [])
  const dayPatterns = useMemo(() => analyzeDayPatterns(crimeData), [crimeData])

  // Aggregate data by day for charts
  const chartData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const aggregated = days.map((day, idx) => {
      const dayCrimes = crimeData.filter(c => c.timestamp.getDay() === idx)
      const crimeTypes: { [key: string]: number } = {}
      dayCrimes.forEach(c => {
        crimeTypes[c.type] = (crimeTypes[c.type] || 0) + 1
      })
      
      const dayPrediction = dayPatterns.find(p => p.day === days[idx])
      const predicted = dayPrediction ? Math.round(dayPrediction.count * 0.85) : 0

      return {
        date: day,
        total: dayCrimes.length,
        predicted,
        theft: crimeTypes['Theft'] || 0,
        robbery: crimeTypes['Robbery'] || 0,
        assault: crimeTypes['Assault'] || 0,
      }
    })
    return aggregated
  }, [crimeData, dayPatterns])

  // Recent crime records for table
  const dataTable = useMemo(() => {
    return crimeData.slice(0, 10).map(crime => ({
      id: crime.id,
      type: crime.type,
      location: crime.location,
      time: crime.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      risk: crime.severity.charAt(0).toUpperCase() + crime.severity.slice(1),
      date: crime.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }))
  }, [crimeData])

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
            <LineChart data={chartData}>
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
            <BarChart data={chartData}>
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
