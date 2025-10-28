"use client"

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    google: any
  }
}

interface Bus {
  id: string
  number: string
  route: string
  lat: number
  lng: number
  heading: number
  passengers: number
  capacity: number
  status: "on-time" | "delayed" | "early"
  nextStop: string
  eta: string
  driver: string
  speed: number
  routePath: { lat: number; lng: number }[]
  currentPathIndex: number
  startTime: Date
  estimatedArrival: Date
}

interface GoogleBusMapProps {
  apiKey?: string
  center?: { lat: number; lng: number }
  zoom?: number
}

const punjabCities = [
  { name: "Chandigarh", lat: 30.7333, lng: 76.7794 },
  { name: "Ludhiana", lat: 30.901, lng: 75.8573 },
  { name: "Amritsar", lat: 31.634, lng: 74.8723 },
  { name: "Jalandhar", lat: 31.326, lng: 75.5762 },
  { name: "Patiala", lat: 30.3398, lng: 76.3869 },
  { name: "Bathinda", lat: 30.211, lng: 74.9455 },
  { name: "Mohali", lat: 30.7046, lng: 76.7179 },
  { name: "Hoshiarpur", lat: 31.5204, lng: 75.9119 },
  { name: "Kapurthala", lat: 31.38, lng: 75.38 },
  { name: "Moga", lat: 30.8158, lng: 75.1723 },
  { name: "Sangrur", lat: 30.2458, lng: 75.8421 },
  { name: "Gurdaspur", lat: 32.0409, lng: 75.4065 },
  { name: "Tarn Taran", lat: 31.4526, lng: 74.9265 },
  { name: "Barnala", lat: 30.3742, lng: 75.5462 },
  { name: "Faridkot", lat: 30.6704, lng: 74.7431 },
  { name: "Firozpur", lat: 30.9324, lng: 74.615 },
  { name: "Muktsar", lat: 30.4762, lng: 74.5169 },
  { name: "Nawanshahr", lat: 31.1242, lng: 76.1162 },
  { name: "Ropar", lat: 30.9697, lng: 76.5194 },
  { name: "Mansa", lat: 29.9988, lng: 75.3932 },
]

