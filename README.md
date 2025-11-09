# SURAKSHA 360 - AI-Powered Predictive Policing Dashboard

*Crime Hotspot Mapping & Predictive Patrol Routing System*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/priyanshu-bafilas-projects-4c03a31c/v0-predictive-policing-dashboard)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/hAfSWs2cqyt)

## Overview

SURAKSHA 360 is an advanced predictive policing command center that leverages AI-powered analytics to identify crime-prone zones, optimize patrol routes, and provide real-time insights for law enforcement. The system uses historical crime data with time and location patterns to generate dynamic risk heatmaps and intelligent patrol strategies.

### Key Features

🎯 **AI-Powered Crime Prediction**
- Time-series analysis of historical crime patterns
- Location-based hotspot identification with confidence scoring
- 24-hour ahead crime forecasting with AI reasoning
- Dynamic risk level assessment (Critical, High, Medium, Low)

🗺️ **Interactive Crime Heatmap**
- Real-time visualization of crime hotspots
- Animated risk zones with intensity gradients
- Clickable markers with detailed zone information
- Predictive overlay showing future high-risk areas

🚔 **Intelligent Patrol Route Optimization**
- Greedy nearest-neighbor algorithm with priority weighting
- Coverage optimization across multiple hotspots
- Distance and time efficiency calculations
- AI-powered patrol unit distribution by risk score

📊 **Advanced Analytics Dashboard**
- Real-time crime trend visualization
- Crime type breakdown and patterns
- Day-of-week and time-of-day analysis
- Prediction accuracy metrics

🔔 **Real-Time Alert System**
- Live crime incident feed
- Severity-based alert prioritization
- Location and time-stamped notifications

## Deployment

Your project is live at:

**[https://vercel.com/priyanshu-bafilas-projects-4c03a31c/v0-predictive-policing-dashboard](https://vercel.com/priyanshu-bafilas-projects-4c03a31c/v0-predictive-policing-dashboard)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/hAfSWs2cqyt](https://v0.app/chat/hAfSWs2cqyt)**

## Technical Architecture

### Core Algorithms

**Predictive Analytics Engine** (`lib/predictive-analytics.ts`)
- Time-series pattern matching for crime forecasting
- Clustering algorithm for hotspot identification
- Confidence scoring based on historical data consistency
- Risk heatmap generation with intensity mapping

**Patrol Route Optimizer** (`lib/patrol-routing.ts`)
- Modified nearest-neighbor algorithm with priority weighting
- Haversine formula for accurate distance calculations
- Multi-objective optimization (coverage, distance, response time)
- Dynamic patrol unit distribution based on risk scores

**Crime Data Generator** (`lib/crime-data.ts`)
- Simulated 30-day historical crime dataset
- Time-based patterns (peak hours: 6 PM - 12 AM)
- Location clustering around 8 major zones
- Crime type distribution (Theft, Robbery, Assault, Burglary, etc.)

### Tech Stack

- **Framework**: Next.js 16 with React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom OKLCH color system
- **Charts**: Recharts for data visualization
- **UI Components**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React

## Setup & Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The app will be available at `http://localhost:3000`

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   └── page.tsx            # Main page with navigation
├── components/
│   ├── dashboard.tsx       # Main dashboard with KPIs and map
│   ├── gis-map.tsx         # Interactive crime heatmap
│   ├── patrol-optimizer.tsx # Route optimization interface
│   ├── analytics.tsx       # Charts and trend analysis
│   ├── reports.tsx         # Report generation
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── crime-data.ts       # Data generation and types
│   ├── predictive-analytics.ts # Prediction algorithms
│   └── patrol-routing.ts   # Route optimization logic
└── README.md
```

## Features in Detail

### Dashboard
- **Live KPI Cards**: Total crimes, top risk zones, predictions, active hotspots
- **Interactive Map**: Click hotspots for detailed information
- **Prediction Modal**: View AI-generated forecasts with reasoning
- **Crime Clock**: 24-hour crime distribution visualization
- **Real-time Alerts**: Latest incidents with severity indicators

### Patrol Optimizer
- **Configuration Panel**: Adjust patrol units (5-50) and shift timings
- **Route Visualization**: SVG-based route map with waypoints
- **Metrics Dashboard**: Coverage score, duration, efficiency ratings
- **AI Reasoning**: Explanation of routing decisions
- **Unit Distribution**: Recommended patrol allocation per zone

### Analytics
- **Crime Trends**: Line chart showing actual vs predicted crimes
- **Type Breakdown**: Bar chart by crime category
- **Data Table**: Recent incidents with risk levels
- **Time Filters**: Day, week, month views

## AI Prediction Logic

The system uses a multi-factor approach:

1. **Historical Pattern Matching**: Analyzes crimes at similar times/locations
2. **Trend Analysis**: Compares recent (7-day) vs older (14-day) patterns
3. **Time-of-Day Weighting**: Prioritizes peak crime hours
4. **Location Clustering**: Groups nearby incidents for hotspot detection
5. **Confidence Scoring**: Based on data volume and consistency

### Prediction Output Example
```typescript
{
  location: "Rajpur Road",
  predictedCrimes: 5,
  confidence: 87,
  riskLevel: "critical",
  reasoning: [
    "Historical pattern match: 87%",
    "Upward trend detected: +15%",
    "23 similar incidents in past 30 days",
    "Peak crime hours (6 PM - 12 AM)"
  ]
}
```

## Route Optimization Algorithm

```
1. Sort hotspots by risk score (priority)
2. Start from base location (30.3165°N, 78.0322°E)
3. For each unvisited hotspot:
   - Calculate: score = priority / (distance + 0.1)
   - Select highest scoring waypoint
   - Add to route and mark as visited
4. Calculate metrics:
   - Total distance (Haversine formula)
   - Estimated duration (21 km/h avg + stay time)
   - Coverage score (waypoints / total hotspots)
   - Efficiency score (priority / distance ratio)
```

## Customization

### Modify Crime Data
Edit `lib/crime-data.ts` to adjust:
- Number of historical days
- Crime types and frequencies
- Location coordinates
- Time patterns

### Adjust Prediction Parameters
Edit `lib/predictive-analytics.ts`:
- Forecast horizon (default: 24 hours)
- Confidence thresholds
- Risk level boundaries
- Clustering distance

### Change Route Settings
Edit `lib/patrol-routing.ts`:
- Starting coordinates
- Maximum waypoints
- Average patrol speed
- Stay time per location

## Future Enhancements

- [ ] Real-time data integration via APIs
- [ ] Machine learning model training
- [ ] Weather correlation analysis
- [ ] Event-based prediction adjustments
- [ ] Multi-city support
- [ ] Mobile app integration
- [ ] Export reports to PDF
- [ ] Integration with actual mapping services (Mapbox, Google Maps)

## License

MIT License - Feel free to use and modify for your projects.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using Next.js, TypeScript, and AI-powered analytics**