"use client"

import { useState, useEffect } from "react"
import { MapPin, Activity, AlertCircle } from "lucide-react"
import { HotspotZone, RiskHeatmapPoint } from "@/lib/crime-data"
import { riskPalette, getRiskLevelFromScore, type RiskLevel } from "@/lib/theme"
import DehradunMapBackground from "./dehradun-map-background"

interface GisMapProps {
  hotspots?: HotspotZone[]
  heatmapPoints?: RiskHeatmapPoint[]
  showPredictions?: boolean
}

export default function GisMap({ hotspots = [], heatmapPoints = [], showPredictions = false }: GisMapProps) {
  const [selectedZone, setSelectedZone] = useState<HotspotZone | null>(null)
  const [animationFrame, setAnimationFrame] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame((prev) => (prev + 1) % 60)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Map bounds (Dehradun area)
  const mapBounds = {
    minLat: 30.31,
    maxLat: 30.35,
    minLng: 78.02,
    maxLng: 78.07,
  }

  // Convert lat/lng to SVG coordinates
  const toSVGCoords = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100
    const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100
    return { x, y }
  }

  const getRiskLevelFromIntensity = (intensity: number): RiskLevel => {
    if (intensity >= 0.8) return "critical"
    if (intensity >= 0.55) return "high"
    if (intensity >= 0.35) return "medium"
    return "low"
  }

  return (
    <div className="glow-card rounded-lg p-6 bg-card/50 overflow-hidden transition-all duration-500 ease-out hover:shadow-lg/60">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Activity size={20} className="text-primary" />
          Live Crime Heatmap
        </h3>
        <div className="flex gap-2">
          {(Object.keys(riskPalette) as RiskLevel[]).map((level) => (
            <span
              key={level}
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${riskPalette[level].badgeClass} ${riskPalette[level].textClass} ${riskPalette[level].borderClass} transition-all duration-300`}
            >
              {riskPalette[level].label}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Map */}
      <div className="w-full h-96 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 rounded-2xl border border-border/30 relative overflow-hidden transition-all duration-700 ease-out">
        {/* Dehradun Map Background */}
        <DehradunMapBackground />

        {/* Heatmap Layer */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            {(Object.keys(riskPalette) as RiskLevel[]).map((level) => (
              <radialGradient id={`heatGradient-${level}`} key={`gradient-${level}`}>
                <stop offset="0%" stopColor={riskPalette[level].gradientStops[0]} />
                <stop offset="55%" stopColor={riskPalette[level].gradientStops[1]} />
                <stop offset="100%" stopColor={riskPalette[level].gradientStops[2]} />
              </radialGradient>
            ))}
          </defs>

          {/* Render heatmap points */}
          {heatmapPoints.map((point, idx) => {
            const coords = toSVGCoords(point.lat, point.lng)
            const radius = (point.radius / (mapBounds.maxLng - mapBounds.minLng)) * 100
            const level = getRiskLevelFromIntensity(point.intensity)
            const gradient = `heatGradient-${level}`

            return (
              <circle
                key={`heat-${idx}`}
                cx={coords.x}
                cy={coords.y}
                r={radius * 2}
                fill={`url(#${gradient})`}
                opacity={0.65 + Math.sin(animationFrame / 12) * 0.12}
                style={{ transition: "all 0.6s ease-in-out" }}
              />
            )
          })}
        </svg>

        {/* Hotspot Markers */}
        <div className="absolute inset-0">
          {hotspots.map((hotspot, idx) => {
            const coords = toSVGCoords(hotspot.lat, hotspot.lng)
            const level = getRiskLevelFromScore(hotspot.riskScore)
            const palette = riskPalette[level]

            return (
              <div
                key={hotspot.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                }}
                onClick={() => setSelectedZone(selectedZone?.id === hotspot.id ? null : hotspot)}
              >
                {/* Pulsing Ring */}
                <div
                  className={`absolute inset-0 rounded-full opacity-70 blur-sm ${palette.pulseClass}`}
                  style={{
                    width: `${20 + hotspot.riskScore / 5}px`,
                    height: `${20 + hotspot.riskScore / 5}px`,
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    animation: `pulse-${idx % 3} 2.6s ease-in-out infinite`,
                  }}
                />

                {/* Marker Pin */}
                <div
                  className={`relative z-10 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform duration-500 hover:scale-110 ${palette.markerFill} ${palette.markerBorder}`}
                  style={{
                    width: `${20 + hotspot.riskScore / 10}px`,
                    height: `${20 + hotspot.riskScore / 10}px`,
                  }}
                >
                  <AlertCircle size={12} className="text-white" />
                </div>

                {/* Tooltip */}
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  <div className="bg-card border border-primary/30 rounded px-3 py-2 shadow-xl">
                    <p className="text-xs font-semibold text-foreground">{hotspot.name}</p>
                    <p className="text-xs text-muted-foreground">Risk: {Math.round(hotspot.riskScore)}%</p>
                    <p className="text-xs text-accent">{hotspot.crimeCount} incidents</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Prediction Overlay */}
        {showPredictions && (
          <div className="absolute top-4 right-4 bg-primary/20 border border-primary/50 rounded px-3 py-2 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-500">
            <p className="text-xs font-semibold text-primary flex items-center gap-1">
              <Activity size={12} />
              Predictive Mode Active
            </p>
          </div>
        )}

        <p className="absolute bottom-4 left-4 text-xs text-muted-foreground">AI-Powered Risk Analysis</p>
      </div>

      {/* Selected Zone Details */}
      {selectedZone && (
        <div className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                {selectedZone.name}
              </h4>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${riskPalette[getRiskLevelFromScore(selectedZone.riskScore)].badgeClass} ${riskPalette[getRiskLevelFromScore(selectedZone.riskScore)].textClass} ${riskPalette[getRiskLevelFromScore(selectedZone.riskScore)].borderClass}`}>
                    {riskPalette[getRiskLevelFromScore(selectedZone.riskScore)].label}
                  </span>
                  <p className="text-muted-foreground">
                    <span className="text-foreground font-medium">Risk Score:</span> {Math.round(selectedZone.riskScore)}%
                  </p>
                </div>
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">Total Crimes:</span> {selectedZone.crimeCount}
                </p>
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">Primary Type:</span> {selectedZone.primaryCrimeType}
                </p>
                {showPredictions && (
                  <p className="text-accent font-medium">
                    Predicted: {selectedZone.predictedCrimes} crimes (Next 24h)
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedZone(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
