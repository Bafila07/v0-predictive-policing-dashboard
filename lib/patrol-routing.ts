import { HotspotZone } from './crime-data'

export interface PatrolRoute {
  id: string
  waypoints: Waypoint[]
  totalDistance: number
  estimatedDuration: number
  coverageScore: number
  efficiencyScore: number
  zonesVisited: string[]
}

export interface Waypoint {
  lat: number
  lng: number
  name: string
  priority: number
  estimatedStayTime: number // minutes
}

export interface RouteOptimizationResult {
  route: PatrolRoute
  alternatives: PatrolRoute[]
  metrics: {
    totalDistance: number
    avgResponseTime: number
    coveragePercentage: number
    fuelEfficiency: number
  }
  reasoning: string[]
}

// Optimize patrol route using greedy nearest neighbor with priority weighting
export function optimizePatrolRoute(
  hotspots: HotspotZone[],
  startLat: number = 30.3165,
  startLng: number = 78.0322,
  maxWaypoints: number = 12
): RouteOptimizationResult {
  if (hotspots.length === 0) {
    throw new Error('No hotspots provided for route optimization')
  }

  // Convert hotspots to waypoints with priority
  const waypoints: Waypoint[] = hotspots.map((hotspot) => ({
    lat: hotspot.lat,
    lng: hotspot.lng,
    name: hotspot.name,
    priority: hotspot.riskScore,
    estimatedStayTime: Math.ceil(hotspot.riskScore / 20) * 5, // 5-25 minutes based on risk
  }))

  // Sort by priority and take top waypoints
  const prioritizedWaypoints = waypoints
    .sort((a, b) => b.priority - a.priority)
    .slice(0, maxWaypoints)

  // Build route using nearest neighbor algorithm with priority bias
  const route = buildOptimalRoute(startLat, startLng, prioritizedWaypoints)

  // Generate alternative routes
  const alternatives = generateAlternativeRoutes(startLat, startLng, prioritizedWaypoints, 2)

  // Calculate metrics
  const metrics = calculateRouteMetrics(route, hotspots)

  // Generate reasoning
  const reasoning = generateRouteReasoning(route, metrics, hotspots)

  return {
    route,
    alternatives,
    metrics,
    reasoning,
  }
}

// Build optimal route using modified nearest neighbor
function buildOptimalRoute(startLat: number, startLng: number, waypoints: Waypoint[]): PatrolRoute {
  const visited: Waypoint[] = []
  const remaining = [...waypoints]
  let currentLat = startLat
  let currentLng = startLng
  let totalDistance = 0
  let totalTime = 0

  while (remaining.length > 0) {
    // Find next waypoint considering both distance and priority
    let bestScore = -Infinity
    let bestIndex = 0

    remaining.forEach((waypoint, index) => {
      const distance = calculateDistance(currentLat, currentLng, waypoint.lat, waypoint.lng)
      // Score = priority / distance (higher priority, shorter distance = better)
      const score = waypoint.priority / (distance + 0.1) // +0.1 to avoid division by zero
      if (score > bestScore) {
        bestScore = score
        bestIndex = index
      }
    })

    const nextWaypoint = remaining[bestIndex]
    const distance = calculateDistance(currentLat, currentLng, nextWaypoint.lat, nextWaypoint.lng)

    visited.push(nextWaypoint)
    totalDistance += distance
    totalTime += (distance / 21) * 60 + nextWaypoint.estimatedStayTime // 21 km/h avg speed

    currentLat = nextWaypoint.lat
    currentLng = nextWaypoint.lng
    remaining.splice(bestIndex, 1)
  }

  // Calculate coverage and efficiency scores
  const coverageScore = Math.min((visited.length / waypoints.length) * 100, 100)
  const avgPriority = visited.reduce((sum, w) => sum + w.priority, 0) / visited.length
  const efficiencyScore = Math.min((avgPriority / totalDistance) * 10, 100)

  return {
    id: `ROUTE-${Date.now()}`,
    waypoints: visited,
    totalDistance: Math.round(totalDistance * 100) / 100,
    estimatedDuration: Math.round(totalTime),
    coverageScore: Math.round(coverageScore),
    efficiencyScore: Math.round(efficiencyScore),
    zonesVisited: visited.map((w) => w.name),
  }
}

// Generate alternative routes using different strategies
function generateAlternativeRoutes(
  startLat: number,
  startLng: number,
  waypoints: Waypoint[],
  count: number
): PatrolRoute[] {
  const alternatives: PatrolRoute[] = []

  for (let i = 0; i < count; i++) {
    // Shuffle waypoints slightly for variation
    const shuffled = [...waypoints].sort(() => Math.random() - 0.5)
    const route = buildOptimalRoute(startLat, startLng, shuffled.slice(0, waypoints.length - i))
    alternatives.push(route)
  }

  return alternatives
}

// Calculate route metrics
function calculateRouteMetrics(
  route: PatrolRoute,
  hotspots: HotspotZone[]
): {
  totalDistance: number
  avgResponseTime: number
  coveragePercentage: number
  fuelEfficiency: number
} {
  const totalDistance = route.totalDistance
  const avgResponseTime = route.estimatedDuration / route.waypoints.length
  const coveragePercentage = (route.waypoints.length / hotspots.length) * 100
  const fuelEfficiency = totalDistance > 0 ? 100 - (totalDistance / 100) * 10 : 100

  return {
    totalDistance: Math.round(totalDistance * 10) / 10,
    avgResponseTime: Math.round(avgResponseTime * 10) / 10,
    coveragePercentage: Math.round(coveragePercentage),
    fuelEfficiency: Math.max(0, Math.round(fuelEfficiency)),
  }
}

// Generate reasoning for route decisions
function generateRouteReasoning(
  route: PatrolRoute,
  metrics: any,
  hotspots: HotspotZone[]
): string[] {
  const reasoning: string[] = []

  reasoning.push(`Coverage of high-risk zones optimized at ${route.coverageScore}%`)
  reasoning.push(`Response time minimized to ${metrics.avgResponseTime.toFixed(1)} minutes avg`)
  reasoning.push(`Route efficiency score: ${route.efficiencyScore}/100`)

  const highRiskZones = hotspots.filter((h) => h.riskScore > 70)
  const coveredHighRisk = route.waypoints.filter((w) =>
    highRiskZones.some((h) => h.name === w.name)
  ).length

  if (coveredHighRisk > 0) {
    reasoning.push(`${coveredHighRisk}/${highRiskZones.length} critical zones covered`)
  }

  reasoning.push(`Total patrol distance: ${metrics.totalDistance} km`)

  return reasoning
}

// Calculate distance between two points (Haversine formula simplified)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Calculate optimal patrol unit distribution
export function calculatePatrolDistribution(
  hotspots: HotspotZone[],
  totalUnits: number
): { zone: string; units: number; reasoning: string }[] {
  const totalRisk = hotspots.reduce((sum, h) => sum + h.riskScore, 0)

  return hotspots.map((hotspot) => {
    const proportion = hotspot.riskScore / totalRisk
    const units = Math.max(1, Math.round(proportion * totalUnits))

    let reasoning = `Risk score: ${Math.round(hotspot.riskScore)}/100`
    if (hotspot.predictedCrimes > 0) {
      reasoning += `, ${hotspot.predictedCrimes} crimes predicted`
    }

    return {
      zone: hotspot.name,
      units,
      reasoning,
    }
  })
}
