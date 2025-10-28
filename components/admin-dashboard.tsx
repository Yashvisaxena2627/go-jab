"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { initialBusData, simulateBusMovement, generateRealtimeEvents, type BusData } from "@/lib/bus-data"
import GoogleBusMap from "@/components/google-bus-map"

const BusIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10z" />
    <circle cx="6.5" cy="15.5" r="1.5" />
    <circle cx="17.5" cy="15.5" r="1.5" />
    <path d="M6 6h12v6H6z" />
  </svg>
)

const MapPinIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const RouteIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
    />
  </svg>
)

const BarChart3Icon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
)

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-5 5v-5zM4.868 19.462A17.173 17.173 0 0012 20c7.18 0 13.658-1.083 19.032-2.868a1 1 0 00.386-1.448L18.236 2.468a1 1 0 00-1.618-.362L4.236 18.468a1 1 0 00.632 1.994z"
    />
  </svg>
)

const LogOutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
)

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const ActivityIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
)

export function AdminDashboard() {
  const [buses, setBuses] = useState<BusData[]>(initialBusData)
  const [filter, setFilter] = useState<string>("all")
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, message: "Route 3 added", time: "2 hours ago", type: "info" },
    { id: 2, message: "Bus GJ-045 reported minor delay", time: "1 hour ago", type: "warning" },
    { id: 3, message: "New subscriber for Route 7", time: "30 minutes ago", type: "success" },
  ])

  useEffect(() => {
    const busInterval = setInterval(() => {
      setBuses((prevBuses) => prevBuses.map(simulateBusMovement))
    }, 4000) // Update every 4 seconds

    const activityInterval = setInterval(() => {
      const newEvent = generateRealtimeEvents()
      setRecentActivities((prev) => [newEvent, ...prev.slice(0, 4)]) // Keep only 5 most recent
    }, 15000) // New activity every 15 seconds

    return () => {
      clearInterval(busInterval)
      clearInterval(activityInterval)
    }
  }, [])

  const stats = {
    activeBuses: buses.length,
    totalRoutes: new Set(buses.map((bus) => bus.route)).size * 3000, // Simulated total routes
    subscribers: 1000 + Math.floor(Math.random() * 100), // Simulated growing subscribers
    averageDelay: Math.floor(Math.random() * 10) + 3, // Dynamic average delay
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        {/* Logo */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#2d7d7d] rounded-full flex items-center justify-center">
              <BusIcon />
            </div>
            <div>
              <span className="text-lg font-bold text-[#2d7d7d]">GO-</span>
              <span className="text-lg font-bold text-[#e67e22]">JAB</span>
              <div className="text-xs text-gray-500">BUS & TRAVEL</div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <UserIcon />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Go-Jaub</p>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <div className="bg-[#2d7d7d] text-white rounded-lg p-3 flex items-center space-x-3">
            <BarChart3Icon />
            <span className="font-medium">Bus Tracking Overview</span>
          </div>
          <div className="text-gray-600 hover:bg-gray-100 rounded-lg p-3 flex items-center space-x-3 cursor-pointer">
            <UserIcon />
            <span>Manage Routes</span>
          </div>
          <div className="text-gray-600 hover:bg-gray-100 rounded-lg p-3 flex items-center space-x-3 cursor-pointer">
            <RouteIcon />
            <span>Manage Routes</span>
          </div>
          <div className="text-gray-600 hover:bg-gray-100 rounded-lg p-3 flex items-center space-x-3 cursor-pointer">
            <MapPinIcon />
            <span>Manage Stops</span>
          </div>
          <div className="text-gray-600 hover:bg-gray-100 rounded-lg p-3 flex items-center space-x-3 cursor-pointer">
            <BellIcon />
            <span>Manage Alerts</span>
          </div>
          <div className="text-gray-600 hover:bg-gray-100 rounded-lg p-3 flex items-center space-x-3 cursor-pointer">
            <BarChart3Icon />
            <span>Analytics</span>
          </div>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="outline" className="w-full justify-start text-gray-600 bg-transparent">
            <LogOutIcon />
            <span className="ml-2">Logout</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <UserIcon />
              <Button variant="outline" className="text-[#2d7d7d] border-[#2d7d7d] bg-transparent">
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Enhanced Stats Cards with real-time updates */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-[#2d7d7d] mb-2 flex items-center justify-center gap-2">
                {stats.activeBuses}
                <ActivityIcon />
              </div>
              <div className="text-sm text-gray-600">Active Buses</div>
            </Card>
            <Card className="p-6 text-center border-b-4 border-[#2d7d7d]">
              <div className="text-2xl font-bold text-[#2d7d7d] mb-2">{stats.totalRoutes.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Routes</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-[#2d7d7d] mb-2">{stats.subscribers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Subscribers</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-[#2d7d7d] mb-2">{stats.averageDelay} min</div>
              <div className="text-sm text-gray-600">Average Delay</div>
            </Card>
          </div>

          {/* Map and Filter */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#2d7d7d]">Live Bus Tracking</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Filter:</span>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Filter</SelectItem>
                    <SelectItem value="low">Low Occupancy</SelectItem>
                    <SelectItem value="medium">Medium Occupancy</SelectItem>
                    <SelectItem value="high">High Occupancy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <GoogleBusMap
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              center={{ lat: 28.6139, lng: 77.209 }}
              zoom={12}
            />
          </div>

          {/* Enhanced Recent Activity with real-time updates */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#2d7d7d]">Recent Activity & Alerts</h3>
              <div className="flex items-center gap-2 text-green-600">
                <ActivityIcon />
                <span className="text-sm">Live Updates</span>
              </div>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "warning"
                        ? "bg-yellow-500"
                        : activity.type === "success"
                          ? "bg-green-500"
                          : "bg-[#2d7d7d]"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
