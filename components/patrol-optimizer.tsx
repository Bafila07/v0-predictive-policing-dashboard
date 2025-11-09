"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Zap, Navigation, AlertCircle } from "lucide-react"
import { generateHistoricalCrimeData, identifyHotspots } from "@/lib/crime-data"
import { optimizePatrolRoute, calculatePatrolDistribution } from "@/lib/patrol-routing"
import DehradunMapBackground from "./dehradun-map-background"

export default function PatrolOptimizer() {
  const [units, setUnits] = useState(15)
  const [showRoute, setShowRoute] = useState(false)
  const [selectedShift, setSelectedShift] = useState("evening")

  // Generate crime data and hotspots
  const crimeData = useMemo(() => generateHistoricalCrimeData(30), [])
  const hotspots = useMemo(() => identifyHotspots(crimeData, 5), [crimeData])

  // Calculate optimal route
  const routeOptimization = useMemo(() => {
    if (hotspots.length === 0) return null
    try {
      return optimizePatrolRoute(hotspots, 30.3165, 78.0322, 12)
    } catch (e) {
      return null
    }
  }, [hotspots])

  // Calculate patrol distribution
  const patrolDistribution = useMemo(
    () => calculatePatrolDistribution(hotspots, units),
    [hotspots, units]
  )

  const route = routeOptimization?.route
  const metrics = routeOptimization?.metrics
  const aiReasoning = routeOptimization?.reasoning || []

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
            <select
              className="w-full bg-input border border-border/50 rounded px-3 py-2 text-foreground"
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
            >
              <option value="morning">Morning (6 AM - 2 PM)</option>
              <option value="evening">Evening (2 PM - 10 PM)</option>
              <option value="night">Night (10 PM - 6 AM)</option>
              <option value="24/7">24/7 Coverage</option>
            </select>
          </div>

          <Button
            className="w-full bg-accent hover:bg-accent/80"
            onClick={() => setShowRoute(!showRoute)}
            disabled={!routeOptimization}
          >
            <Zap size={16} className="mr-2" />
            {showRoute ? "Hide Route" : "Generate Optimal Route"}
          </Button>

          {hotspots.length === 0 && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Analyzing crime data...
            </p>
          )}
        </div>

        {/* Route Preview */}
        <div className="col-span-2 glow-card rounded-lg p-6 bg-card/50">
          <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
            <Navigation size={20} className="text-primary" />
            Route Preview
          </h3>
          <div className="w-full h-96 bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg border border-border/30 relative overflow-hidden">
            {/* Dehradun Map Background */}
            <DehradunMapBackground />
            
            {showRoute && route ? (
              <div className="absolute inset-0 p-4">
                {/* Route Visualization */}
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="oklch(0.4 0.2 260)" />
                      <stop offset="50%" stopColor="oklch(0.55 0.2 180)" />
                      <stop offset="100%" stopColor="oklch(0.6 0.25 0)" />
                    </linearGradient>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="10"
                      refX="5"
                      refY="3"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3, 0 6" fill="oklch(0.6 0.25 0)" />
                    </marker>
                  </defs>

                  {/* Draw route path */}
                  {route.waypoints.map((waypoint, idx) => {
                    if (idx === 0) return null
                    const prev = route.waypoints[idx - 1]
                    const x1 = ((prev.lng - 78.02) / 0.05) * 100
                    const y1 = ((30.35 - prev.lat) / 0.04) * 100
                    const x2 = ((waypoint.lng - 78.02) / 0.05) * 100
                    const y2 = ((30.35 - waypoint.lat) / 0.04) * 100

                    return (
                      <line
                        key={`line-${idx}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="url(#routeGradient)"
                        strokeWidth="0.5"
                        markerEnd="url(#arrowhead)"
                        opacity="0.8"
                      />
                    )
                  })}

                  {/* Draw waypoint markers */}
                  {route.waypoints.map((waypoint, idx) => {
                    const x = ((waypoint.lng - 78.02) / 0.05) * 100
                    const y = ((30.35 - waypoint.lat) / 0.04) * 100
                    const isStart = idx === 0
                    const isEnd = idx === route.waypoints.length - 1

                    return (
                      <g key={`marker-${idx}`}>
                        <circle
                          cx={x}
                          cy={y}
                          r="2"
                          fill={isStart ? "oklch(0.5 0.2 120)" : isEnd ? "oklch(0.6 0.25 0)" : "oklch(0.4 0.2 260)"}
                          stroke="white"
                          strokeWidth="0.3"
                        />
                        <text
                          x={x}
                          y={y - 3}
                          fontSize="3"
                          fill="white"
                          textAnchor="middle"
                          className="font-semibold"
                        >
                          {idx + 1}
                        </text>
                      </g>
                    )
                  })}
                </svg>

                {/* Route Legend */}
                <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-primary/30 rounded p-3 text-xs">
                  <p className="font-semibold text-foreground mb-2">Waypoints</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {route.waypoints.slice(0, 6).map((wp, idx) => (
                      <p key={idx} className="text-muted-foreground">
                        {idx + 1}. {wp.name}
                      </p>
                    ))}
                    {route.waypoints.length > 6 && (
                      <p className="text-muted-foreground italic">+{route.waypoints.length - 6} more</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">Click "Generate Optimal Route" to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Route Summary */}
      {showRoute && route && metrics && (
        <div className="grid grid-cols-3 gap-6">
          {/* Summary Card */}
          <div className="glow-card rounded-lg p-6 bg-card/50">
            <div className="flex items-start gap-3 mb-4">
              <MapPin size={20} className="text-primary mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Coverage Score</p>
                <p className="text-2xl font-bold text-foreground">{route.coverageScore}%</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Distance:</span>{" "}
                <span className="text-foreground font-semibold">{metrics.totalDistance} km</span>
              </p>
              <p>
                <span className="text-muted-foreground">Zones Covered:</span>{" "}
                <span className="text-foreground font-semibold">{route.waypoints.length}/{hotspots.length}</span>
              </p>
            </div>
          </div>

          {/* Time Card */}
          <div className="glow-card rounded-lg p-6 bg-card/50">
            <div className="flex items-start gap-3 mb-4">
              <Clock size={20} className="text-primary mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Est. Duration</p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.floor(route.estimatedDuration / 60)}h {route.estimatedDuration % 60}m
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Avg Response:</span>{" "}
                <span className="text-foreground font-semibold">{metrics.avgResponseTime.toFixed(1)}m</span>
              </p>
              <p>
                <span className="text-muted-foreground">Stops:</span>{" "}
                <span className="text-foreground font-semibold">{route.waypoints.length}</span>
              </p>
            </div>
          </div>

          {/* Efficiency Card */}
          <div className="glow-card rounded-lg p-6 bg-card/50">
            <div className="flex items-start gap-3 mb-4">
              <Zap size={20} className="text-accent mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Efficiency Score</p>
                <p className="text-2xl font-bold text-foreground">{route.efficiencyScore}/100</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Coverage:</span>{" "}
                <span className="text-foreground font-semibold">{metrics.coveragePercentage}%</span>
              </p>
              <p>
                <span className="text-muted-foreground">Fuel Efficiency:</span>{" "}
                <span className="text-foreground font-semibold">{metrics.fuelEfficiency}%</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI Reasoning & Patrol Distribution */}
      {showRoute && (
        <div className="grid grid-cols-2 gap-6">
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

          <div className="glow-card rounded-lg p-6 bg-card/50">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Patrol Unit Distribution</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {patrolDistribution.map((dist, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-primary/5 rounded">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{dist.zone}</p>
                    <p className="text-xs text-muted-foreground">{dist.reasoning}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle size={14} className="text-accent" />
                    <span className="text-lg font-bold text-primary">{dist.units}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
