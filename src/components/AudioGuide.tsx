import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Download, 
  Volume2, 
  MapPin,
  Headphones,
  Languages
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NotificationPanel } from "./NotificationPanel";
import { useScrollAnimation, useStaggeredScrollAnimation } from "@/hooks/useScrollAnimation";
import audioGuideHero from "@/assets/audio-guide-hero-large.jpg";

// Preload critical hero image
const preloadAudioHeroImage = () => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = audioGuideHero;
  document.head.appendChild(link);
};

// Call preload immediately
preloadAudioHeroImage();

const audioGuides = [
  {
    id: 1,
    title: "Complete Rumtek Monastery Tour",
    monastery: "Rumtek Monastery",
    duration: "45 minutes",
    tracks: 12,
    languages: ["English", "Hindi", "Nepali", "Tibetan"],
    description: "Comprehensive audio guide covering history, architecture, and spiritual significance of Sikkim's largest monastery.",
    type: "Complete Tour",
    size: "125 MB",
    offline: true,
  },
  {
    id: 2,
    title: "Enchey Monastery Heritage Walk",
    monastery: "Enchey Monastery",
    duration: "30 minutes",
    tracks: 8,
    languages: ["English", "Hindi"],
    description: "Explore the 200-year-old monastery with stories of its founding and architectural marvels.",
    type: "Heritage Focus",
    size: "85 MB",
    offline: true,
  },
  {
    id: 3,
    title: "Pemayangtse Sacred Spaces",
    monastery: "Pemayangtse Monastery",
    duration: "35 minutes",
    tracks: 10,
    languages: ["English", "Hindi", "Lepcha"],
    description: "Journey through sacred spaces and learn about ancient Buddhist practices and traditions.",
    type: "Spiritual Focus",
    size: "95 MB",
    offline: true,
  },
  {
    id: 4,
    title: "Tashiding Pilgrimage Experience",
    monastery: "Tashiding Monastery",
    duration: "25 minutes",
    tracks: 6,
    languages: ["English", "Hindi"],
    description: "Experience the pilgrimage route and understand the spiritual significance of this sacred site.",
    type: "Pilgrimage",
    size: "70 MB",
    offline: true,
  },
];

