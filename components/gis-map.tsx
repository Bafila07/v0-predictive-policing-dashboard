export default function GisMap() {
  return (
    <div className="glow-card rounded-lg p-6 bg-card/50 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">Live GIS Map</h3>
        <div className="flex gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-900/30 text-red-300 border border-red-500/30">
            High Risk
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-900/30 text-yellow-300 border border-yellow-500/30">
            Medium
          </span>
        </div>
      </div>

      {/* Placeholder Map */}
      <div className="w-full h-96 bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg border border-border/30 flex items-center justify-center relative overflow-hidden">
        {/* Grid Background */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgb(148 163 184)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>

        {/* Crime Hotspots */}
        <div className="absolute inset-0 flex items-center justify-center gap-20">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center animate-pulse">
              <div className="text-white text-sm font-semibold">High Risk Zone</div>
            </div>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-yellow-600/20 border-2 border-yellow-500 flex items-center justify-center">
              <div className="text-white text-xs font-semibold">Medium Zone</div>
            </div>
          </div>
        </div>

        <p className="absolute bottom-4 left-4 text-xs text-muted-foreground">Mapbox Integration Placeholder</p>
      </div>
    </div>
  )
}
