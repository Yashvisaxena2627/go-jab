"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Bell, MessageSquare, Smartphone } from "lucide-react"

interface Subscription {
  id: string
  busNumber: string
  route: string
  type: "SMS" | "Push"
  status: "active" | "paused"
}

const existingSubscriptions: Subscription[] = [
  {
    id: "1",
    busNumber: "GJ-045",
    route: "Route Village A to B",
    type: "SMS",
    status: "active",
  },
  {
    id: "2",
    busNumber: "GJ-045",
    route: "Route Village A to B",
    type: "SMS",
    status: "active",
  },
  {
    id: "3",
    busNumber: "Emis ID: S1143",
    route: "",
    type: "SMS",
    status: "active",
  },
  {
    id: "4",
    busNumber: "Stop ID: 123 Have Have",
    route: "",
    type: "SMS",
    status: "active",
  },
  {
    id: "5",
    busNumber: "Cap ID: S-123",
    route: "",
    type: "SMS",
    status: "active",
  },
]

const busNumbers = ["GJ-045", "GJ-046", "GJ-047", "GJ-048", "GJ-049"]
const routes = [
  "Village A to City Center",
  "Route 7 Junction",
  "Town B Local",
  "Village C Express",
  "City Center Express",
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

export function AlertsSubscription() {
  const [formData, setFormData] = useState({
    busNumber: "",
    route: "",
    busStop: "",
    phoneNumber: "",
    pushNotification: "",
    email: "",
    alertType: "SMS" as "SMS" | "Push",
    termsAccepted: false,
  })

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(existingSubscriptions)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.termsAccepted) {
      alert("Please agree to Terms & Privacy Policy")
      return
    }

    const newSubscription: Subscription = {
      id: Date.now().toString(),
      busNumber: formData.busNumber,
      route: formData.route,
      type: formData.alertType,
      status: "active",
    }

    setSubscriptions((prev) => [...prev, newSubscription])
    setFormData({
      busNumber: "",
      route: "",
      busStop: "",
      phoneNumber: "",
      pushNotification: "",
      email: "",
      alertType: "SMS",
      termsAccepted: false,
    })
  }

  const removeSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id))
  }

  const toggleSubscription = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: sub.status === "active" ? "paused" : "active" } : sub)),
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Subscription Form */}
      <div className="lg:col-span-2">
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-[#2d7d7d] mb-6">Subscribe for Alerts & Updates</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bus Number */}
              <div>
                <Label htmlFor="busNumber" className="text-sm font-medium text-gray-700">
                  Bus Number
                </Label>
                <Select value={formData.busNumber} onValueChange={(value) => handleInputChange("busNumber", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Search" />
                  </SelectTrigger>
                  <SelectContent>
                    {busNumbers.map((number) => (
                      <SelectItem key={number} value={number}>
                        {number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Route */}
              <div>
                <Label htmlFor="route" className="text-sm font-medium text-gray-700">
                  Route
                </Label>
                <Select value={formData.route} onValueChange={(value) => handleInputChange("route", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Search" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route} value={route}>
                        {route}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bus Stop */}
            <div>
              <Label htmlFor="busStop" className="text-sm font-medium text-gray-700">
                Bus Stop
              </Label>
              <Select value={formData.busStop} onValueChange={(value) => handleInputChange("busStop", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Bus Stop" />
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

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="pushNotification" className="text-sm font-medium text-gray-700">
                  Push Notification
                </Label>
                <Input
                  id="pushNotification"
                  placeholder="Push Notification"
                  value={formData.pushNotification}
                  onChange={(e) => handleInputChange("pushNotification", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Preferred Alert Type */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Preferred Alert Type:</Label>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="sms"
                    name="alertType"
                    checked={formData.alertType === "SMS"}
                    onChange={() => handleInputChange("alertType", "SMS")}
                    className="w-4 h-4 text-[#e67e22] border-gray-300 focus:ring-[#e67e22]"
                  />
                  <Label htmlFor="sms" className="flex items-center gap-2 cursor-pointer">
                    <MessageSquare className="w-4 h-4" />
                    SMS
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="push"
                    name="alertType"
                    checked={formData.alertType === "Push"}
                    onChange={() => handleInputChange("alertType", "Push")}
                    className="w-4 h-4 text-[#e67e22] border-gray-300 focus:ring-[#e67e22]"
                  />
                  <Label htmlFor="push" className="flex items-center gap-2 cursor-pointer">
                    <Smartphone className="w-4 h-4" />
                    Push Notification
                  </Label>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) => handleInputChange("termsAccepted", checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                Agree to Terms & Privacy Policy
              </Label>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-[#e67e22] hover:bg-[#d35400] text-white py-3">
              Confirm Subscription
            </Button>
          </form>
        </Card>
      </div>

      {/* Existing Subscriptions */}
      <div>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[#2d7d7d] mb-4">Manage Existing Subscriptions</h3>
          <p className="text-sm text-gray-600 mb-6">
            This count your while listed at fatto me grinch a genjutsu ath a eid time anywhere.
          </p>

          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">
                      Bus {subscription.busNumber}
                      {subscription.route && ` - ${subscription.route}`}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        className={
                          subscription.type === "SMS" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                        }
                      >
                        {subscription.type}
                      </Badge>
                      {subscription.status === "active" && <Badge className="bg-orange-100 text-orange-800">SMS</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSubscription(subscription.id)}
                      className={
                        subscription.status === "active"
                          ? "bg-[#2d7d7d] text-white hover:bg-[#1e5a5a]"
                          : "bg-gray-500 text-white hover:bg-gray-600"
                      }
                    >
                      {subscription.status === "active" ? "Cancel" : "Resume"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSubscription(subscription.id)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {subscriptions.length === 0 && (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No active subscriptions</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
