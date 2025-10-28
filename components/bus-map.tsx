"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { initialBusData, simulateBusMovement, type BusData } from "@/lib/bus-data"

const BusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 6V4C8 3.45 8.45 3 9 3H15C15.55 3 16 3.45 16 4V6H18C19.1 6 20 6.9 20 8V15C20 15.55 19.55 16 19 16H18V17C18 17.55 17.55 18 17 18H16C15.45 18 15 17.55 15 17V16H9V17C9 17.55 8.55 18 8 18H7C6.45 18 6 17.55 6 17V16H5C4.45 16 4 15.55 4 15V8C4 6.9 4.9 6 6 6H8ZM7.5 13C8.33 13 9 12.33 9 11.5S8.33 10 7.5 10 6 10.67 6 11.5 6.67 13 7.5 13ZM16.5 13C17.33 13 18 12.33 18 11.5S17.33 10 16.5 10 15 10.67 15 11.5 15.67 13 16.5 13Z"
      fill="currentColor"
    />
  </svg>
)

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 21V19C16 17.9 15.1 17 14 17H6C4.9 17 4 17.9 4 19V21" stroke="currentColor" strokeWidth="2" />
    <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    <path d="M22 21V19C22 18.1 21.3 17.4 20.4 17.1" stroke="currentColor" strokeWidth="2" />
    <path d="M16 3.1C16.9 3.4 17.6 4.1 17.6 5S16.9 6.6 16 6.9" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.03 7.03 1 12 1S21 5.03 21 10Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const WifiIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12.55C6.4 11.15 8.15 10.4 10 10.4S13.6 11.15 15 12.55" stroke="currentColor" strokeWidth="2" />
    <path d="M1.42 9C4.58 5.84 9.18 4.23 14 4.23S23.42 5.84 26.58 9" stroke="currentColor" strokeWidth="2" />
    <path
      d="M8.53 16.11C9.37 15.27 10.68 14.86 12 14.86S14.63 15.27 15.47 16.11"
      stroke="currentColor"
      strokeWidth="2"
    />
    <line x1="12" y1="20" x2="12.01" y2="20" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const WifiOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" />
    <path d="M16.72 11.06C19.39 13.19 21 16.84 21 20.85" stroke="currentColor" strokeWidth="2" />
    <path d="M7 3.34C8.6 2.9 10.25 2.7 12 2.7C16.97 2.7 21.54 4.24 25 7" stroke="currentColor" strokeWidth="2" />
    <path d="M10.71 5.05C11.14 5.02 11.57 5 12 5C15.5 5 18.54 6.29 21 8.5" stroke="currentColor" strokeWidth="2" />
    <path d="M7.5 10.5C8.21 9.92 9.05 9.55 10 9.55" stroke="currentColor" strokeWidth="2" />
  </svg>
)

