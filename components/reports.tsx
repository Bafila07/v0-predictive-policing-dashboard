"use client"

import { Download, TrendingUp, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Reports() {
  const stats = [
    { label: "Total Crimes (This Month)", value: "3,847", trend: "+8.3%" },
    { label: "Prediction Accuracy", value: "86.5%", trend: "+2.1%" },
    { label: "Average Response Time", value: "7.8 min", trend: "-1.2 min" },
    { label: "Areas at Risk", value: "12 Zones", trend: "+3 zones" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Download Buttons */}
      <div className="flex gap-3">
        <Button className="bg-primary hover:bg-primary/80 gap-2">
          <Download size={16} />
          Download PDF
        </Button>
        <Button variant="outline" className="border-primary/30 hover:bg-primary/10 gap-2 bg-transparent">
          <Download size={16} />
          Download CSV
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glow-card rounded-lg p-6 bg-card/50">
            <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <span className={`text-sm font-semibold ${stat.trend.includes("-") ? "text-green-400" : "text-accent"}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Report Preview */}
      <div className="glow-card rounded-lg p-8 bg-card/50 space-y-6 text-foreground">
        <div>
          <h2 className="text-2xl font-bold mb-2">SURAKSHA 360 - Monthly Report</h2>
          <p className="text-sm text-muted-foreground">November 2025</p>
        </div>

        <div className="space-y-4 border-t border-border/50 pt-6">
          <div>
            <h3 className="font-semibold text-accent mb-2 flex items-center gap-2">
              <TrendingUp size={16} />
              Executive Summary
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This month's crime data shows a 8.3% increase in total incidents with notable concentration in 5 primary
              zones. AI prediction models achieved 86.5% accuracy, enabling proactive patrol deployment.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-accent mb-2 flex items-center gap-2">
              <AlertTriangle size={16} />
              Key Findings
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1 ml-6">
              <li>• Rajpur Road shows 23% increase in robbery incidents</li>
              <li>• Peak crime hours remain 6 PM - 12 AM across all zones</li>
              <li>• Optimized patrol routes reduced response time by 1.2 minutes</li>
              <li>• 12 zones currently flagged as high-risk areas</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-accent mb-2">Recommendations</h3>
            <ul className="text-sm text-muted-foreground space-y-1 ml-6">
              <li>• Increase patrol units in Rajpur Road by 5 units</li>
              <li>• Deploy AI-optimized routes during peak hours</li>
              <li>• Conduct community awareness in flagged zones</li>
              <li>• Review data for emerging crime patterns</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-4 flex justify-between text-xs text-muted-foreground">
          <p>Generated: {new Date().toLocaleDateString()}</p>
          <p>SURAKSHA 360 Command Center</p>
        </div>
      </div>
    </div>
  )
}
