import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Camera, VolumeX, Volume2, RotateCcw, Maximize } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NotificationPanel } from "./NotificationPanel";
import { useScrollAnimation, useStaggeredScrollAnimation } from "@/hooks/useScrollAnimation";
import monasteryImage1 from "@/assets/monastery-1.jpg";
import monasteryImage2 from "@/assets/monastery-2.jpg";
import monasteryImage3 from "@/assets/monastery-3.jpg";
import virtualToursHero from "@/assets/virtual-tours-hero-large.jpg";

// Preload critical hero image
const preloadVirtualToursHeroImage = () => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = virtualToursHero;
  document.head.appendChild(link);
};

// Call preload immediately
preloadVirtualToursHeroImage();

const virtualTours = [
  {
    id: 1,
    name: "Rumtek Monastery",
    image: monasteryImage1,
    duration: "15 minutes",
    language: ["English", "Hindi", "Nepali"],
    description: "Explore the largest monastery in Sikkim with 360° views of prayer halls, sacred artifacts, and stunning architecture.",
    highlights: ["Golden Buddha", "Prayer Wheels", "Sacred Manuscripts"],
    difficulty: "Easy",
  },
  {
    id: 2,
    name: "Enchey Monastery",
    image: monasteryImage2,
    duration: "12 minutes",
    language: ["English", "Hindi"],
    description: "Experience the serene atmosphere of this 200-year-old monastery with panoramic mountain views.",
    highlights: ["Ancient Murals", "Meditation Hall", "Mountain Views"],
    difficulty: "Moderate",
  },
  {
    id: 3,
    name: "Pemayangtse Monastery",
    image: monasteryImage3,
    duration: "18 minutes",
    language: ["English", "Hindi", "Lepcha"],
    description: "Journey through one of Sikkim's oldest monasteries with rich history and cultural significance.",
    highlights: ["Traditional Architecture", "Sacred Relics", "Historical Artifacts"],
    difficulty: "Easy",
  },
];

export const VirtualTours = () => {
  const [activeTour, setActiveTour] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const { toast } = useToast();
  
  const heroRef = useScrollAnimation('scale');
  const titleRef = useScrollAnimation('left', 0.1);
  const setTourRef = useStaggeredScrollAnimation(3, 'stagger', 150);

  const handleStartTour = (tour) => {
    setActiveTour(tour);
    toast({
      title: "Virtual Tour Started",
      description: `Starting tour of ${tour.name}`,
    });
  };

  const handleFullscreen = () => {
    toast({
      title: "Fullscreen Mode",
      description: "Entering immersive 360° experience",
    });
  };

  const handleReset = () => {
    toast({
      title: "Tour Reset",
      description: "Returning to starting position",
    });
  };

  if (activeTour) {
    return (
      <div className="w-full h-screen bg-black relative">
        {/* 360° Tour Viewer */}
        <div className="w-full h-full relative overflow-hidden">
          <img
            src={activeTour.image}
            alt={activeTour.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          
          {/* Tour Controls Overlay */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
              <h3 className="font-bold">{activeTour.name}</h3>
              <p className="text-sm text-gray-300">360° Virtual Tour</p>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                className="bg-black/70 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleReset}
                className="bg-black/70 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleFullscreen}
                className="bg-black/70 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Language Selector */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2 bg-black/70 backdrop-blur-sm rounded-lg p-2">
              {activeTour.language.map((lang) => (
                <Button
                  key={lang}
                  variant={selectedLanguage === lang ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLanguage(lang)}
                  className="text-xs"
                >
                  {lang}
                </Button>
              ))}
            </div>
          </div>

          {/* Tour Progress */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Tour Progress</span>
                <span className="text-sm">3:45 / {activeTour.duration}</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "25%" }}></div>
              </div>
              <div className="flex justify-between mt-3">
                <Button
                  variant="outline"
                  onClick={() => setActiveTour(null)}
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                  Exit Tour
                </Button>
                <Button className="bg-primary hover:bg-primary/80">
                  Continue Tour
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NotificationPanel />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${virtualToursHero})`,
            top: '-120px',
            height: 'calc(100% + 120px)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" style={{ top: '-120px', height: 'calc(100% + 120px)' }} />
        
        <div ref={heroRef} className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Virtual <span className="text-primary">Tours</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Immersive 360° Experiences of Sacred Monasteries
          </p>
          <p className="text-lg mb-12 text-gray-300 max-w-2xl mx-auto">
            Explore ancient halls, view precious artifacts, and learn about centuries of Buddhist tradition 
            through cutting-edge virtual reality technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => handleStartTour(virtualTours[0])}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 min-w-[180px] text-lg flex items-center rounded-md shadow-glow"
            >
              <Play className="w-5 h-5 mr-2" />
              Start First Tour
            </Button>
            
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full animate-float opacity-60" />
        <div className="absolute top-32 right-16 w-6 h-6 bg-primary-glow rounded-full animate-float opacity-40" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-accent rounded-full animate-float opacity-50" style={{ animationDelay: "2s" }} />
      </section>

      {/* Tours Grid */}
      <section id="tours-grid" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div ref={titleRef} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Virtual Experience
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Each tour offers a unique perspective on Sikkim's monastic heritage, 
              complete with professional narration and interactive elements.
            </p>
          </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {virtualTours.map((tour, index) => (
            <Card key={tour.id} ref={setTourRef(index)} className="group hover:shadow-heritage transition-all duration-300 bg-muted/30">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={tour.image}
                    alt={tour.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    
                  </div>
                  
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="mb-2">{tour.name}</CardTitle>
                <p className="text-sm text-muted-foreground mb-3">{tour.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      {tour.difficulty}
                    </Badge>
                  </div>
                </div>

                <div className="mb-2">
                  <h4 className="text-sm font-medium mb-2">Tour Highlights:</h4>
                  <div className="flex flex-wrap gap-2">
                    {tour.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs text-white px-2 py-1">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Available Languages:</h4>
                  <div className="flex flex-wrap gap-1">
                    {tour.language.map((lang, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handleStartTour(tour)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Virtual Tour
                </Button>
              </CardContent>
            </Card>
          ))}
          </div>
        </div>
      </section>
    </div>
  );
};
