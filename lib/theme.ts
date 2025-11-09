export type RiskLevel = "low" | "medium" | "high" | "critical"

interface RiskColorConfig {
  label: string
  badgeClass: string
  textClass: string
  borderClass: string
  pulseClass: string
  markerFill: string
  markerBorder: string
  gradientStops: [string, string, string]
}

export const riskPalette: Record<RiskLevel, RiskColorConfig> = {
  low: {
    label: "Low Risk",
    badgeClass: "bg-emerald-900/20",
    textClass: "text-emerald-300",
    borderClass: "border border-emerald-500/30",
    pulseClass: "bg-emerald-400/50",
    markerFill: "bg-emerald-500/80",
    markerBorder: "border-emerald-300",
    gradientStops: ["rgba(34, 197, 94, 0.6)", "rgba(34, 197, 94, 0.25)", "rgba(34, 197, 94, 0)"]
  },
  medium: {
    label: "Medium Risk",
    badgeClass: "bg-amber-900/25",
    textClass: "text-amber-300",
    borderClass: "border border-amber-400/40",
    pulseClass: "bg-amber-400/50",
    markerFill: "bg-amber-500/85",
    markerBorder: "border-amber-200",
    gradientStops: ["rgba(250, 204, 21, 0.55)", "rgba(250, 204, 21, 0.22)", "rgba(250, 204, 21, 0)"]
  },
  high: {
    label: "High Risk",
    badgeClass: "bg-red-900/30",
    textClass: "text-red-300",
    borderClass: "border border-red-400/40",
    pulseClass: "bg-red-500/50",
    markerFill: "bg-red-500/85",
    markerBorder: "border-red-300",
    gradientStops: ["rgba(248, 113, 113, 0.6)", "rgba(248, 113, 113, 0.28)", "rgba(248, 113, 113, 0)"]
  },
  critical: {
    label: "Critical Risk",
    badgeClass: "bg-red-950/40",
    textClass: "text-red-200",
    borderClass: "border border-red-500/50",
    pulseClass: "bg-red-600/60",
    markerFill: "bg-red-600/90",
    markerBorder: "border-red-200",
    gradientStops: ["rgba(185, 28, 28, 0.7)", "rgba(185, 28, 28, 0.35)", "rgba(185, 28, 28, 0)"]
  }
}

export const riskBadgeClassMap: Record<RiskLevel, string> = {
  low: `${riskPalette.low.badgeClass} ${riskPalette.low.borderClass} ${riskPalette.low.textClass}`,
  medium: `${riskPalette.medium.badgeClass} ${riskPalette.medium.borderClass} ${riskPalette.medium.textClass}`,
  high: `${riskPalette.high.badgeClass} ${riskPalette.high.borderClass} ${riskPalette.high.textClass}`,
  critical: `${riskPalette.critical.badgeClass} ${riskPalette.critical.borderClass} ${riskPalette.critical.textClass}`
}

export function getRiskLevelFromScore(score: number): RiskLevel {
  if (score >= 80) return "critical"
  if (score >= 60) return "high"
  if (score >= 35) return "medium"
  return "low"
}

export function getRiskBadgeClasses(level: RiskLevel) {
  return riskBadgeClassMap[level]
}
