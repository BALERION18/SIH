import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import monasteryImage1 from "@/assets/monastery-1.jpg";
import monasteryImage2 from "@/assets/monastery-2.jpg";
import monasteryImage3 from "@/assets/monastery-3.jpg";
import monasteryImage4 from "@/assets/monastery-4.jpg";
import monasteryImage5 from "@/assets/monastery-5.jpg";
import monasteryImage6 from "@/assets/monastery-6.jpg";

// Preload first 2 images immediately for faster initial load
const preloadImages = () => {
  [monasteryImage1, monasteryImage2].forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Call preload immediately
preloadImages();

const carouselData = [
  {
    id: 1,
    image: monasteryImage1,
    title: "Rumtek Monastery",
    description: "The largest monastery in Sikkim and seat of the Karmapa",
    location: "East Sikkim",
  },
  {
    id: 2,
    image: monasteryImage2,
    title: "Enchey Monastery",
    description: "200-year-old monastery with stunning mountain views",
    location: "Gangtok",
  },
  {
    id: 3,
    image: monasteryImage3,
    title: "Pemayangtse Monastery",
    description: "One of the oldest monasteries in Sikkim",
    location: "West Sikkim",
  },
  {
    id: 4,
    image: monasteryImage4,
    title: "Tashiding Monastery",
    description: "Sacred monastery with golden stupas and mountain views",
    location: "West Sikkim",
  },
  {
    id: 5,
    image: monasteryImage5,
    title: "Ralang Monastery",
    description: "Ancient monastery with traditional white walls and red roof",
    location: "South Sikkim",
  },
  {
    id: 6,
    image: monasteryImage6,
    title: "Dubdi Monastery",
    description: "Historic monastery with ornate architecture at sunset",
    location: "West Sikkim",
  },
];

export const SikkimCarousel = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0, 1])); // Preload first 2 images

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      const newCurrent = api.selectedScrollSnap();
      setCurrent(newCurrent);
      
      // Progressive loading - load current and next 2 images
      const imagesToLoad = new Set(loadedImages);
      for (let i = newCurrent; i < Math.min(newCurrent + 3, carouselData.length); i++) {
        imagesToLoad.add(i);
      }
      setLoadedImages(imagesToLoad);
    });
  }, [api, loadedImages]);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <Carousel
        setApi={setApi}
        className="w-full"
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
      >
        <CarouselContent>
          {carouselData.map((item, index) => (
            <CarouselItem key={item.id}>
              <div className="relative h-[400px] rounded-xl overflow-hidden group shadow-monastery">
                {loadedImages.has(index) ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    loading={index < 2 ? "eager" : "lazy"}
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onLoad={() => {
                      // Trigger loading of next image after current loads
                      if (index + 1 < carouselData.length) {
                        setLoadedImages(prev => new Set([...prev, index + 1]));
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-muted/30 animate-pulse flex items-center justify-center">
                    <div className="text-muted-foreground">Loading...</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="space-y-2 animate-fade-in">
                    <div className="flex items-center space-x-2 text-sm text-primary-glow">
                      <span className="w-2 h-2 bg-primary-glow rounded-full animate-glow-pulse" />
                      <span>{item.location}</span>
                    </div>
                    <h3 className="text-2xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Carousel Indicators */}
      <div className="flex justify-center space-x-2 mt-4">
        {carouselData.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current
                ? "bg-primary shadow-glow"
                : "bg-muted hover:bg-muted-foreground"
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};