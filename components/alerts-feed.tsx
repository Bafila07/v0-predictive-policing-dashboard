export default function AlertsFeed() {
  const alerts = [
    { id: 1, type: "Robbery", location: "MG Road", time: "2 min ago", severity: "critical" },
    { id: 2, type: "Theft", location: "Rajpur Rd", time: "8 min ago", severity: "high" },
    { id: 3, type: "Assault", location: "Brigade Road", time: "15 min ago", severity: "high" },
    { id: 4, type: "Traffic Violation", location: "Whitefield", time: "22 min ago", severity: "medium" },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-900/20 border-l-2 border-l-red-500 text-red-200"
      case "high":
        return "bg-yellow-900/20 border-l-2 border-l-yellow-500 text-yellow-200"
      default:
        return "bg-blue-900/20 border-l-2 border-l-blue-500 text-blue-200"
    }
  }

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {alerts.map((alert) => (
        <div key={alert.id} className={`p-3 rounded ${getSeverityColor(alert.severity)}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-sm">{alert.type}</p>
              <p className="text-xs opacity-75">{alert.location}</p>
            </div>
            <span className="text-xs opacity-75">{alert.time}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
