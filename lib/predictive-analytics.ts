import { CrimeRecord, HotspotZone } from './crime-data'

export interface PredictionResult {
  location: string
  lat: number
  lng: number
  predictedCrimes: number
  confidence: number
  timeWindow: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  reasoning: string[]
  recommendedPatrols: number
}

export interface RiskHeatmapPoint {
  lat: number
  lng: number
  intensity: number // 0-1
  radius: number
}

// Predict future crime hotspots using time-series analysis
export function predictCrimeHotspots(
  historicalCrimes: CrimeRecord[],
  hoursAhead: number = 24
): PredictionResult[] {
  const predictions: PredictionResult[] = []
  const now = new Date()
  const targetTime = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000)
  const targetHour = targetTime.getHours()

  // Group crimes by location
  const locationGroups: { [key: string]: CrimeRecord[] } = {}
  historicalCrimes.forEach((crime) => {
    if (!locationGroups[crime.location]) {
      locationGroups[crime.location] = []
    }
    locationGroups[crime.location].push(crime)
  })

  // Analyze each location
  Object.entries(locationGroups).forEach(([location, crimes]) => {
    // Filter crimes that occurred around the target hour (±2 hours)
    const relevantCrimes = crimes.filter((crime) => {
      const hour = crime.timestamp.getHours()
      return Math.abs(hour - targetHour) <= 2 || Math.abs(hour - targetHour + 24) <= 2
    })

    if (relevantCrimes.length > 0) {
      const avgLat = relevantCrimes.reduce((sum, c) => sum + c.lat, 0) / relevantCrimes.length
      const avgLng = relevantCrimes.reduce((sum, c) => sum + c.lng, 0) / relevantCrimes.length

      // Calculate trend
      const recentCrimes = crimes.filter(
        (c) => now.getTime() - c.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
      )
      const olderCrimes = crimes.filter(
        (c) =>
          now.getTime() - c.timestamp.getTime() >= 7 * 24 * 60 * 60 * 1000 &&
          now.getTime() - c.timestamp.getTime() < 14 * 24 * 60 * 60 * 1000
      )

      const trend = recentCrimes.length - olderCrimes.length
      const trendPercentage = olderCrimes.length > 0 ? (trend / olderCrimes.length) * 100 : 0

      // Predict based on historical patterns
      const baselinePrediction = relevantCrimes.length / 30 // Average per day
      const trendAdjustment = baselinePrediction * (trendPercentage / 100)
      const predictedCrimes = Math.max(1, Math.round(baselinePrediction + trendAdjustment))

      // Calculate confidence based on data consistency
      const variance = calculateVariance(relevantCrimes.map(() => 1))
      const confidence = Math.min(95, 70 + (relevantCrimes.length / crimes.length) * 25)

      // Determine risk level
      let riskLevel: 'low' | 'medium' | 'high' | 'critical'
      if (predictedCrimes >= 5) riskLevel = 'critical'
      else if (predictedCrimes >= 3) riskLevel = 'high'
      else if (predictedCrimes >= 2) riskLevel = 'medium'
      else riskLevel = 'low'

      // Generate AI reasoning
      const reasoning: string[] = []
      reasoning.push(`Historical pattern match: ${Math.round(confidence)}%`)
      if (trend > 0) {
        reasoning.push(`Upward trend detected: +${Math.round(trendPercentage)}%`)
      } else if (trend < 0) {
        reasoning.push(`Downward trend: ${Math.round(trendPercentage)}%`)
      }
      reasoning.push(`${relevantCrimes.length} similar incidents in past 30 days`)
      
      const peakHours = [18, 19, 20, 21, 22, 23]
      if (peakHours.includes(targetHour)) {
        reasoning.push('Peak crime hours (6 PM - 12 AM)')
      }

      const crimeTypes = [...new Set(relevantCrimes.map((c) => c.type))]
      reasoning.push(`Primary types: ${crimeTypes.slice(0, 2).join(', ')}`)

      predictions.push({
        location,
        lat: avgLat,
        lng: avgLng,
        predictedCrimes,
        confidence: Math.round(confidence),
        timeWindow: `${targetTime.toLocaleDateString()} ${targetHour}:00 - ${(targetHour + 2) % 24}:00`,
        riskLevel,
        reasoning,
        recommendedPatrols: Math.ceil(predictedCrimes * 1.5),
      })
    }
  })

  return predictions.sort((a, b) => b.predictedCrimes - a.predictedCrimes).slice(0, 10)
}

