"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Download } from "lucide-react"

interface ScheduleEntry {
  route: string
  busNumber: string
  destination: string
  scheduledArrival: string
  liveETA: string
  status: "on-time" | "delayed" | "early"
}

const scheduleData: ScheduleEntry[] = [
  {
    route: "Route 7",
    busNumber: "GJ-045",
    destination: "01:30 AM",
    scheduledArrival: "10:30 AM",
    liveETA: "Dalal AM",
    status: "delayed",
  },
  {
    route: "Route 7",
    busNumber: "GJ-046",
    destination: "Town B",
    scheduledArrival: "11:32 AM",
    liveETA: "Delayed",
    status: "delayed",
  },
  {
    route: "Route 2",
    busNumber: "GJ-012",
    destination: "Town B",
    scheduledArrival: "11:58 AM",
    liveETA: "Early 5min",
    status: "early",
  },
  {
    route: "Village C",
    busNumber: "Village C",
    destination: "01:30 AM",
    scheduledArrival: "10:35 AM",
    liveETA: "On Time",
    status: "on-time",
  },
]

const busStops = [
  "Village A Main Stop",
  "Route 7 Junction",
  "Town B Junction",
  "Town B Market",
  "Village C Stop",
  "City Center",
  "Central Station",
  "Main Market",
]

export function BusStopsSchedule() {
  const [selectedStop1, setSelectedStop1] = useState("Village A Main Stop")
  const [selectedStop2, setSelectedStop2] = useState("Route 7 Junction")
  const [selectedStop3, setSelectedStop3] = useState("Town B Junction")
  const [selectedStop4, setSelectedStop4] = useState("Town B Market")

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

  const getStatusColor = (liveETA: string) => {
    if (liveETA.includes("Delayed") || liveETA.includes("Dalal")) return "text-red-600"
    if (liveETA.includes("Early")) return "text-blue-600"
    if (liveETA.includes("On Time")) return "text-green-600"
    return "text-gray-600"
  }

  return (
    <div className="space-y-8">
      {/* Bus Stops Section */}
      <section>
        <h2 className="text-3xl font-bold text-[#2d7d7d] mb-8">Bus Stops</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bus Number</label>
            <Select value={selectedStop1} onValueChange={setSelectedStop1}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {busStops.map((stop) => (
                  <SelectItem key={stop} value={stop}>
                    {stop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={selectedStop2} onValueChange={setSelectedStop2}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {busStops.map((stop) => (
                  <SelectItem key={stop} value={stop}>
                    {stop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={selectedStop3} onValueChange={setSelectedStop3}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {busStops.map((stop) => (
                  <SelectItem key={stop} value={stop}>
                    {stop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={selectedStop4} onValueChange={setSelectedStop4}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {busStops.map((stop) => (
                  <SelectItem key={stop} value={stop}>
                    {stop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button className="bg-[#2d7d7d] hover:bg-[#1e5a5a] text-white">
          <FileText className="w-4 h-4 mr-2" />
          Get PDF Schedules
        </Button>
      </section>

      {/* Schedule Table Section */}
      <section>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Schedule Table */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-[#2d7d7d] mb-4">
              {selectedStop1} Bus Stop Schedule & Live Updates & Live Updates
            </h3>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Route</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Destination</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Scheduled Arrival</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Live ETA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {scheduleData.map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.route}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{entry.destination}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{entry.scheduledArrival}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={getStatusColor(entry.liveETA)}>{entry.liveETA}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="mt-4">
              <Button variant="outline" className="text-[#2d7d7d] border-[#2d7d7d] bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Get PDF Schedules
              </Button>
            </div>
          </div>

          {/* Download Section */}
          <div className="lg:w-80">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-[#2d7d7d] mb-4">Download Offline Schedules</h3>
              <p className="text-gray-600 text-sm mb-6">
                Download PDF schedules for offline access when you don't have internet connectivity.
              </p>

              <div className="space-y-3">
                <Button className="w-full bg-[#e67e22] hover:bg-[#d35400] text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Village A Routes
                </Button>
                <Button className="w-full bg-[#e67e22] hover:bg-[#d35400] text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Route 7 Schedule
                </Button>
                <Button className="w-full bg-[#e67e22] hover:bg-[#d35400] text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Town B Routes
                </Button>
                <Button className="w-full bg-[#e67e22] hover:bg-[#d35400] text-white">
                  <Download className="w-4 h-4 mr-2" />
                  All Schedules
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-2">Quick Stats</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Active Routes:</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bus Stops:</span>
                    <span className="font-medium">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Trips:</span>
                    <span className="font-medium">180</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