export function BusMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [buses, setBuses] = useState<BusData[]>(initialBusData)
  const [selectedBus, setSelectedBus] = useState<BusData | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [isLive, setIsLive] = useState(true)

  // Initialize Leaflet map
  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current && !map) {
      const L = require("leaflet")

      // Fix for default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })

      const newMap = L.map(mapRef.current).setView([23.0325, 72.5814], 12)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(newMap)

      setMap(newMap)
    }
  }, [map])

  // Update bus markers
  useEffect(() => {
    if (map && typeof window !== "undefined") {
      const L = require("leaflet")

      // Clear existing markers
      markers.forEach((marker) => map.removeLayer(marker))

      const newMarkers = buses
        .filter((bus) => filter === "all" || bus.occupancy === filter)
        .map((bus) => {
          const occupancyColor = {
            low: "#22c55e",
            medium: "#f59e0b",
            high: "#ef4444",
          }[bus.occupancy]

          const busIcon = L.divIcon({
            html: `
              <div style="
                background-color: ${occupancyColor};
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 3px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                font-size: 14px;
                color: white;
                font-weight: bold;
                position: relative;
              ">
                🚌
                <div style="
                  position: absolute;
                  top: -8px;
                  right: -8px;
                  width: 12px;
                  height: 12px;
                  background-color: ${isLive ? "#22c55e" : "#ef4444"};
                  border-radius: 50%;
                  border: 2px solid white;
                "></div>
              </div>
            `,
            className: "custom-bus-icon",
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          })

          const marker = L.marker([bus.lat, bus.lng], { icon: busIcon })
            .addTo(map)
            .on("click", () => setSelectedBus(bus))

          return marker
        })

      setMarkers(newMarkers)
    }
  }, [map, buses, filter, isLive])

  // Enhanced real-time simulation
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setBuses((prevBuses) => prevBuses.map(simulateBusMovement))
    }, 3000) // Update every 3 seconds for more realistic tracking

    return () => clearInterval(interval)
  }, [isLive])

  const getOccupancyBadge = (occupancy: string) => {
    const variants = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    }
    return (
      <Badge className={variants[occupancy as keyof typeof variants]}>
        {occupancy.charAt(0).toUpperCase() + occupancy.slice(1)}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      "on-time": "bg-green-100 text-green-800",
      delayed: "bg-red-100 text-red-800",
      early: "bg-blue-100 text-blue-800",
    }
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status === "on-time" ? "On Time" : status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2d7d7d] mb-2">Live Bus Tracking</h2>
          <div className="flex items-center gap-2">
            <p className="text-gray-600">Real-time bus locations and status updates</p>
            {isLive ? (
              <div className="flex items-center gap-1 text-green-600">
                <WifiIcon />
                <span className="text-sm">Live</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600">
                <WifiOffIcon />
                <span className="text-sm">Offline</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant={isLive ? "default" : "outline"}
            onClick={() => setIsLive(!isLive)}
            className={isLive ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isLive ? "Live Mode" : "Paused"}
          </Button>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by occupancy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Buses ({buses.length})</SelectItem>
              <SelectItem value="low">Low Occupancy</SelectItem>
              <SelectItem value="medium">Medium Occupancy</SelectItem>
              <SelectItem value="high">High Occupancy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            <div ref={mapRef} className="w-full h-[500px] rounded-lg" style={{ minHeight: "500px" }} />
          </Card>
        </div>

        {/* Bus Details Sidebar */}
        <div className="space-y-4">
          {selectedBus ? (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#2d7d7d]">Bus Details</h3>
                <Button variant="outline" size="sm" onClick={() => setSelectedBus(null)}>
                  Close
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BusIcon />
                    <span className="font-semibold">{selectedBus.number}</span>
                  </div>
                  <p className="text-sm text-gray-600">{selectedBus.route}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Occupancy</p>
                    {getOccupancyBadge(selectedBus.occupancy)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    {getStatusBadge(selectedBus.status)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UsersIcon />
                    <span className="text-sm">
                      {selectedBus.passengers}/{selectedBus.capacity} passengers
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon />
                    <span className="text-sm">Next: {selectedBus.nextStop}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon />
                    <span className="text-sm">ETA: {selectedBus.eta}</span>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Speed:</span>
                    <span>{selectedBus.speed} km/h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Driver:</span>
                    <span>{selectedBus.driver}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Conductor:</span>
                    <span>{selectedBus.conductor}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Updated:</span>
                    <span>{selectedBus.lastUpdated.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-[#2d7d7d] mb-2">Select a Bus</h3>
              <p className="text-gray-600 text-sm">
                Click on any bus marker on the map to view detailed information including driver details and real-time
                status.
              </p>
            </Card>
          )}

          {/* Live Bus List */}
          <Card className="p-4">
            <h3 className="font-semibold text-[#2d7d7d] mb-4">
              Active Buses ({buses.filter((bus) => filter === "all" || bus.occupancy === filter).length})
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {buses
                .filter((bus) => filter === "all" || bus.occupancy === filter)
                .map((bus) => (
                  <div
                    key={bus.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setSelectedBus(bus)}
                  >
                    <div>
                      <p className="font-medium text-sm">{bus.number}</p>
                      <p className="text-xs text-gray-600">{bus.nextStop}</p>
                    </div>
                    <div className="text-right">
                      {getOccupancyBadge(bus.occupancy)}
                      <p className="text-xs text-gray-600 mt-1">{bus.eta}</p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
