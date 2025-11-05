import type { LucideIcon } from "lucide-react"

interface KpiCardProps {
  label: string
  value: string
  change: string
  icon: LucideIcon
}

export default function KpiCard({ label, value, change, icon: Icon }: KpiCardProps) {
  const isPositive = change.includes("+") || (change.includes("-") && !change.includes("Critical"))

  return (
    <div className="glow-card rounded-lg p-4 bg-card/50 border-l-2 border-l-primary">
      <div className="flex items-start justify-between mb-2">
        <Icon size={16} className="text-primary" />
        <span
          className={`text-xs font-semibold ${isPositive && change.includes("-") ? "text-green-400" : "text-accent"}`}
        >
          {change}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  )
}
