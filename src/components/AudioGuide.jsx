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
    title: "Enchey Monastery Highlights",
    monastery: "Enchey Monastery",
    duration: "30 minutes",
    tracks: 8,
    languages: ["English", "Hindi"],
    description: "Discover the key features and stories behind the 200-year-old Enchey Monastery in Gangtok.",
    type: "Highlights",
    size: "80 MB",
    offline: true,
  },
  {
    id: 3,
    title: "Pemayangtse Monastery History",
    monastery: "Pemayangtse Monastery",
    duration: "60 minutes",
    tracks: 15,
    languages: ["English", "Lepcha"],
    description: "Delve into the rich history and cultural heritage of one of Sikkim's oldest monasteries.",
    type: "History",
    size: "150 MB",
    offline: false,
  },
  {
    id: 4,
    title: "Tashiding Monastery Meditation",
    monastery: "Tashiding Monastery",
    duration: "25 minutes",
    tracks: 6,
    languages: ["English", "Nepali"],
    description: "Experience a guided meditation session amidst the serene environment of Tashiding Monastery.",
    type: "Meditation",
    size: "70 MB",
    offline: true,
  },
];

export const AudioGuide = () => {
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(1);
  const [progress, setProgress] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const { toast } = useToast();
  
  const heroRef = useScrollAnimation('scale');
  const titleRef = useScrollAnimation('up', 0.1);
  const featuresRef = useScrollAnimation('left', 0.1);
  const setGuideRef = useStaggeredScrollAnimation(4, 'stagger', 150);

  const handleStartGuide = (guide) => {
    setSelectedGuide(guide);
    setIsPlaying(true);
    toast({
      title: "Audio Guide Started",
      description: `Starting ${guide.title} in ${selectedLanguage}`,
    });
  };

  const handlePauseResume = () => {
    setIsPlaying(!isPlaying);
    toast({
      title: isPlaying ? "Audio Paused" : "Audio Resumed",
      description: isPlaying ? "Click play to continue" : "Resuming audio playback",
    });
  };

  const handleSkipTrack = (direction) => {
    const newTrack = currentTrack + direction;
    if (newTrack >= 1 && newTrack <= selectedGuide.tracks) {
      setCurrentTrack(newTrack);
      setProgress(0);
      toast({
        title: "Track Changed",
        description: `Now playing track ${newTrack} of ${selectedGuide.tracks}`,
      });
    } else {
      toast({
        title: "End of Guide",
        description: "Reached the end of the audio guide",
      });
    }
  };

  const handleDownload = (guide) => {
    toast({
      title: "Download Initiated",
      description: `Downloading ${guide.title} for offline access`,
    });
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    toast({
      title: "Language Changed",
      description: `Switched to ${language} audio`,
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
            backgroundImage: `url(${audioGuideHero})`,
            top: '-120px',
            height: 'calc(100% + 120px)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" style={{ top: '-120px', height: 'calc(100% + 120px)' }} />
        
        <div ref={heroRef} className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Audio <span className="text-primary">Guides</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Explore Monasteries with Expert Narration
          </p>
          <p className="text-lg mb-12 text-gray-300 max-w-2xl mx-auto">
            Immerse yourself in the rich history and spiritual significance of Sikkim's monasteries 
            with our professionally narrated audio guides, available in multiple languages.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => handleStartGuide(audioGuides[0])}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
            >
              <Play className="w-5 h-5 mr-2" />
              Start First Guide
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

      {/* Audio Guide Player */}
      {selectedGuide && (
        <section className="py-12 bg-muted/40">
          <div className="container mx-auto px-4">
            <Card className="max-w-3xl mx-auto bg-background/95 backdrop-blur-sm border border-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">{selectedGuide.title}</CardTitle>
                <Badge variant="secondary" className="bg-black/70 text-white">
                  <MapPin className="w-3 h-3 mr-1" />
                  {selectedGuide.monastery}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{selectedGuide.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Track {currentTrack} of {selectedGuide.tracks}</span>
                    <span className="text-muted-foreground">{selectedGuide.duration}</span>
                  </div>
                  <Progress value={progress} />

                  <div className="flex items-center justify-center space-x-4">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleSkipTrack(-1)}
                      disabled={currentTrack === 1}
                      className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                    >
                      <SkipBack className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={handlePauseResume}
                      className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleSkipTrack(1)}
                      disabled={currentTrack === selectedGuide.tracks}
                      className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                    >
                      <SkipForward className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Languages className="w-4 h-4 text-muted-foreground" />
                      <select 
                        value={selectedLanguage} 
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="bg-transparent border-none text-sm text-white outline-none"
                      >
                        {selectedGuide.languages.map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => handleDownload(selectedGuide)}
                      className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Audio Guides Grid */}
      <section id="guides-grid" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div ref={titleRef} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Our Audio Guides
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Enhance your visit with our immersive audio guides, available for 
              various monasteries and cultural sites in Sikkim.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audioGuides.map((guide, index) => (
              <Card key={guide.id} ref={setGuideRef(index)} className="group hover:shadow-heritage transition-all duration-300 bg-muted/30">
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-lg font-semibold">{guide.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{guide.monastery}</p>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{guide.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tracks:</span>
                      <span>{guide.tracks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Languages:</span>
                      <span>{guide.languages.join(", ")}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">{guide.description}</p>
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => handleStartGuide(guide)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Audio Guide
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
