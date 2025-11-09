// Crime data types and interfaces
export interface CrimeRecord {
  id: string
  type: string
  location: string
  lat: number
  lng: number
  timestamp: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
  resolved: boolean
}

export interface HotspotZone {
  id: string
  name: string
  lat: number
  lng: number
  radius: number
  riskScore: number
  crimeCount: number
  predictedCrimes: number
  confidence: number
  primaryCrimeType: string
}

export interface TimePattern {
  hour: number
  crimeCount: number
  riskLevel: number
}

export interface RiskHeatmapPoint {
  lat: number
  lng: number
  intensity: number // 0-1
  radius: number
}

// Generate historical crime data (simulated)
export function generateHistoricalCrimeData(days: number = 30): CrimeRecord[] {
  const crimes: CrimeRecord[] = []
  const crimeTypes = ['Theft', 'Robbery', 'Assault', 'Burglary', 'Vandalism', 'Pickpocket']
  const locations = [
    { name: 'Rajpur Road', lat: 30.3255, lng: 78.0436 },
    { name: 'MG Road', lat: 30.3165, lng: 78.0322 },
    { name: 'Brigade Road', lat: 30.3215, lng: 78.0511 },
    { name: 'Whitefield', lat: 30.3355, lng: 78.0625 },
    { name: 'Mall Road', lat: 30.3125, lng: 78.0289 },
    { name: 'Clock Tower', lat: 30.3195, lng: 78.0401 },
    { name: 'Paltan Bazaar', lat: 30.3285, lng: 78.0355 },
    { name: 'Saharanpur Road', lat: 30.3405, lng: 78.0478 },
  ]

  const now = new Date()
  let id = 1

  for (let day = 0; day < days; day++) {
    // Generate 15-30 crimes per day with time patterns
    const crimesPerDay = Math.floor(Math.random() * 15) + 15

    for (let i = 0; i < crimesPerDay; i++) {
      const location = locations[Math.floor(Math.random() * locations.length)]
      const crimeType = crimeTypes[Math.floor(Math.random() * crimeTypes.length)]
      
      // Crime patterns: more crimes in evening (18-23) and night (0-3)
      let hour: number
      const rand = Math.random()
      if (rand < 0.4) {
        hour = Math.floor(Math.random() * 6) + 18 // 6PM-12AM (40%)
      } else if (rand < 0.6) {
        hour = Math.floor(Math.random() * 4) // 12AM-4AM (20%)
      } else {
        hour = Math.floor(Math.random() * 24) // Any time (40%)
      }

      const timestamp = new Date(now)
      timestamp.setDate(timestamp.getDate() - day)
      timestamp.setHours(hour, Math.floor(Math.random() * 60), 0, 0)

      // Add some location variance
      const latVariance = (Math.random() - 0.5) * 0.01
      const lngVariance = (Math.random() - 0.5) * 0.01

      crimes.push({
        id: `C${String(id).padStart(4, '0')}`,
        type: crimeType,
        location: location.name,
        lat: location.lat + latVariance,
        lng: location.lng + lngVariance,
        timestamp,
        severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
        resolved: Math.random() > 0.3,
      })
      id++
    }
  }

  return crimes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

// Analyze time patterns
export function analyzeTimePatterns(crimes: CrimeRecord[]): TimePattern[] {
  const hourlyData: { [hour: number]: number } = {}

  for (let i = 0; i < 24; i++) {
    hourlyData[i] = 0
  }

  crimes.forEach((crime) => {
    const hour = crime.timestamp.getHours()
    hourlyData[hour]++
  })

  const maxCrimes = Math.max(...Object.values(hourlyData))

  return Object.entries(hourlyData).map(([hour, count]) => ({
    hour: parseInt(hour),
    crimeCount: count,
    riskLevel: maxCrimes > 0 ? (count / maxCrimes) * 100 : 0,
  }))
}

// Identify hotspot zones using clustering
export function identifyHotspots(crimes: CrimeRecord[], minCrimes: number = 10): HotspotZone[] {
  const locations = [
    { name: 'Rajpur Road', lat: 30.3255, lng: 78.0436 },
    { name: 'MG Road', lat: 30.3165, lng: 78.0322 },
    { name: 'Brigade Road', lat: 30.3215, lng: 78.0511 },
    { name: 'Whitefield', lat: 30.3355, lng: 78.0625 },
    { name: 'Mall Road', lat: 30.3125, lng: 78.0289 },
    { name: 'Clock Tower', lat: 30.3195, lng: 78.0401 },
    { name: 'Paltan Bazaar', lat: 30.3285, lng: 78.0355 },
  ]

  const hotspots: HotspotZone[] = []

  locations.forEach((location, idx) => {
    // Count crimes within radius
    const radius = 0.015 // ~1.5km
    const crimesInZone = crimes.filter((crime) => {
      const distance = Math.sqrt(
        Math.pow(crime.lat - location.lat, 2) + Math.pow(crime.lng - location.lng, 2)
      )
      return distance <= radius
    })

    if (crimesInZone.length >= minCrimes) {
      const crimeTypes: { [key: string]: number } = {}
      crimesInZone.forEach((crime) => {
        crimeTypes[crime.type] = (crimeTypes[crime.type] || 0) + 1
      })

      const primaryCrimeType = Object.entries(crimeTypes).sort((a, b) => b[1] - a[1])[0][0]
      const riskScore = Math.min((crimesInZone.length / crimes.length) * 100, 100)

      hotspots.push({
        id: `ZONE-${idx + 1}`,
        name: location.name,
        lat: location.lat,
        lng: location.lng,
        radius,
        riskScore,
        crimeCount: crimesInZone.length,
        predictedCrimes: Math.round(crimesInZone.length * 0.15), // 15% increase prediction
        confidence: Math.min(85 + Math.random() * 10, 95),
        primaryCrimeType,
      })
    }
  })

  return hotspots.sort((a, b) => b.riskScore - a.riskScore)
}
