"use client"

import { useState } from "react"
import { MapPin, AlertTriangle, TrendingUp, Clock } from "lucide-react"
import KpiCard from "./kpi-card"
import CrimeClock from "./crime-clock"
import AlertsFeed from "./alerts-feed"
import GisMap from "./gis-map"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const [showPrediction, setShowPrediction] = useState(false)

  const kpis = [
    { label: "Total Crimes (24h)", value: "1,247", change: "+12%", icon: AlertTriangle },
    { label: "Top Risk Zone", value: "Rajpur Rd", change: "Critical", icon: MapPin },
    { label: "Predicted (Next 24h)", value: "142", change: "87% Confidence", icon: TrendingUp },
    { label: "Response Time Avg", value: "8.2 min", change: "-2.1%", icon: Clock },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Control Bar */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="border-primary/30 hover:bg-primary/10 bg-transparent"
          onClick={() => setShowPrediction(!showPrediction)}
        >
          Predict Next 24h
        </Button>
        <Button variant="outline" className="border-primary/30 hover:bg-primary/10 bg-transparent">
          View Hotspots
        </Button>
        <Button variant="outline" className="border-accent/30 hover:bg-accent/10 bg-transparent">
          Play Crime Wave
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: GIS Map */}
        <div className="col-span-2">
          <GisMap />
        </div>

        {/* Right: KPI Cards */}
        <div className="space-y-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Crime Clock */}
        <div className="glow-card rounded-lg p-6 bg-card/50">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Crime Clock (24h)</h3>
          <CrimeClock />
        </div>

        {/* Alerts Feed */}
        <div className="glow-card rounded-lg p-6 bg-card/50">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Real-time Alerts</h3>
          <AlertsFeed />
        </div>
      </div>

      {/* Prediction Modal */}
      {showPrediction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-card p-8 rounded-lg border border-primary/30 max-w-md">
            <h2 className="text-xl font-bold text-foreground mb-4">AI Prediction</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="text-accent font-semibold">High Risk Alert</p>
              <p>📍 Rajpur Road</p>
              <p>⏰ 6:00 PM - 8:00 PM</p>
              <p className="text-primary font-semibold">Confidence: 87%</p>
              <div className="mt-4 p-3 bg-primary/10 rounded border border-primary/30">
                <p className="font-semibold mb-2 text-foreground">AI Reasoning:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Historical pattern match: 92%</li>
                  <li>• Weather correlation: High</li>
                  <li>• Event overlap detected</li>
                  <li>• Suggested patrol: 15 units</li>
                </ul>
              </div>
            </div>
            <button
              onClick={() => setShowPrediction(false)}
              className="w-full mt-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
