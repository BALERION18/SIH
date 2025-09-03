import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Ticket, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NotificationPanel } from "./NotificationPanel";
import { useScrollAnimation, useStaggeredScrollAnimation } from "@/hooks/useScrollAnimation";
import culturalHero from "@/assets/cultural-calendar-hero-large.jpg";

// Preload critical hero image
const preloadCulturalHeroImage = () => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = culturalHero;
  document.head.appendChild(link);
};

// Call preload immediately
preloadCulturalHeroImage();

const events = [
  {
    id: 1,
    title: "Losar - Tibetan New Year",
    date: "2024-02-10",
    time: "6:00 AM - 6:00 PM",
    monastery: "All Monasteries",
    description: "The most important festival in the Tibetan calendar, celebrating the new year with prayers, traditional dances, and feasts.",
    type: "Festival",
    participants: "Open to All",
    duration: "3 Days",
    booking: true,
    price: "Free",
  },
  {
    id: 2,
    title: "Saga Dawa Festival",
    date: "2024-05-23",
    time: "5:00 AM - 8:00 PM",
    monastery: "Rumtek Monastery",
    description: "Commemorating Buddha's birth, enlightenment, and passing away. Sacred month with special prayers and ceremonies.",
    type: "Religious",
    participants: "Open to All",
    duration: "1 Day",
    booking: true,
    price: "Free",
  },
  {
    id: 3,
    title: "Hemis Festival",
    date: "2024-07-12",
    time: "9:00 AM - 5:00 PM",
    monastery: "Enchey Monastery",
    description: "Masked dance performances depicting the victory of good over evil, accompanied by traditional music.",
    type: "Cultural",
    participants: "Open to All",
    duration: "2 Days",
    booking: true,
    price: "₹500",
  },
  {
    id: 4,
    title: "Morning Prayer Session",
    date: "Daily",
    time: "5:30 AM - 7:00 AM",
    monastery: "Pemayangtse Monastery",
    description: "Join monks in their daily morning prayers and meditation. A peaceful way to start the day.",
    type: "Prayer",
    participants: "Max 20",
    duration: "1.5 Hours",
    booking: true,
    price: "₹200",
  },
  {
    id: 5,
    title: "Meditation Workshop",
    date: "2024-03-15",
    time: "2:00 PM - 5:00 PM",
    monastery: "Tashiding Monastery",
    description: "Learn traditional Buddhist meditation techniques from experienced monks in a serene mountain setting.",
    type: "Workshop",
    participants: "Max 15",
    duration: "3 Hours",
    booking: true,
    price: "₹1000",
  },
  {
    id: 6,
    title: "Cham Dance Performance",
    date: "2024-09-20",
    time: "10:00 AM - 4:00 PM",
    monastery: "Rumtek Monastery",
    description: "Traditional masked dance performances representing Buddhist teachings and the triumph of good over evil.",
    type: "Performance",
    participants: "Open to All",
    duration: "6 Hours",
    booking: true,
    price: "₹300",
  },
];

export const CulturalCalendar = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState(events);
  const { toast } = useToast();
  
  const heroRef = useScrollAnimation('scale');
  const titleRef = useScrollAnimation('left', 0.1);
  const highlightRef = useScrollAnimation('right', 0.1);
  const setEventRef = useStaggeredScrollAnimation(6, 'stagger', 100);

  const handleFilter = (type: string) => {
    setSelectedFilter(type);
    const filtered = type === "all" 
      ? events 
      : events.filter(event => event.type.toLowerCase() === type.toLowerCase());
    setFilteredEvents(filtered);
  };

  const handleBooking = (event: typeof events[0]) => {
    toast({
      title: "Booking Initiated",
      description: `Booking ${event.title} - ${event.date}`,
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Festival": return "bg-primary text-primary-foreground";
      case "Religious": return "bg-secondary text-secondary-foreground";
      case "Cultural": return "bg-accent text-accent-foreground";
      case "Prayer": return "bg-muted text-muted-foreground";
      case "Workshop": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "Performance": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    if (dateString === "Daily") return "Daily";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen">
      <NotificationPanel />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${culturalHero})`,
            top: '-100px',
            height: 'calc(100% + 100px)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" style={{ top: '-100px', height: 'calc(100% + 100px)' }} />
        
        <div ref={heroRef} className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Cultural <span className="text-primary">Calendar</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Authentic Buddhist Festivals & Sacred Experiences
          </p>
          <p className="text-lg mb-12 text-gray-300 max-w-2xl mx-auto">
            Discover and participate in authentic Buddhist festivals, prayer sessions, and cultural events 
            happening across Sikkim's monasteries throughout the year.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => handleBooking(events[0])}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
            >
              <Ticket className="w-5 h-5 mr-2" />
              Book Next Event
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('events-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Browse All Events
            </Button>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full animate-float opacity-60" />
        <div className="absolute top-32 right-16 w-6 h-6 bg-primary-glow rounded-full animate-float opacity-40" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-accent rounded-full animate-float opacity-50" style={{ animationDelay: "2s" }} />
      </section>

      {/* Events Content */}
      <section id="events-grid" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div ref={titleRef} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Upcoming Cultural Events
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join us in celebrating the rich cultural heritage of Sikkim's monastic traditions.
            </p>
          </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {["all", "festival", "religious", "cultural", "prayer", "workshop", "performance"].map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              onClick={() => handleFilter(filter)}
              size="sm"
              className="capitalize"
            >
              {filter === "all" ? "All Events" : filter}
            </Button>
          ))}
        </div>

        {/* Upcoming Events Highlight */}
        <Card ref={highlightRef} className="mb-8 bg-gradient-card shadow-heritage">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Next Upcoming Event</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">{events[0].title}</h3>
                <p className="text-muted-foreground mb-3">{events[0].description}</p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(events[0].date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{events[0].time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{events[0].monastery}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Button size="lg" onClick={() => handleBooking(events[0])}>
                  <Ticket className="w-4 h-4 mr-2" />
                  Book Now - {events[0].price}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <Card key={event.id} ref={setEventRef(index)} className="group hover:shadow-heritage transition-all duration-300 bg-muted/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <Badge className={getTypeColor(event.type)}>
                    {event.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{event.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{event.monastery}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{event.participants}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Duration: </span>
                    <span>{event.duration}</span>
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {event.price}
                  </div>
                </div>

                {event.booking && (
                  <Button 
                    className="w-full" 
                    onClick={() => handleBooking(event)}
                  >
                    <Ticket className="w-4 h-4 mr-2" />
                    Book Event
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No events found for the selected category.</p>
            <Button 
              variant="outline" 
              onClick={() => handleFilter("all")}
              className="mt-4"
            >
              Show All Events
            </Button>
          </div>
          )}
        </div>
      </section>
    </div>
  );
};