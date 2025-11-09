"use client"

import { User, Shield, Activity } from "lucide-react"

interface NavbarProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

export default function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  const navItems = ["Dashboard", "Analytics", "Patrol Optimizer", "Reports"]
  const pageMap = {
    Dashboard: "dashboard",
    Analytics: "analytics",
    "Patrol Optimizer": "patrol",
    Reports: "reports",
  }

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-r from-card via-card/95 to-card border-b border-primary/20 backdrop-blur-md z-50 shadow-lg shadow-primary/10">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 animate-slide-in-right">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 transition-transform duration-300 hover:scale-110">
              <Shield size={20} className="text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              SURAKSHA 360
              <span className="text-xs font-normal text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/30">AI</span>
            </h1>
            <p className="text-xs text-muted-foreground -mt-0.5">Predictive Policing Command Center</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-1 bg-secondary/30 rounded-lg p-1 backdrop-blur-sm">
          {navItems.map((item, idx) => (
            <button
              key={item}
              onClick={() => setCurrentPage(pageMap[item as keyof typeof pageMap])}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                currentPage === pageMap[item as keyof typeof pageMap]
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Status & User */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
            <Activity size={14} className="text-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-300">LIVE</span>
          </div>
          <button className="p-2 hover:bg-secondary rounded-lg transition-all duration-300 hover:scale-105 group">
            <User size={20} className="text-foreground group-hover:text-primary transition-colors" />
          </button>
        </div>
      </div>
    </nav>
  )
}
