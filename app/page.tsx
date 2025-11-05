"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Dashboard from "@/components/dashboard"
import Analytics from "@/components/analytics"
import PatrolOptimizer from "@/components/patrol-optimizer"
import Reports from "@/components/reports"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard")

  const renderPage = () => {
    switch (currentPage) {
      case "analytics":
        return <Analytics />
      case "patrol":
        return <PatrolOptimizer />
      case "reports":
        return <Reports />
      default:
        return <Dashboard />
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="pt-20">{renderPage()}</div>
    </main>
  )
}
