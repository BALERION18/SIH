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
    title: "Saga Dawa",
    date: "2024-05-23",
    time: "All Day",
    monastery: "Various",
    description: "A month-long celebration of Buddha's life, enlightenment, and death, marked by increased spiritual activities.",
    type: "Festival",
    participants: "Devotees",
    duration: "1 Month",
    booking: false,
    price: "Free",
  },
  {
    id: 3,
    title: "Drupka Tsheshi",
    date: "2024-06-04",
    time: "9:00 AM - 5:00 PM",
    monastery: "All Monasteries",
    description: "Celebrates Buddha's first sermon to his disciples in Sarnath, with special prayers and teachings.",
    type: "Ceremony",
    participants: "Monks & Public",
    duration: "1 Day",
    booking: false,
    price: "Free",
  },
  {
    id: 4,
    title: "Pang Lhabsol",
    date: "2024-09-15",
    time: "10:00 AM - 4:00 PM",
    monastery: "All Monasteries",
    description: "Unique to Sikkim, this festival honors Mount Khangchendzonga, the guardian deity, with masked dances and rituals.",
    type: "Festival",
    participants: "Locals & Tourists",
    duration: "2 Days",
    booking: false,
    price: "Free",
  },
  {
    id: 5,
    title: "Bhumchu Ceremony",
    date: "2024-12-20",
    time: "11:00 AM - 1:00 PM",
    monastery: "Tashiding Monastery",
    description: "A sacred water ceremony where the level of holy water in a pot is observed to predict the year's fortunes.",
    type: "Ceremony",
    participants: "Monks & Pilgrims",
    duration: "1 Day",
    booking: false,
    price: "Free",
  },
  {
    id: 6,
    title: "Kagyed Dance",
    date: "2024-12-28",
    time: "2:00 PM - 4:00 PM",
    monastery: "Various",
    description: "A traditional masked dance performed to dispel evil spirits and bring good fortune for the upcoming year.",
    type: "Dance",
    participants: "Viewers",
    duration: "2 Hours",
    booking: false,
    price: "Free",
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

  const handleFilter = (type) => {
    setSelectedFilter(type);
    const filtered = type === "all" 
      ? events 
      : events.filter(event => event.type.toLowerCase() === type.toLowerCase());
    setFilteredEvents(filtered);
  };

  const handleBooking = (event) => {
    toast({
      title: "Booking Initiated",
      description: `Booking ${event.title} - ${event.date}`,
    });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Festival": return "bg-primary/10 text-primary";
      case "Ceremony": return "bg-primary/10 text-primary";
      case "Dance": return "bg-primary/10 text-primary";
      case "Exhibition": return "bg-orange-100 text-orange-700";
      default: return "bg-muted text-muted-foreground";
    }
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
            top: '-120px',
            height: 'calc(100% + 120px)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" style={{ top: '-120px', height: 'calc(100% + 120px)' }} />
        
        <div ref={heroRef} className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Cultural <span className="text-primary">Calendar</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Explore Sikkim's Vibrant Festivals and Sacred Events
          </p>
          <p className="text-lg mb-12 text-gray-300 max-w-2xl mx-auto">
            Plan your visit around the most captivating cultural events, from ancient ceremonies 
            to colorful monastic festivals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => handleFilter("festival")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-4 min-w-[180px] text-lg flex items-center rounded-md shadow-glow"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Explore Festivals
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => handleFilter("ceremony")}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white px-3 py-4 min-w-[180px] text-lg flex items-center rounded-md"
            >
              <Calendar className="w-5 h-5 mr-2" />
              View Ceremonies
            </Button>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full animate-float opacity-60" />
        <div className="absolute top-32 right-16 w-6 h-6 bg-primary-glow rounded-full animate-float opacity-40" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-accent rounded-full animate-float opacity-50" style={{ animationDelay: "2s" }} />
      </section>

      {/* Events Listing */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div ref={titleRef} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Upcoming Cultural Events
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the spiritual heart of Sikkim through its vibrant calendar of festivals, 
              ceremonies, and cultural celebrations.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button
              variant={selectedFilter === "all" ? "default" : "outline"}
              onClick={() => handleFilter("all")}
            >
              All Events
            </Button>
            <Button
              variant={selectedFilter === "festival" ? "default" : "outline"}
              onClick={() => handleFilter("festival")}
            >
              Festivals
            </Button>
            <Button
              variant={selectedFilter === "ceremony" ? "default" : "outline"}
              onClick={() => handleFilter("ceremony")}
            >
              Ceremonies
            </Button>
            <Button
              variant={selectedFilter === "dance" ? "default" : "outline"}
              onClick={() => handleFilter("dance")}
            >
              Dances
            </Button>
          </div>

          {/* Event Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <Card key={event.id} ref={setEventRef(index)} className="group hover:shadow-heritage transition-all duration-300 bg-muted/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{event.title}</CardTitle>
                  <Badge className={`${getTypeColor(event.type)} text-sm px-3 py-1`}>
                    {event.type}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">{event.description}</div>
                  <div className="flex items-center space-x-2 text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm mb-2">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.monastery}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm mb-4">
                    <Users className="w-4 h-4" />
                    <span>{event.participants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price: {event.price}</span>
                    {event.booking ? (
                      <Button size="sm" onClick={() => handleBooking(event)}>
                        <Ticket className="w-4 h-4 mr-2" />
                        Book Now
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-base px-2 py-1">Free Entry</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-mountain text-white">
        <div className="container mx-auto px-4 text-center">
          <div ref={highlightRef}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Experience the Cultural Richness of Sikkim
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              Plan your visit to coincide with these spectacular events and immerse yourself 
              in the spiritual and cultural heritage of the monasteries.
            </p>
            <Button 
              size="lg" 
              onClick={() => handleFilter("festival")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-2 py-1 shadow-glow"
            >
              View All Festivals
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
