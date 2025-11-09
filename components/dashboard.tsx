"use client"

import { useState, useEffect, useMemo } from "react"
import { MapPin, AlertTriangle, TrendingUp, Clock, Activity } from "lucide-react"
import KpiCard from "./kpi-card"
import CrimeClock from "./crime-clock"
import AlertsFeed from "./alerts-feed"
import GisMap from "./gis-map"
import { Button } from "@/components/ui/button"
import { generateHistoricalCrimeData, identifyHotspots } from "@/lib/crime-data"
import { predictCrimeHotspots, generateRiskHeatmap } from "@/lib/predictive-analytics"
import { riskPalette, getRiskLevelFromScore } from "@/lib/theme"

export default function Dashboard() {
  const [showPrediction, setShowPrediction] = useState(false)
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Generate crime data and analytics - client-side only
  const [crimeData, setCrimeData] = useState<any[]>([])
  const [hotspots, setHotspots] = useState<any[]>([])
  const [predictions, setPredictions] = useState<any[]>([])
  const [heatmapPoints, setHeatmapPoints] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
    // Generate data on client side only
    const data = generateHistoricalCrimeData(30)
    const spots = identifyHotspots(data, 10)
    const preds = predictCrimeHotspots(data, 24)
    const heatmap = generateRiskHeatmap(data, spots, preds)
    
    setCrimeData(data)
    setHotspots(spots)
    setPredictions(preds)
    setHeatmapPoints(heatmap)
    
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  // Calculate KPIs from real data
  const totalCrimes24h = crimeData.filter(
    (c) => new Date().getTime() - c.timestamp.getTime() < 24 * 60 * 60 * 1000
  ).length
  const topRiskZone = hotspots[0]?.name || "N/A"
  const predictedNext24h = predictions.reduce((sum, p) => sum + p.predictedCrimes, 0)
  const avgConfidence = predictions.length > 0
    ? Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length)
    : 0

  const kpis = [
    { label: "Total Crimes (24h)", value: totalCrimes24h.toString(), change: "+12%", icon: AlertTriangle },
    { label: "Top Risk Zone", value: topRiskZone, change: "Critical", icon: MapPin },
    { label: "Predicted (Next 24h)", value: predictedNext24h.toString(), change: `${avgConfidence}% Confidence`, icon: TrendingUp },
    { label: "Active Hotspots", value: hotspots.length.toString(), change: `${predictions.length} Predictions`, icon: Activity },
  ]

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      {/* Control Bar */}
      <div className="flex gap-3 animate-slide-in-right">
        <Button
          variant="outline"
          className="border-primary/30 hover:bg-primary/10 bg-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
          onClick={() => setShowPrediction(!showPrediction)}
        >
          <TrendingUp size={16} className="mr-2" />
          Predict Next 24h
        </Button>
        <Button variant="outline" className="border-primary/30 hover:bg-primary/10 bg-transparent transition-all duration-300 hover:scale-105">
          <MapPin size={16} className="mr-2" />
          View Hotspots
        </Button>
        <Button variant="outline" className="border-accent/30 hover:bg-accent/10 bg-transparent transition-all duration-300 hover:scale-105">
          <Activity size={16} className="mr-2" />
          Live Analysis
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: GIS Map */}
        <div className="col-span-2">
          {isLoading ? (
            <div className="glow-card rounded-lg p-6 bg-card/50 h-96 flex items-center justify-center">
              <div className="text-center">
                <Activity className="animate-spin mx-auto mb-2 text-primary" size={32} />
                <p className="text-muted-foreground">Loading AI Analytics...</p>
              </div>
            </div>
          ) : (
            <GisMap hotspots={hotspots} heatmapPoints={heatmapPoints} showPredictions={showPrediction} />
          )}
        </div>

        {/* Right: KPI Cards */}
        <div className="space-y-4">
          {kpis.map((kpi, idx) => (
            <div
              key={kpi.label}
              className="animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <KpiCard {...kpi} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
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
      {showPrediction && predictions.length > 0 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4 animate-in fade-in duration-300">
          <div className="bg-card p-8 rounded-2xl border border-primary/30 max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl shadow-primary/20 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp size={24} className="text-primary" />
              AI Crime Predictions (Next 24h)
            </h2>
            <div className="space-y-4">
              {predictions.slice(0, 5).map((prediction, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-primary/5 rounded-lg border border-primary/20 hover:bg-primary/10 transition-colors cursor-pointer"
                  onClick={() => setSelectedPrediction(selectedPrediction === idx ? null : idx)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        <MapPin size={16} className="text-accent" />
                        {prediction.location}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{prediction.timeWindow}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${riskPalette[prediction.riskLevel].badgeClass} ${riskPalette[prediction.riskLevel].textClass} ${riskPalette[prediction.riskLevel].borderClass}`}
                      >
                        {riskPalette[prediction.riskLevel].label}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Predicted Crimes</p>
                      <p className="font-bold text-accent">{prediction.predictedCrimes}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Confidence</p>
                      <p className="font-bold text-primary">{prediction.confidence}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Patrol Units</p>
                      <p className="font-bold text-foreground">{prediction.recommendedPatrols}</p>
                    </div>
                  </div>

                  {selectedPrediction === idx && (
                    <div className="mt-3 pt-3 border-t border-border/30">
                      <p className="font-semibold mb-2 text-foreground text-sm">AI Reasoning:</p>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        {prediction.reasoning.map((reason, rIdx) => (
                          <li key={rIdx}>• {reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setShowPrediction(false)
                setSelectedPrediction(null)
              }}
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