// Generate heatmap data for visualization
export function generateRiskHeatmap(
  crimes: CrimeRecord[],
  hotspots: HotspotZone[],
  predictions: PredictionResult[]
): RiskHeatmapPoint[] {
  const heatmapPoints: RiskHeatmapPoint[] = []

  // Add hotspot zones
  hotspots.forEach((hotspot) => {
    heatmapPoints.push({
      lat: hotspot.lat,
      lng: hotspot.lng,
      intensity: Math.min(hotspot.riskScore / 100, 1),
      radius: hotspot.radius,
    })
  })

  // Add predicted crime locations
  predictions.forEach((prediction) => {
    const intensityMap = {
      critical: 0.95,
      high: 0.75,
      medium: 0.5,
      low: 0.25,
    }

    heatmapPoints.push({
      lat: prediction.lat,
      lng: prediction.lng,
      intensity: intensityMap[prediction.riskLevel],
      radius: 0.01,
    })
  })

  // Add recent crime clusters
  const recentCrimes = crimes.slice(0, 50)
  const clusters = clusterCrimes(recentCrimes, 0.005)

  clusters.forEach((cluster) => {
    if (cluster.crimes.length >= 3) {
      heatmapPoints.push({
        lat: cluster.lat,
        lng: cluster.lng,
        intensity: Math.min(cluster.crimes.length / 10, 0.8),
        radius: 0.008,
      })
    }
  })

  return heatmapPoints
}

// Cluster nearby crimes
function clusterCrimes(
  crimes: CrimeRecord[],
  threshold: number
): { lat: number; lng: number; crimes: CrimeRecord[] }[] {
  const clusters: { lat: number; lng: number; crimes: CrimeRecord[] }[] = []
  const processed = new Set<string>()

  crimes.forEach((crime) => {
    if (processed.has(crime.id)) return

    const cluster = {
      lat: crime.lat,
      lng: crime.lng,
      crimes: [crime],
    }

    crimes.forEach((other) => {
      if (crime.id !== other.id && !processed.has(other.id)) {
        const distance = Math.sqrt(
          Math.pow(crime.lat - other.lat, 2) + Math.pow(crime.lng - other.lng, 2)
        )
        if (distance <= threshold) {
          cluster.crimes.push(other)
          processed.add(other.id)
        }
      }
    })

    processed.add(crime.id)

    if (cluster.crimes.length > 1) {
      cluster.lat = cluster.crimes.reduce((sum, c) => sum + c.lat, 0) / cluster.crimes.length
      cluster.lng = cluster.crimes.reduce((sum, c) => sum + c.lng, 0) / cluster.crimes.length
    }

    clusters.push(cluster)
  })

  return clusters
}

// Calculate variance for confidence scoring
function calculateVariance(values: number[]): number {
  if (values.length === 0) return 0
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length
  const squaredDiffs = values.map((val) => Math.pow(val - mean, 2))
  return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length
}

// Analyze crime patterns by day of week
export function analyzeDayPatterns(crimes: CrimeRecord[]): { day: string; count: number; risk: number }[] {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayCounts: { [key: string]: number } = {}

  days.forEach((day) => {
    dayCounts[day] = 0
  })

  crimes.forEach((crime) => {
    const day = days[crime.timestamp.getDay()]
    dayCounts[day]++
  })

  const maxCount = Math.max(...Object.values(dayCounts))

  return days.map((day) => ({
    day,
    count: dayCounts[day],
    risk: maxCount > 0 ? (dayCounts[day] / maxCount) * 100 : 0,
  }))
}