export default function GoogleBusMap({
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  center = { lat: 30.7333, lng: 76.7794 }, // Chandigarh - center of Punjab region
  zoom = 10, // Adjusted zoom for Chandigarh area view
}: GoogleBusMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [buses, setBuses] = useState<Bus[]>([])
  const [filteredBuses, setFilteredBuses] = useState<Bus[]>([])
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  const punjabRoadRoutes = [
    // GT Road (Grand Trunk Road) - Major highway with very precise coordinates
    {
      from: "Chandigarh",
      to: "Ludhiana",
      path: [
        { lat: 30.7333, lng: 76.7794 }, // Chandigarh Bus Stand
        { lat: 30.728, lng: 76.765 }, // Sector 17
        { lat: 30.7046, lng: 76.7179 }, // Mohali
        { lat: 30.6942, lng: 76.6213 }, // Kharar
        { lat: 30.68, lng: 76.58 }, // Kurali Road
        { lat: 30.6542, lng: 76.5213 }, // Kurali
        { lat: 30.63, lng: 76.48 }, // Morinda Road
        { lat: 30.6142, lng: 76.4213 }, // Morinda
        { lat: 30.59, lng: 76.38 }, // Samrala Road
        { lat: 30.5742, lng: 76.3213 }, // Samrala
        { lat: 30.55, lng: 76.28 }, // Khanna Road
        { lat: 30.5342, lng: 76.2213 }, // Khanna
        { lat: 30.92, lng: 75.9 }, // Ludhiana Outskirts
        { lat: 30.901, lng: 75.8573 }, // Ludhiana
      ],
    },
    {
      from: "Ludhiana",
      to: "Jalandhar",
      path: [
        { lat: 30.901, lng: 75.8573 }, // Ludhiana
        { lat: 30.91, lng: 75.84 }, // Ludhiana GT Road
        { lat: 30.921, lng: 75.8173 }, // Phillaur Road
        { lat: 30.935, lng: 75.8 }, // Highway Junction
        { lat: 30.941, lng: 75.7773 }, // Nakodar Road
        { lat: 30.98, lng: 75.75 }, // Shahkot Road
        { lat: 31.001, lng: 75.7373 }, // Shahkot
        { lat: 31.05, lng: 75.71 }, // Phillaur Road
        { lat: 31.101, lng: 75.6973 }, // Phillaur
        { lat: 31.15, lng: 75.67 }, // Jalandhar Cantt Road
        { lat: 31.201, lng: 75.6573 }, // Jalandhar Cantt
        { lat: 31.28, lng: 75.59 }, // Jalandhar City Road
        { lat: 31.326, lng: 75.5762 }, // Jalandhar City
      ],
    },
    {
      from: "Jalandhar",
      to: "Amritsar",
      path: [
        { lat: 31.326, lng: 75.5762 }, // Jalandhar
        { lat: 31.34, lng: 75.56 }, // Jalandhar GT Road
        { lat: 31.376, lng: 75.5262 }, // Kartarpur
        { lat: 31.4, lng: 75.5 }, // Kartarpur Road
        { lat: 31.426, lng: 75.4762 }, // Sultanpur Lodhi
        { lat: 31.45, lng: 75.45 }, // Kapurthala Road
        { lat: 31.476, lng: 75.4262 }, // Kapurthala Road
        { lat: 31.5, lng: 75.4 }, // Beas Road
        { lat: 31.526, lng: 75.3762 }, // Beas
        { lat: 31.55, lng: 75.35 }, // Tarn Taran Road
        { lat: 31.576, lng: 75.3262 }, // Tarn Taran
        { lat: 31.6, lng: 75.0 }, // Amritsar Highway
        { lat: 31.62, lng: 74.9 }, // Amritsar Outskirts
        { lat: 31.634, lng: 74.8723 }, // Amritsar
      ],
    },
    {
      from: "Chandigarh",
      to: "Patiala",
      path: [
        { lat: 30.7333, lng: 76.7794 }, // Chandigarh
        { lat: 30.72, lng: 76.76 }, // Zirakpur Road
        { lat: 30.6833, lng: 76.7294 }, // Zirakpur
        { lat: 30.66, lng: 76.7 }, // Derabassi Road
        { lat: 30.6333, lng: 76.6794 }, // Derabassi
        { lat: 30.61, lng: 76.65 }, // Lalru Road
        { lat: 30.5833, lng: 76.6294 }, // Lalru
        { lat: 30.56, lng: 76.6 }, // Rajpura Road
        { lat: 30.5333, lng: 76.5794 }, // Rajpura
        { lat: 30.51, lng: 76.55 }, // Shambhu Road
        { lat: 30.4833, lng: 76.5294 }, // Shambhu
        { lat: 30.46, lng: 76.5 }, // Ghanaur Road
        { lat: 30.4333, lng: 76.4794 }, // Ghanaur
        { lat: 30.38, lng: 76.42 }, // Patiala Road
        { lat: 30.3398, lng: 76.3869 }, // Patiala
      ],
    },
    {
      from: "Patiala",
      to: "Bathinda",
      path: [
        { lat: 30.3398, lng: 76.3869 }, // Patiala
        { lat: 30.32, lng: 76.36 }, // Sanour Road
        { lat: 30.3098, lng: 76.3369 }, // Sanour
        { lat: 30.29, lng: 76.31 }, // Nabha Road
        { lat: 30.2798, lng: 76.2869 }, // Nabha
        { lat: 30.26, lng: 76.26 }, // Bhadaur Road
        { lat: 30.2498, lng: 76.2369 }, // Bhadaur
        { lat: 30.23, lng: 76.21 }, // Mansa Road
        { lat: 30.2198, lng: 76.1869 }, // Mansa Road
        { lat: 30.2, lng: 76.16 }, // Sardulgarh Road
        { lat: 30.1898, lng: 76.1369 }, // Sardulgarh
        { lat: 30.22, lng: 75.0 }, // Bathinda Highway
        { lat: 30.211, lng: 74.9455 }, // Bathinda
      ],
    },
  ]

  const generatePunjabBuses = (): Bus[] => {
    const buses: Bus[] = []
    const busNumbers = ["PB-01", "HR-02", "DL-03", "UP-04", "PB-05", "HR-06", "DL-07", "PB-08", "HR-09", "PB-10"]
    const drivers = [
      "Harpreet Singh",
      "Gurdeep Kaur",
      "Jasbir Singh",
      "Manpreet Kaur",
      "Sukhwinder Singh",
      "Rajwinder Kaur",
      "Balwinder Singh",
      "Simran Kaur",
      "Kuldeep Singh",
      "Navdeep Kaur",
      "Amarjit Singh",
      "Parminder Kaur",
      "Ranjit Singh",
      "Harleen Kaur",
      "Tejinder Singh",
    ]

    const punjabStops = [
      "Golden Temple",
      "Chandigarh Bus Stand",
      "Ludhiana Railway Station",
      "Jalandhar Cantt",
      "Amritsar Junction",
      "Patiala Bus Stand",
      "Mohali Phase 8",
      "Bathinda City Center",
      "Hoshiarpur Market",
      "Kapurthala Fort",
      "Moga Bus Terminal",
      "Sangrur Main Chowk",
      "Gurdaspur Station",
      "Tarn Taran Sahib",
      "Barnala Market",
      "Faridkot Bus Stand",
    ]

    const now = new Date()

    for (let i = 0; i < 55; i++) {
      const route = punjabRoadRoutes[i % punjabRoadRoutes.length]
      const routeIndex = Math.floor(Math.random() * route.path.length)
      const currentPos = route.path[routeIndex]

      const lat = currentPos.lat
      const lng = currentPos.lng

      const startTime = new Date(now.getTime() - Math.random() * 2 * 60 * 60 * 1000) // Started 0-2 hours ago
      const journeyDuration = 4 + Math.random() * 4 // 4-8 hour journey
      const estimatedArrival = new Date(startTime.getTime() + journeyDuration * 60 * 60 * 1000)

      buses.push({
        id: `BUS-${String(i + 1).padStart(3, "0")}`,
        number: `${busNumbers[i % busNumbers.length]}-${String(i + 1).padStart(3, "0")}`,
        route: `${route.from} - ${route.to}`,
        lat,
        lng,
        heading: Math.random() * 360,
        passengers: Math.floor(Math.random() * 45) + 5,
        capacity: 50,
        status: ["on-time", "delayed", "early"][Math.floor(Math.random() * 3)] as "on-time" | "delayed" | "early",
        nextStop: punjabStops[Math.floor(Math.random() * punjabStops.length)],
        eta: `${Math.floor(Math.random() * 15) + 1} min`,
        driver: drivers[Math.floor(Math.random() * drivers.length)],
        speed: Math.floor(Math.random() * 40) + 15,
        routePath: route.path,
        currentPathIndex: routeIndex,
        startTime,
        estimatedArrival,
      })
    }

    return buses
  }

  useEffect(() => {
    if (searchQuery.trim()) {
      const suggestions = new Set<string>()

      // Add Punjab cities that match the search
      punjabCities.forEach((city) => {
        if (city.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.add(`📍 ${city.name}`)
        }
      })

      // Add bus-related suggestions
      buses.forEach((bus) => {
        if (bus.number.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.add(`🚌 ${bus.number}`)
        }
        if (bus.route.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.add(`🛣️ ${bus.route}`)
        }
        if (bus.nextStop.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.add(`🚏 ${bus.nextStop}`)
        }
        if (bus.driver.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.add(`👨‍✈️ ${bus.driver}`)
        }
      })

      setSearchSuggestions(Array.from(suggestions).slice(0, 8))
      setShowSuggestions(true)
    } else {
      setSearchSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchQuery, buses])

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timeInterval)
  }, [])

  const resetBusData = () => {
    const newBuses = generatePunjabBuses()
    setBuses(newBuses)
    setFilteredBuses(newBuses)
    setSelectedBus(null)
  }

  useEffect(() => {
    if (!apiKey) {
      console.log("[v0] No Google Maps API key provided - using demo mode")
      setIsLoaded(true)
      const punjabBuses = generatePunjabBuses()
      setBuses(punjabBuses)
      setFilteredBuses(punjabBuses)
      return
    }

    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true)
        return
      }

      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
      if (existingScript) {
        existingScript.addEventListener("load", () => setIsLoaded(true))
        existingScript.addEventListener("error", () => setLoadError("Failed to load Google Maps"))
        return
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`
      script.async = true
      script.defer = true
      script.onload = () => {
        if (window.google && window.google.maps) {
          setIsLoaded(true)
        } else {
          setLoadError("Google Maps API failed to initialize")
        }
      }
      script.onerror = () => {
        setLoadError("Failed to load Google Maps script")
      }
      document.head.appendChild(script)
    }

    loadGoogleMaps()
  }, [apiKey])

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return

    if (apiKey && window.google && window.google.maps) {
      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        })
        mapInstanceRef.current = map
      } catch (error) {
        console.error("[v0] Error initializing Google Maps:", error)
        setLoadError("Error initializing map")
      }
    }

    const punjabBuses = generatePunjabBuses()
    setBuses(punjabBuses)
    setFilteredBuses(punjabBuses)
  }, [isLoaded, center, zoom, apiKey])

  const handleSuggestionClick = (suggestion: string) => {
    console.log("[v0] Suggestion clicked:", suggestion)
    setSearchQuery(suggestion)
    setShowSuggestions(false)

    if (suggestion.startsWith("📍")) {
      const cityName = suggestion.replace("📍 ", "")
      console.log("[v0] Navigating to city:", cityName)
      navigateToCity(cityName)
    }
  }

  const navigateToCity = (cityName: string) => {
    console.log("[v0] Looking for city:", cityName)
    const city = punjabCities.find((c) => c.name.toLowerCase() === cityName.toLowerCase())
    console.log("[v0] Found city:", city)

    if (city && mapInstanceRef.current && apiKey && window.google) {
      console.log("[v0] Setting map center to:", city.lat, city.lng)
      mapInstanceRef.current.setCenter({ lat: city.lat, lng: city.lng })
      mapInstanceRef.current.setZoom(12)

      // Filter buses near this city (within ~50km radius)
      const nearbyBuses = buses.filter((bus) => {
        const distance = Math.sqrt(Math.pow(bus.lat - city.lat, 2) + Math.pow(bus.lng - city.lng, 2))
        return distance < 0.5 // Approximately 50km radius
      })
      console.log("[v0] Found nearby buses:", nearbyBuses.length)
      setFilteredBuses(nearbyBuses)
    } else {
      console.log("[v0] Navigation failed - missing requirements:", {
        city: !!city,
        mapInstance: !!mapInstanceRef.current,
        apiKey: !!apiKey,
        googleMaps: !!(window.google && window.google.maps),
      })
    }
  }

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBuses(buses)
    } else {
      const cleanQuery = searchQuery.replace(/^(📍|🚌|🛣️|🚏|👨‍✈️)\s/, "").toLowerCase()

      const filtered = buses.filter(
        (bus) =>
          bus.number.toLowerCase().includes(cleanQuery) ||
          bus.route.toLowerCase().includes(cleanQuery) ||
          bus.nextStop.toLowerCase().includes(cleanQuery) ||
          bus.driver.toLowerCase().includes(cleanQuery),
      )
      setFilteredBuses(filtered)
    }
  }, [searchQuery, buses])

  useEffect(() => {
    if (!filteredBuses.length) return

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      if (apiKey && window.google && marker.setMap) {
        marker.setMap(null)
      }
    })
    markersRef.current = []

    // Add new markers
    filteredBuses.forEach((bus) => {
      if (apiKey && window.google && window.google.maps && mapInstanceRef.current) {
        try {
          const marker = new window.google.maps.Marker({
            position: { lat: bus.lat, lng: bus.lng },
            map: mapInstanceRef.current,
            title: `${bus.number} - ${bus.route}`,
            icon: {
              url: "/images/bus-icon-new.png",
              scaledSize: new window.google.maps.Size(32, 32),
              anchor: new window.google.maps.Point(16, 16),
            },
          })

          marker.addListener("click", () => {
            setSelectedBus(bus)
          })

          markersRef.current.push(marker)
        } catch (error) {
          console.error("[v0] Error creating marker:", error)
        }
      }
    })
  }, [filteredBuses, apiKey])

  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          let newPathIndex = bus.currentPathIndex
          let newLat = bus.lat
          let newLng = bus.lng

          if (bus.routePath.length > 1) {
            const nextPoint = bus.routePath[(bus.currentPathIndex + 1) % bus.routePath.length]
            const currentPoint = { lat: bus.lat, lng: bus.lng }

            const latDiff = nextPoint.lat - currentPoint.lat
            const lngDiff = nextPoint.lng - currentPoint.lng
            const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff)

            if (distance < 0.0001) {
              // Very small threshold for better precision
              newPathIndex = (bus.currentPathIndex + 1) % bus.routePath.length
              newLat = nextPoint.lat
              newLng = nextPoint.lng
            } else {
              const speed = 0.00002 // Much slower movement for better road adherence
              newLat = bus.lat + (latDiff / distance) * speed
              newLng = bus.lng + (lngDiff / distance) * speed
            }
          }

          return {
            ...bus,
            lat: newLat,
            lng: newLng,
            currentPathIndex: newPathIndex,
            passengers: Math.max(0, Math.min(bus.capacity, bus.passengers + Math.floor(Math.random() * 6) - 3)),
            speed: Math.max(10, Math.min(60, bus.speed + Math.floor(Math.random() * 10) - 5)),
          }
        }),
      )
    }, 1500) // Slightly faster updates for smoother movement

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-time":
        return "#22c55e"
      case "delayed":
        return "#ef4444"
      case "early":
        return "#3b82f6"
      default:
        return "#2d7d7d"
    }
  }

  const getOccupancyColor = (passengers: number, capacity: number) => {
    const ratio = passengers / capacity
    if (ratio < 0.5) return "bg-green-500"
    if (ratio < 0.8) return "bg-yellow-500"
    return "bg-red-500"
  }

  if (loadError) {
    return (
      <div className="w-full h-[600px] bg-red-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Map Loading Error</h3>
          <p className="text-red-600">{loadError}</p>
          <p className="text-sm text-red-500 mt-2">Please check your Google Maps API key and try again.</p>
        </div>
      </div>
    )
  }

  if (!apiKey) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex flex-col">
        <div className="bg-teal-600 text-white px-6 py-3 rounded-t-lg flex justify-between items-center">
          <h3 className="text-lg font-semibold">Punjab Bus Tracking System</h3>
          <div className="text-lg font-mono">
            {currentTime.toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
              hour12: true,
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Google Maps API Key Required</h3>
            <p className="text-gray-600 mb-4">
              To display the live bus tracking map, please provide a Google Maps API key.
            </p>
          </div>

          <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold">Demo: Live Bus Tracking Punjab ({filteredBuses.length} buses)</h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search cities, buses, routes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10 max-h-60 overflow-y-auto">
                    {searchSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {filteredBuses.map((bus) => (
                <div
                  key={bus.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedBus(bus)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img src="/images/bus-icon-new.png" alt="Bus" className="w-5 h-5" />
                      <span className="font-medium">{bus.number}</span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs text-white ${
                        bus.passengers / bus.capacity < 0.5
                          ? "bg-green-500"
                          : bus.passengers / bus.capacity < 0.8
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    >
                      {Math.round((bus.passengers / bus.capacity) * 100)}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Route: {bus.route}</div>
                    <div>Next: {bus.nextStop}</div>
                    <div>ETA: {bus.eta}</div>
                    <div>
                      Passengers: {bus.passengers}/{bus.capacity}
                    </div>
                    <div>Speed: {bus.speed} km/h</div>
                    <div>Driver: {bus.driver}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-4 right-4">
            <button
              onClick={resetBusData}
              className="w-8 h-8 bg-teal-600 hover:bg-teal-700 text-white rounded-full text-xs font-bold shadow-lg transition-colors flex items-center justify-center"
              title="Reset Bus Data for Demo"
            >
              R
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[600px]">
      <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg px-4 py-2">
        <div className="text-lg font-mono text-teal-600">
          {currentTime.toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour12: true,
          })}
        </div>
      </div>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Punjab cities, buses, routes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-80 pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg shadow-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-20 max-h-60 overflow-y-auto">
              {searchSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-sm border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {selectedBus && (
        <div className="absolute top-20 right-4 bg-white rounded-lg shadow-lg p-4 w-80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <img src="/images/bus-icon-new.png" alt="Bus" className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">{selectedBus.number}</h3>
                <p className="text-sm text-gray-600">{selectedBus.route}</p>
              </div>
            </div>
            <button onClick={() => setSelectedBus(null)} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Status:</span>
              <span
                className={`font-medium ${
                  selectedBus.status === "on-time"
                    ? "text-green-600"
                    : selectedBus.status === "delayed"
                      ? "text-red-600"
                      : "text-blue-600"
                }`}
              >
                {selectedBus.status.replace("-", " ").toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Next Stop:</span>
              <span className="font-medium">{selectedBus.nextStop}</span>
            </div>
            <div className="flex justify-between">
              <span>ETA:</span>
              <span className="font-medium">{selectedBus.eta}</span>
            </div>
            <div className="flex justify-between">
              <span>Passengers:</span>
              <span className="font-medium">
                {selectedBus.passengers}/{selectedBus.capacity}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Speed:</span>
              <span className="font-medium">{selectedBus.speed} km/h</span>
            </div>
            <div className="flex justify-between">
              <span>Driver:</span>
              <span className="font-medium">{selectedBus.driver}</span>
            </div>
            <div className="flex justify-between">
              <span>Started:</span>
              <span className="font-medium">{selectedBus.startTime.toLocaleTimeString("en-IN", { hour12: true })}</span>
            </div>
            <div className="flex justify-between">
              <span>Est. Arrival:</span>
              <span className="font-medium">
                {selectedBus.estimatedArrival.toLocaleTimeString("en-IN", { hour12: true })}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Occupancy</span>
              <span>{Math.round((selectedBus.passengers / selectedBus.capacity) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  selectedBus.passengers / selectedBus.capacity < 0.5
                    ? "bg-green-500"
                    : selectedBus.passengers / selectedBus.capacity < 0.8
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${(selectedBus.passengers / selectedBus.capacity) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium">Live Tracking ({filteredBuses.length} buses)</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10">
        <button
          onClick={resetBusData}
          className="w-8 h-8 bg-teal-600 hover:bg-teal-700 text-white rounded-full text-xs font-bold shadow-lg transition-colors flex items-center justify-center"
          title="Reset Bus Data for Demo"
        >
          R
        </button>
      </div>
    </div>
  )
}
