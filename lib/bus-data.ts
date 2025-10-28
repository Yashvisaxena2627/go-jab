export interface BusData {
  id: string
  number: string
  route: string
  lat: number
  lng: number
  occupancy: "low" | "medium" | "high"
  passengers: number
  capacity: number
  speed: number
  nextStop: string
  eta: string
  status: "on-time" | "delayed" | "early"
  driver: string
  conductor: string
  lastUpdated: Date
}

export interface RouteStop {
  name: string
  lat: number
  lng: number
  order: number
}

export const routes: Record<string, RouteStop[]> = {
  "Village A to City Center": [
    { name: "Village A Main Stop", lat: 23.0225, lng: 72.5714, order: 1 },
    { name: "Main Market", lat: 23.0275, lng: 72.5764, order: 2 },
    { name: "Town Junction", lat: 23.0325, lng: 72.5814, order: 3 },
    { name: "City Center", lat: 23.0375, lng: 72.5864, order: 4 },
  ],
  "Route 7 Junction": [
    { name: "Route 7 Start", lat: 23.0325, lng: 72.5814, order: 1 },
    { name: "Town B Market", lat: 23.0375, lng: 72.5864, order: 2 },
    { name: "Town B Junction", lat: 23.0425, lng: 72.5914, order: 3 },
  ],
  "Village C Express": [
    { name: "Village C Stop", lat: 23.0125, lng: 72.5614, order: 1 },
    { name: "Highway Junction", lat: 23.0175, lng: 72.5664, order: 2 },
    { name: "Express Terminal", lat: 23.0225, lng: 72.5714, order: 3 },
  ],
  "Town B Local": [
    { name: "Town B Junction", lat: 23.0425, lng: 72.5914, order: 1 },
    { name: "Local Market", lat: 23.0475, lng: 72.5964, order: 2 },
    { name: "Residential Area", lat: 23.0525, lng: 72.6014, order: 3 },
  ],
  "City Center Express": [
    { name: "Central Station", lat: 23.0525, lng: 72.6014, order: 1 },
    { name: "Business District", lat: 23.0475, lng: 72.5964, order: 2 },
    { name: "Shopping Mall", lat: 23.0425, lng: 72.5914, order: 3 },
    { name: "City Center", lat: 23.0375, lng: 72.5864, order: 4 },
  ],
}

export const initialBusData: BusData[] = [
  {
    id: "1",
    number: "GJ-045",
    route: "Village A to City Center",
    lat: 23.0225,
    lng: 72.5714,
    occupancy: "medium",
    passengers: 25,
    capacity: 40,
    speed: 35,
    nextStop: "Main Market",
    eta: "5 min",
    status: "on-time",
    driver: "Rajesh Patel",
    conductor: "Amit Shah",
    lastUpdated: new Date(),
  },
  {
    id: "2",
    number: "GJ-046",
    route: "Route 7 Junction",
    lat: 23.0325,
    lng: 72.5814,
    occupancy: "high",
    passengers: 38,
    capacity: 40,
    speed: 25,
    nextStop: "Town B Market",
    eta: "8 min",
    status: "delayed",
    driver: "Suresh Kumar",
    conductor: "Vikram Singh",
    lastUpdated: new Date(),
  },
  {
    id: "3",
    number: "GJ-047",
    route: "Village C Express",
    lat: 23.0125,
    lng: 72.5614,
    occupancy: "low",
    passengers: 12,
    capacity: 35,
    speed: 40,
    nextStop: "Highway Junction",
    eta: "3 min",
    status: "early",
    driver: "Mahesh Joshi",
    conductor: "Ravi Sharma",
    lastUpdated: new Date(),
  },
  {
    id: "4",
    number: "GJ-048",
    route: "Town B Local",
    lat: 23.0425,
    lng: 72.5914,
    occupancy: "medium",
    passengers: 22,
    capacity: 30,
    speed: 30,
    nextStop: "Local Market",
    eta: "12 min",
    status: "on-time",
    driver: "Dinesh Patel",
    conductor: "Kiran Modi",
    lastUpdated: new Date(),
  },
  {
    id: "5",
    number: "GJ-049",
    route: "City Center Express",
    lat: 23.0525,
    lng: 72.6014,
    occupancy: "high",
    passengers: 45,
    capacity: 50,
    speed: 20,
    nextStop: "Business District",
    eta: "15 min",
    status: "delayed",
    driver: "Prakash Desai",
    conductor: "Nilesh Rao",
    lastUpdated: new Date(),
  },
  {
    id: "6",
    number: "GJ-050",
    route: "Village A to City Center",
    lat: 23.0275,
    lng: 72.5764,
    occupancy: "low",
    passengers: 8,
    capacity: 40,
    speed: 45,
    nextStop: "Town Junction",
    eta: "6 min",
    status: "early",
    driver: "Ashok Mehta",
    conductor: "Jignesh Patel",
    lastUpdated: new Date(),
  },
  {
    id: "7",
    number: "GJ-051",
    route: "Route 7 Junction",
    lat: 23.0375,
    lng: 72.5864,
    occupancy: "medium",
    passengers: 28,
    capacity: 40,
    speed: 32,
    nextStop: "Town B Junction",
    eta: "10 min",
    status: "on-time",
    driver: "Bharat Shah",
    conductor: "Chirag Vyas",
    lastUpdated: new Date(),
  },
  {
    id: "8",
    number: "GJ-052",
    route: "Village C Express",
    lat: 23.0175,
    lng: 72.5664,
    occupancy: "high",
    passengers: 32,
    capacity: 35,
    speed: 38,
    nextStop: "Express Terminal",
    eta: "4 min",
    status: "on-time",
    driver: "Gopal Rana",
    conductor: "Hardik Joshi",
    lastUpdated: new Date(),
  },
]

