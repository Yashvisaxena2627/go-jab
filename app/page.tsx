import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="hero-video-bg relative min-h-[500px] flex items-center overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-09-23%20at%2023.55.41_90ba6e88-OPbg789A1xh1yZ7tANNTC4MGyU4TfS.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance drop-shadow-lg">
              Track your bus, anytime, anywhere
            </h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[#e67e22] hover:bg-[#d35400] text-white px-8 shadow-lg">
                Track a Bus
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black px-8 bg-black/20 backdrop-blur-sm shadow-lg"
              >
                Subscribe for Alerts
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#2d7d7d]">Quick Search</h2>
            <div className="flex gap-2">
              <Input placeholder="Enter bus number, route, or stop..." className="flex-1" />
              <Button className="bg-[#e67e22] hover:bg-[#d35400]">
                <SearchIcon />
              </Button>
            </div>
            <Button variant="outline" className="w-full mt-4 text-[#2d7d7d] border-[#2d7d7d] bg-transparent">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* About & Impact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#2d7d7d]">About & Impact</h2>
              <p className="text-gray-600 mb-6">
                This app your thirsty just at app getting. Wired amet metus. And you know this andmeet. In eco idea what
                stream one to to and out travel.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <img src="/people-in-meeting.jpg" alt="Community meeting" className="rounded-lg" />
                <img src="/colorful-buses.jpg" alt="Bus fleet" className="rounded-lg" />
                <img src="/people-using-mobile-app.png" alt="App users" className="rounded-lg" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-[#2d7d7d] mb-2">Real-time Tracking</h3>
                <p className="text-gray-600 text-sm">
                  Track buses in real-time with accurate location data and arrival predictions.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-[#2d7d7d] mb-2">Smart Alerts</h3>
                <p className="text-gray-600 text-sm">
                  Get notified about delays, route changes, and bus arrivals via SMS or push notifications.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-[#2d7d7d] mb-2">Route Planning</h3>
                <p className="text-gray-600 text-sm">
                  Plan your journey with multiple route options and estimated travel times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#2d7d7d]">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img src="/new-bus-route-announcement.jpg" alt="News 1" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="font-semibold mb-2">New Route Added: Village A to City Center</h3>
                <p className="text-gray-600 text-sm">
                  We're excited to announce a new direct route connecting Village A to the city center...
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img src="/mobile-app-update.png" alt="News 2" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="font-semibold mb-2">App Update: Enhanced Real-time Tracking</h3>
                <p className="text-gray-600 text-sm">
                  Our latest update includes improved GPS accuracy and faster location updates...
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img src="/community-feedback.jpg" alt="News 3" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="font-semibold mb-2">Community Feedback: 95% Satisfaction Rate</h3>
                <p className="text-gray-600 text-sm">
                  Thanks to your feedback, we've achieved a 95% user satisfaction rate this quarter...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