export const AudioGuide = () => {
  const [selectedGuide, setSelectedGuide] = useState<typeof audioGuides[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(1);
  const [progress, setProgress] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const { toast } = useToast();
  
  const heroRef = useScrollAnimation('scale');
  const titleRef = useScrollAnimation('up', 0.1);
  const featuresRef = useScrollAnimation('left', 0.1);
  const setGuideRef = useStaggeredScrollAnimation(4, 'stagger', 150);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    toast({
      title: isPlaying ? "Audio Paused" : "Audio Playing",
      description: `Track ${currentTrack} of ${selectedGuide?.tracks}`,
    });
  };

  const handleDownload = (guide: typeof audioGuides[0]) => {
    toast({
      title: "Download Started",
      description: `Downloading ${guide.title} (${guide.size})`,
    });
  };

  const handleTrackChange = (direction: "prev" | "next") => {
    if (!selectedGuide) return;
    
    if (direction === "next" && currentTrack < selectedGuide.tracks) {
      setCurrentTrack(currentTrack + 1);
    } else if (direction === "prev" && currentTrack > 1) {
      setCurrentTrack(currentTrack - 1);
    }
    setProgress(0);
  };

  if (selectedGuide) {
    return (
      <div className="w-full min-h-screen bg-gradient-mountain text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Audio Player Header */}
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="glass"
                onClick={() => setSelectedGuide(null)}
                className="text-white"
              >
                ← Back to Guides
              </Button>
              <div className="flex space-x-2">
                {selectedGuide.languages.map((lang) => (
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
            
            <h1 className="text-2xl font-bold mb-2">{selectedGuide.title}</h1>
            <p className="text-gray-300 mb-4">{selectedGuide.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Monastery:</span>
                <p className="font-medium">{selectedGuide.monastery}</p>
              </div>
              <div>
                <span className="text-gray-400">Duration:</span>
                <p className="font-medium">{selectedGuide.duration}</p>
              </div>
              <div>
                <span className="text-gray-400">Tracks:</span>
                <p className="font-medium">{selectedGuide.tracks}</p>
              </div>
              <div>
                <span className="text-gray-400">Language:</span>
                <p className="font-medium">{selectedLanguage}</p>
              </div>
            </div>
          </div>

          {/* Audio Player */}
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 mb-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Track {currentTrack} of {selectedGuide.tracks}</h3>
              <p className="text-gray-300">Introduction to the Main Prayer Hall</p>
            </div>

            <div className="mb-6">
              <Progress value={progress} className="w-full h-2 bg-white/20" />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>2:45</span>
                <span>4:30</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="glass"
                  size="icon"
                  onClick={() => handleTrackChange("prev")}
                  disabled={currentTrack === 1}
                  className="text-white disabled:opacity-50"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
              
              <Button
                size="lg"
                onClick={handlePlayPause}
                className="bg-primary hover:bg-primary/80 w-16 h-16 rounded-full"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              
              <Button
                variant="glass"
                size="icon"
                onClick={() => handleTrackChange("next")}
                disabled={currentTrack === selectedGuide.tracks}
                className="text-white disabled:opacity-50"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex justify-center mt-4">
              <Button
                variant="glass"
                size="icon"
                className="text-white"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Track List */}
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Track List</h3>
            <div className="space-y-2">
              {Array.from({ length: selectedGuide.tracks }, (_, i) => (
                <div
                  key={i + 1}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    currentTrack === i + 1 
                      ? "bg-primary/20 text-primary" 
                      : "hover:bg-white/10"
                  }`}
                  onClick={() => setCurrentTrack(i + 1)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">
                      {i + 1}
                    </span>
                    <span>Track {i + 1}: Introduction to Sacred Spaces</span>
                  </div>
                  <span className="text-sm text-gray-400">3:45</span>
                </div>
              ))}
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
            backgroundImage: `url(${audioGuideHero})`,
            top: '-120px',
            height: 'calc(100% + 120px)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" style={{ top: '-120px', height: 'calc(100% + 120px)' }} />
        
        <div ref={heroRef} className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Audio <span className="text-primary">Guide</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Intelligent Audio Stories of Sacred Spaces
          </p>
          <p className="text-lg mb-12 text-gray-300 max-w-2xl mx-auto">
            Enhance your monastery visits with professional narration in multiple languages, 
            complete with offline capability for remote locations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setSelectedGuide(audioGuides[0])}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Audio Guide
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('guides-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white"
            >
              <Headphones className="w-5 h-5 mr-2" />
              Browse All Guides
            </Button>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full animate-float opacity-60" />
        <div className="absolute top-32 right-16 w-6 h-6 bg-primary-glow rounded-full animate-float opacity-40" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-accent rounded-full animate-float opacity-50" style={{ animationDelay: "2s" }} />
      </section>

      {/* Audio Guides Content */}
      <section id="guides-grid" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div ref={titleRef} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Smart Audio Guides
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Professional narration by monks and cultural experts, available in multiple languages.
            </p>
          </div>

        {/* Features */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-accent/10">
            <CardContent className="p-6 text-center">
              <Headphones className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">High Quality Audio</h3>
              <p className="text-sm text-muted-foreground">
                Professional narration by monks and cultural experts
              </p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/10">
            <CardContent className="p-6 text-center">
              <Languages className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">Multiple Languages</h3>
              <p className="text-sm text-muted-foreground">
                Available in English, Hindi, Nepali, Tibetan, and Lepcha
              </p>
            </CardContent>
          </Card>
          <Card className="bg-primary/10">
            <CardContent className="p-6 text-center">
              <Download className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">Offline Access</h3>
              <p className="text-sm text-muted-foreground">
                Download guides for use in remote monastery locations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Audio Guides Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {audioGuides.map((guide, index) => (
            <Card key={guide.id} ref={setGuideRef(index)} className="group hover:shadow-heritage transition-all duration-300 bg-muted/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{guide.title}</CardTitle>
                  <Badge variant="secondary">{guide.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{guide.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <p className="font-medium">{guide.duration}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tracks:</span>
                    <p className="font-medium">{guide.tracks}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Size:</span>
                    <p className="font-medium">{guide.size}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs">Offline Ready</span>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground">Languages:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {guide.languages.map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button 
                    onClick={() => setSelectedGuide(guide)}
                    className="flex-1"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Play Guide
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleDownload(guide)}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        </div>
      </section>
    </div>
  );
};