export function simulateBusMovement(bus: BusData): BusData {
  const route = routes[bus.route]
  if (!route) return bus

  // Simulate movement along route
  const movementFactor = 0.0005 // Smaller movements for more realistic tracking
  const speedVariation = Math.random() * 10 - 5 // ±5 km/h variation
  const passengerChange = Math.floor(Math.random() * 6) - 3 // ±3 passengers

  // Update position slightly towards next stop
  const currentStopIndex = route.findIndex((stop) => stop.name === bus.nextStop)
  if (currentStopIndex > 0) {
    const targetStop = route[currentStopIndex]
    const latDiff = targetStop.lat - bus.lat
    const lngDiff = targetStop.lng - bus.lng

    // Move towards target stop
    const newLat = bus.lat + latDiff * movementFactor * (bus.speed / 40)
    const newLng = bus.lng + lngDiff * movementFactor * (bus.speed / 40)

    // Check if reached stop and update next stop
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff)
    let nextStop = bus.nextStop
    if (distance < 0.002 && currentStopIndex < route.length - 1) {
      nextStop = route[currentStopIndex + 1].name
    }

    return {
      ...bus,
      lat: newLat,
      lng: newLng,
      speed: Math.max(10, Math.min(50, bus.speed + speedVariation)),
      passengers: Math.max(0, Math.min(bus.capacity, bus.passengers + passengerChange)),
      occupancy: getOccupancyLevel(Math.max(0, Math.min(bus.capacity, bus.passengers + passengerChange)), bus.capacity),
      nextStop,
      eta: generateETA(),
      status: generateStatus(),
      lastUpdated: new Date(),
    }
  }

  return {
    ...bus,
    lat: bus.lat + (Math.random() - 0.5) * movementFactor,
    lng: bus.lng + (Math.random() - 0.5) * movementFactor,
    speed: Math.max(10, Math.min(50, bus.speed + speedVariation)),
    passengers: Math.max(0, Math.min(bus.capacity, bus.passengers + passengerChange)),
    occupancy: getOccupancyLevel(Math.max(0, Math.min(bus.capacity, bus.passengers + passengerChange)), bus.capacity),
    eta: generateETA(),
    status: generateStatus(),
    lastUpdated: new Date(),
  }
}

function getOccupancyLevel(passengers: number, capacity: number): "low" | "medium" | "high" {
  const ratio = passengers / capacity
  if (ratio < 0.4) return "low"
  if (ratio < 0.8) return "medium"
  return "high"
}

function generateETA(): string {
  const minutes = Math.floor(Math.random() * 20) + 1
  return `${minutes} min`
}

function generateStatus(): "on-time" | "delayed" | "early" {
  const rand = Math.random()
  if (rand < 0.6) return "on-time"
  if (rand < 0.85) return "delayed"
  return "early"
}

export function generateRealtimeEvents() {
  const events = [
    "New route added to network",
    "Bus maintenance completed",
    "Traffic alert on main highway",
    "New subscriber joined alerts",
    "Route schedule updated",
    "Bus breakdown reported",
    "Peak hour traffic detected",
    "Weather alert issued",
  ]

  return {
    id: Date.now(),
    message: events[Math.floor(Math.random() * events.length)],
    time: "Just now",
    type: Math.random() > 0.7 ? "warning" : Math.random() > 0.5 ? "success" : "info",
  }
}
