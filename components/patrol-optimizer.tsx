"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Zap } from "lucide-react"

export default function PatrolOptimizer() {
  const [units, setUnits] = useState(15)
  const [showRoute, setShowRoute] = useState(false)

  const aiReasoning = [
    "Coverage of high-risk zones optimized at 94%",
    "Response time minimized by 2.3 minutes",
    "Patrol density balanced across 5 sectors",
    "Peak hour (6-8 PM) adequately staffed",
    "Route efficiency score: 87/100",
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="glow-card rounded-lg p-6 bg-card/50 space-y-6">
          <h3 className="text-lg font-semibold text-foreground">Patrol Configuration</h3>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Number of Patrol Units</label>
            <input
              type="range"
              min="5"
              max="50"
              value={units}
              onChange={(e) => setUnits(Number.parseInt(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-2xl font-bold text-primary mt-2">{units} Units</p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Shift Timing</label>
            <select className="w-full bg-input border border-border/50 rounded px-3 py-2 text-foreground">
              <option>Morning (6 AM - 2 PM)</option>
              <option>Evening (2 PM - 10 PM)</option>
              <option>Night (10 PM - 6 AM)</option>
              <option>24/7 Coverage</option>
            </select>
          </div>

          <Button className="w-full bg-accent hover:bg-accent/80" onClick={() => setShowRoute(!showRoute)}>
            <Zap size={16} className="mr-2" />
            Generate Optimal Route
          </Button>
        </div>

        {/* Route Preview */}
        <div className="col-span-2 glow-card rounded-lg p-6 bg-card/50">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Route Preview</h3>
          <div className="w-full h-96 bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg border border-border/30 flex items-center justify-center">
            {showRoute ? (
              <div className="text-center space-y-4">
                <svg className="w-32 h-32 mx-auto" viewBox="0 0 100 100" fill="none">
                  <path d="M 20 50 Q 50 20 80 50 Q 50 80 20 50" stroke="url(#gradient)" strokeWidth="2" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="oklch(0.4 0.2 260)" />
                      <stop offset="100%" stopColor="oklch(0.6 0.25 0)" />
                    </linearGradient>
                  </defs>
                  <circle cx="20" cy="50" r="3" fill="oklch(0.4 0.2 260)" />
                  <circle cx="80" cy="50" r="3" fill="oklch(0.6 0.25 0)" />
                </svg>
                <p className="text-sm text-muted-foreground">Optimal patrol route generated</p>
              </div>
            ) : (
              <p className="text-muted-foreground">Click "Generate Optimal Route" to preview</p>
            )}
          </div>
        </div>
      </div>

      {/* Route Summary */}
      {showRoute && (
        <div className="grid grid-cols-3 gap-6">
          {/* Summary Card */}
          <div className="glow-card rounded-lg p-6 bg-card/50">
            <div className="flex items-start gap-3 mb-4">
              <MapPin size={20} className="text-primary mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Coverage Score</p>
                <p className="text-2xl font-bold text-foreground">94%</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Distance:</span>{" "}
                <span className="text-foreground font-semibold">47.3 km</span>
              </p>
              <p>
                <span className="text-muted-foreground">Zones Covered:</span>{" "}
                <span className="text-foreground font-semibold">5/5</span>
              </p>
            </div>
          </div>

          {/* Time Card */}
          <div className="glow-card rounded-lg p-6 bg-card/50">
            <div className="flex items-start gap-3 mb-4">
              <Clock size={20} className="text-primary mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Est. Duration</p>
                <p className="text-2xl font-bold text-foreground">2h 15m</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Avg Speed:</span>{" "}
                <span className="text-foreground font-semibold">21 km/h</span>
              </p>
              <p>
                <span className="text-muted-foreground">Stops:</span>{" "}
                <span className="text-foreground font-semibold">12</span>
              </p>
            </div>
          </div>

          {/* Efficiency Card */}
          <div className="glow-card rounded-lg p-6 bg-card/50">
            <div className="flex items-start gap-3 mb-4">
              <Zap size={20} className="text-accent mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Efficiency Score</p>
                <p className="text-2xl font-bold text-foreground">87/100</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Response Time:</span>{" "}
                <span className="text-foreground font-semibold">5.7m avg</span>
              </p>
              <p>
                <span className="text-muted-foreground">Optimization:</span>{" "}
                <span className="text-foreground font-semibold">+12%</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI Reasoning */}
      {showRoute && (
        <div className="glow-card rounded-lg p-6 bg-card/50">
          <h3 className="text-lg font-semibold mb-4 text-foreground">AI Reasoning</h3>
          <div className="space-y-3">
            {aiReasoning.map((reason, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p className="text-muted-foreground text-sm">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
