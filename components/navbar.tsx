"use client"

import { User } from "lucide-react"

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
    <nav className="fixed top-0 w-full bg-card border-b border-border/50 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">SURAKSHA 360</h1>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setCurrentPage(pageMap[item as keyof typeof pageMap])}
              className={`text-sm font-medium transition-colors ${
                currentPage === pageMap[item as keyof typeof pageMap]
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* User */}
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <User size={20} className="text-foreground" />
        </button>
      </div>
    </nav>
  )
}
