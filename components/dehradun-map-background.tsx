export default function DehradunMapBackground() {
  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Beautiful Static Map Background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 60%),
            linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)
          `,
          backgroundSize: 'cover'
        }}
      />
      
      {/* Topographic pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 35px,
            rgba(148, 163, 184, 0.3) 35px,
            rgba(148, 163, 184, 0.3) 36px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 35px,
            rgba(148, 163, 184, 0.3) 35px,
            rgba(148, 163, 184, 0.3) 36px
          )`
        }}
      />
      
      {/* Decorative SVG overlay with city elements */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
      <defs>
        {/* Gradient for roads */}
        <linearGradient id="road-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.4" />
        </linearGradient>
        
        {/* Glow effect for markers */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background base */}
      <rect width="100" height="100" fill="transparent" />
      
      {/* Major Roads - Rajpur Road (vertical) */}
      <path
        d="M 35 0 L 35 100"
        stroke="#334155"
        strokeWidth="1.5"
        fill="none"
        opacity="0.8"
      />
      
      {/* Clock Tower Road (horizontal) */}
      <path
        d="M 0 45 L 100 45"
        stroke="#334155"
        strokeWidth="1.5"
        fill="none"
        opacity="0.8"
      />
      
      {/* Mall Road (diagonal) */}
      <path
        d="M 20 20 L 80 80"
        stroke="#334155"
        strokeWidth="1.2"
        fill="none"
        opacity="0.7"
      />
      
      {/* Saharanpur Road */}
      <path
        d="M 0 30 L 100 35"
        stroke="#334155"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      
      {/* Haridwar Road */}
      <path
        d="M 50 0 L 50 100"
        stroke="#334155"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      
      {/* Ring Road */}
      <ellipse
        cx="50"
        cy="50"
        rx="35"
        ry="30"
        stroke="#334155"
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />
      
      {/* Paltan Bazaar area */}
      <rect
        x="30"
        y="40"
        width="15"
        height="12"
        fill="#1e293b"
        opacity="0.6"
      />
      
      {/* Parade Ground */}
      <circle
        cx="42"
        cy="55"
        r="5"
        fill="#0f4c3a"
        opacity="0.4"
      />
      
      {/* Railway Station area */}
      <rect
        x="60"
        y="60"
        width="12"
        height="8"
        fill="#1e293b"
        opacity="0.6"
      />
      
      {/* ISBT area */}
      <rect
        x="65"
        y="35"
        width="10"
        height="8"
        fill="#1e293b"
        opacity="0.6"
      />
      
      {/* Residential blocks */}
      <rect x="15" y="15" width="8" height="8" fill="#1e293b" opacity="0.4" />
      <rect x="70" y="20" width="8" height="8" fill="#1e293b" opacity="0.4" />
      <rect x="20" y="70" width="8" height="8" fill="#1e293b" opacity="0.4" />
      <rect x="75" y="75" width="8" height="8" fill="#1e293b" opacity="0.4" />
      
      {/* Green spaces */}
      <circle cx="25" cy="60" r="4" fill="#0f4c3a" opacity="0.3" />
      <circle cx="70" cy="50" r="4" fill="#0f4c3a" opacity="0.3" />
      
      {/* Location markers with labels */}
      <g opacity="0.8" filter="url(#glow)">
        {/* Clock Tower */}
        <circle cx="35" cy="45" r="1.5" fill="#f59e0b" />
        <text x="37" y="44" fontSize="2.5" fill="#f59e0b" fontWeight="bold">Clock Tower</text>
        
        {/* Rajpur Road */}
        <circle cx="35" cy="25" r="1.5" fill="#f59e0b" />
        <text x="37" y="24" fontSize="2.5" fill="#f59e0b" fontWeight="bold">Rajpur Rd</text>
        
        {/* Paltan Bazaar */}
        <circle cx="37" cy="46" r="1.5" fill="#f59e0b" />
        <text x="39" y="48" fontSize="2.5" fill="#f59e0b" fontWeight="bold">Paltan Bazaar</text>
        
        {/* Mall Road */}
        <circle cx="30" cy="35" r="1.5" fill="#f59e0b" />
        <text x="32" y="34" fontSize="2.5" fill="#f59e0b" fontWeight="bold">Mall Rd</text>
        
        {/* Railway Station */}
        <circle cx="66" cy="64" r="1.5" fill="#f59e0b" />
        <text x="68" y="63" fontSize="2.5" fill="#f59e0b" fontWeight="bold">Railway Stn</text>
        
        {/* ISBT */}
        <circle cx="70" cy="39" r="1.5" fill="#f59e0b" />
        <text x="72" y="38" fontSize="2.5" fill="#f59e0b" fontWeight="bold">ISBT</text>
      </g>
      
      {/* Grid overlay */}
      <defs>
        <pattern id="dehradun-grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#dehradun-grid)" opacity="0.3" />
      
      {/* City boundary */}
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        stroke="#475569"
        strokeWidth="0.5"
        fill="none"
        opacity="0.4"
      />
      
      {/* Compass */}
      <g transform="translate(90, 10)">
        <circle cx="0" cy="0" r="3" fill="#1e293b" opacity="0.8" />
        <path d="M 0 -2.5 L 0.5 0 L 0 2.5 L -0.5 0 Z" fill="#ef4444" />
        <text x="0" y="-4" fontSize="2" fill="#ef4444" textAnchor="middle" fontWeight="bold">N</text>
      </g>
      
      {/* City label */}
      <text
        x="50"
        y="95"
        fontSize="4"
        fill="#64748b"
        textAnchor="middle"
        fontWeight="bold"
        opacity="0.6"
      >
        DEHRADUN CITY
      </text>
    </svg>
    </div>
  )
}
